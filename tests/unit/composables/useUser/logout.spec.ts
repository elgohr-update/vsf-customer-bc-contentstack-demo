import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { useUser } from '~/composables/useUser';
import {
  BIGCOMMERCE_USER_AUTHENTICATED,
  BIGCOMMERCE_COOKIE_MAXAGE
} from '~/composables/useUser/helpers';
import { useCustomerStore } from '~/stores/customer';
import { useCartStore } from '~/stores/cart';
import { mockUser } from '~/tests/__mocks__/user.mock';

const setCookie = jest.fn();
const api = {
  logoutCustomer: jest.fn()
};
const useCartMocks = {
  load: jest.fn()
};

jest.mock('~/composables/useCart', () => {
  const originalModule = jest.requireActual('~/composables/useCart');

  return {
    __esModule: true,
    ...originalModule,
    useCart: () => ({ ...useCartMocks })
  };
});

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api,
        config: {
          app: {
            $cookies: {
              set: setCookie
            }
          }
        }
      }
    })
  };
});

describe('[bigcommerce-theme] useUser logout method', () => {
  createTestingPinia();
  const customerStore = useCustomerStore();
  const cartStore = useCartStore();
  const userMock = mockUser();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call logoutCustomer api endpoint', async () => {
    // given
    const { logout } = useUser();

    // when
    await logout();

    // then
    expect(api.logoutCustomer).toHaveBeenCalled();
  });

  it('should clear currentCustomer in customerStore', async () => {
    // given
    customerStore.currentCustomer = userMock;
    const { logout } = useUser();

    // when
    await logout();

    // then
    expect(customerStore.currentCustomer).toBe(null);
  });

  it('should set cookie for authenticated users to 0', async () => {
    // given
    const { logout } = useUser();
    const COOKIE_NAME = BIGCOMMERCE_USER_AUTHENTICATED;
    const COOKIE_VALUE = '0';
    const COOKIE_ATTRIBUTE = {
      path: '/',
      maxAge: BIGCOMMERCE_COOKIE_MAXAGE
    };

    // when
    await logout();

    // then
    expect(setCookie).toHaveBeenCalledWith(COOKIE_NAME, COOKIE_VALUE, COOKIE_ATTRIBUTE);
  });

  it('should load cart with forcing new one', async () => {
    // given
    cartStore.cart.customer_id = 1;
    const { logout } = useUser();

    // when
    await logout();

    // then
    expect(useCartMocks.load).toHaveBeenCalledWith(true);
  });

  it('should set up logout error', async () => {
    // given
    const MOCKED_ERROR = 'Mocked error';
    api.logoutCustomer.mockImplementationOnce(() => {
      throw new Error(MOCKED_ERROR);
    });
    const { logout, error } = useUser();

    // when
    await logout();

    // then
    expect(error.value.logout instanceof Error).toBe(true);
    expect(error.value.logout.message).toBe(MOCKED_ERROR);
  });
});
