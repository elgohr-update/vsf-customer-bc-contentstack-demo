import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { CustomersIncludeEnum } from '@vsf-enterprise/bigcommerce-api';
import { useUser } from '~/composables/useUser';
import {
  BIGCOMMERCE_USER_AUTHENTICATED,
  BIGCOMMERCE_COOKIE_MAXAGE
} from '~/composables/useUser/helpers';
import { useCustomerStore } from '~/stores/customer';
import { mockUser } from '~/tests/__mocks__/user.mock';

const api = {
  getCustomers: jest.fn()
};

const useCartMocks = {
  loadCustomerCart: jest.fn()
};

const setCookie = jest.fn();
const getCookie = jest.fn();

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
              set: setCookie,
              get: getCookie
            }
          }
        }
      }
    })
  };
});

describe('[bigcommerce-theme] useUser load method', () => {
  createTestingPinia();
  const customerStore = useCustomerStore();
  const userMock = mockUser();

  beforeEach(() => {
    jest.resetAllMocks();
    api.getCustomers.mockResolvedValue({ data: [userMock] });
  });

  it('should get user with form fields', async () => {
    // given
    getCookie.mockReturnValue('customer-data');
    const { load } = useUser();

    // when
    await load();

    // then
    expect(api.getCustomers).toHaveBeenCalledWith({
      include: CustomersIncludeEnum.Formfields
    });
  });

  it('should store current customer into customerStore', async () => {
    // given
    getCookie.mockReturnValue('customer-data');
    const { load } = useUser();

    // when
    await load();

    // then
    expect(customerStore.currentCustomer).toBe(userMock);
  });

  it('should load customer cart', async () => {
    // given
    const { load } = useUser();

    // when
    await load();

    // then
    expect(useCartMocks.loadCustomerCart).toHaveBeenCalled();
  });

  it('should set cookies for authenticated users', async () => {
    // given
    getCookie.mockReturnValue('customer-data');
    const { load } = useUser();
    const COOKIE_NAME = BIGCOMMERCE_USER_AUTHENTICATED;
    const COOKIE_VALUE = '1';
    const COOKIE_ATTRIBUTES = {
      path: '/',
      maxAge: BIGCOMMERCE_COOKIE_MAXAGE
    };

    // when
    await load();

    // then
    expect(setCookie).toHaveBeenCalledWith(
      COOKIE_NAME,
      COOKIE_VALUE,
      COOKIE_ATTRIBUTES
    );
  });

  it('should throw an error when there is no customer', async () => {
    // given
    getCookie.mockReturnValue('customer-data');
    const NO_CUSTOMER_ERROR = 'Retrieving user data failed.';
    api.getCustomers.mockResolvedValueOnce({ data: null });
    const { load, error } = useUser();

    // when
    await load();

    // then
    expect(error.value.load instanceof Error).toBe(true);
    expect(error.value.load.message).toBe(NO_CUSTOMER_ERROR);
  });

  it('should set up load error', async () => {
    // given
    getCookie.mockReturnValue('customer-data');
    const MOCKED_ERROR = 'Mocked error';
    api.getCustomers.mockRejectedValue(new Error(MOCKED_ERROR));
    const { load, error } = useUser();

    // when
    await load();

    // then
    expect(error.value.load instanceof Error).toBe(true);
    expect(error.value.load.message).toBe(MOCKED_ERROR);
  });
});
