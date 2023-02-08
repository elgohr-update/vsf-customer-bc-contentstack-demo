import { useContext, ref } from '@nuxtjs/composition-api';
import { storeToRefs } from 'pinia';
import { useCartStore } from '~/stores/cart';
import {
  AuthCustomerParams,
  COOKIE_KEY_CUSTOMER_DATA,
  CreateCustomerParameters,
  CustomersIncludeEnum,
  UpdateCustomerParameters
} from '@vsf-enterprise/bigcommerce-api';
import { useCustomerStore } from '~/stores/customer';
import { UseUserErrors, UseUserInterface } from './types';
import {
  BIGCOMMERCE_USER_AUTHENTICATED,
  BIGCOMMERCE_COOKIE_MAXAGE
} from '~/composables/useUser/helpers';
import { useCart, useLogger } from '~/composables';

/**
 * @public
 *
 * Allows loading and manipulating current user information.
 *
 * See the {@link UseUserInterface} for a list of methods and values available in this composable.
 */
export function useUser(): UseUserInterface {
  const { $bigcommerce } = useContext();
  const { load: loadCart, loadCustomerCart } = useCart();
  const customerStore = useCustomerStore();
  const cartStore = useCartStore();
  const { Logger } = useLogger();

  const { currentCustomer } = storeToRefs(customerStore);
  const { cart } = storeToRefs(cartStore);

  const loading = ref(false);
  const error = ref<UseUserErrors>({
    load: null,
    login: null,
    logout: null,
    register: null,
    updateCustomer: null
  });

  const load = async () => {
    try {
      loading.value = true;
      error.value.load = null;
      const cookies = $bigcommerce.config.app.$cookies;
      const cookieExist = Boolean(cookies.get(COOKIE_KEY_CUSTOMER_DATA));

      const { data: customers } = await $bigcommerce.api.getCustomers({
        include: CustomersIncludeEnum.Formfields
      });
      const customer = customers?.[0];

      if (!customer) {
        if (cookieExist) {
          throw new Error('Retrieving user data failed.');
        }

        return;
      }

      currentCustomer.value = customer;
      cookies.set(BIGCOMMERCE_USER_AUTHENTICATED, '1', {
        path: '/',
        maxAge: BIGCOMMERCE_COOKIE_MAXAGE
      });

      await loadCustomerCart();
    } catch (err) {
      Logger.error('useUser/load', err);
      error.value.load = err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      loading.value = true;
      error.value.logout = null;

      const cookies = $bigcommerce.config.app.$cookies;

      await $bigcommerce.api.logoutCustomer();

      currentCustomer.value = null;

      cookies.set(BIGCOMMERCE_USER_AUTHENTICATED, '0', {
        path: '/',
        maxAge: BIGCOMMERCE_COOKIE_MAXAGE
      });

      await loadCart(Boolean(cart.value?.customer_id));

      return true;
    } catch (err) {
      Logger.error('useUser/logout', err);
      error.value.logout = err;
    } finally {
      loading.value = false;
    }
  };

  const login = async (credentials: AuthCustomerParams) => {
    try {
      loading.value = true;
      error.value.login = null;
      const cookies = $bigcommerce.config.app.$cookies;

      const { is_valid: areCredentialsValid } =
        await $bigcommerce.api.loginCustomer({
          email: credentials.email,
          password: credentials.password
        });

      if (!areCredentialsValid) {
        throw new Error('Credentials are invalid.');
      }

      const { data: customers } = await $bigcommerce.api.getCustomers({
        include: CustomersIncludeEnum.Formfields
      });

      const customer = customers?.[0];

      if (!customer) {
        await logout();
        throw new Error('Retrieving user data failed.');
      }

      currentCustomer.value = customer;
      cookies.set(BIGCOMMERCE_USER_AUTHENTICATED, '1', {
        path: '/',
        maxAge: BIGCOMMERCE_COOKIE_MAXAGE
      });

      await loadCustomerCart();
      return true;
    } catch (err) {
      await logout();
      Logger.error('useUser/login', err);
      error.value.login = err;
    } finally {
      loading.value = false;
    }
  };

  const register = async (user: CreateCustomerParameters) => {
    try {
      loading.value = true;
      error.value.register = null;

      await $bigcommerce.api.createCustomer({
        ...user,
        custom_fields: []
      });

      await login(user);

      return true;
    } catch (err) {
      Logger.error('useUser/register', err);
      error.value.register = err;
    } finally {
      loading.value = false;
    }
  };

  const updateCustomer = async (parameters: UpdateCustomerParameters) => {
    try {
      loading.value = true;
      error.value.updateCustomer = null;

      const updatedCustomer = await $bigcommerce.api.updateCustomer(parameters);

      if (!updatedCustomer?.data?.[0])
        throw new Error('Failed to update customer');

      currentCustomer.value = updatedCustomer?.data?.[0];
    } catch (err) {
      Logger.error('useUser/updateCustomer', err);
      error.value.updateCustomer = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    load,
    login,
    logout,
    register,
    updateCustomer
  };
}
