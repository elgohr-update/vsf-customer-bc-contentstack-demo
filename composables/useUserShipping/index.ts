import { useLogger } from '~/composables/useLogger';
import { ref, useContext } from '@nuxtjs/composition-api';
import { UseUserShippingErrors, UseUserShippingInterface } from './types';
import {
  UserAddress,
  CustomersIncludeEnum,
  GetAddressParameters
} from '@vsf-enterprise/bigcommerce-api';
import { useCustomerStore } from '~/stores/customer';
import { storeToRefs } from 'pinia';

/**
 * @public
 *
 * Allows loading and manipulating shipping addresses of the current user.
 *
 * See the {@link UseUserShippingInterface} for a list of methods and values available in this composable.
 */
export function useUserShipping(): UseUserShippingInterface {
  const { $bigcommerce } = useContext();
  const { Logger } = useLogger();
  const customerStore = useCustomerStore();
  const { shipping } = storeToRefs(customerStore);

  const error = ref<UseUserShippingErrors>({
    load: null,
    addAddress: null,
    deleteAddress: null,
    updateAddress: null
  });

  const loading = ref(false);

  const load = async (params?: GetAddressParameters) => {
    const getCustomerAddressParams = {
      ...(params || {}),
      include: CustomersIncludeEnum.Formfields
    };
    try {
      loading.value = true;
      error.value.load = null;

      const { data: addresses } = await $bigcommerce.api.getCustomerAddress(
        getCustomerAddressParams
      );

      shipping.value = addresses || [];
    } catch (err) {
      Logger.error('useUserShipping/load', err);

      error.value.load = err;
    } finally {
      loading.value = false;
    }
  };

  const addAddress = async (address: UserAddress) => {
    try {
      loading.value = true;
      error.value.addAddress = null;

      const { data } = await $bigcommerce.api.createCustomerAddress(address);

      shipping.value = [...(data ?? [])];
    } catch (err) {
      Logger.error('useUserShipping/addAddress', err);

      error.value.addAddress = err;
    } finally {
      loading.value = false;
    }
  };

  const deleteAddress = async (address: UserAddress) => {
    try {
      loading.value = true;
      error.value.deleteAddress = null;

      await $bigcommerce.api.deleteCustomerAddress({
        'id:in': [address.id]
      });

      shipping.value = [
        ...(shipping.value?.filter((a) => a.id !== address.id) ?? [])
      ];
    } catch (err) {
      Logger.error('useUserShipping/deleteAddress', err);

      error.value.deleteAddress = err;
    } finally {
      loading.value = false;
    }
  };

  const updateAddress = async (address: UserAddress) => {
    try {
      loading.value = true;
      error.value.updateAddress = null;

      const { data } = await $bigcommerce.api.updateCustomerAddress(address);

      shipping.value = [
        ...(shipping.value?.filter((a) => a.id !== address.id) ?? []),
        ...(data ?? [address])
      ];
    } catch (err) {
      Logger.error('useUserShipping/updateAddress', err);

      error.value.updateAddress = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    load,
    addAddress,
    deleteAddress,
    updateAddress,
    loading,
    error
  };
}
