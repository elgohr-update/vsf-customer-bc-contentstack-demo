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

const setCookie = jest.fn();
const api = {
  logoutCustomer: jest.fn(),
  loginCustomer: jest.fn(),
  getCustomers: jest.fn()
};
const useCartMocks = {
  loadCustomerCart: jest.fn(),
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

describe('[bigcommerce-theme] useUser login method', () => {
  createTestingPinia();
  const customerStore = useCustomerStore();
  const userMock = mockUser();
  const VALID_CUSTOMER = { is_valid: true };
  const AUTH_PARAMS = {
    email: 'email',
    password: 'password'
  };

  beforeEach(() => {
    jest.resetAllMocks();
    api.loginCustomer.mockResolvedValue(VALID_CUSTOMER);
    api.getCustomers.mockResolvedValue({ data: [userMock] });
  });

  it('should call loginCustomer api endpoint', async () => {
    // given
    const { login } = useUser();

    // when
    await login(AUTH_PARAMS);

    // then
    expect(api.loginCustomer).toHaveBeenCalledWith(AUTH_PARAMS);
  });

  it('should call getCustomers api endpoint', async () => {
    // given
    const { login } = useUser();

    // when
    await login(AUTH_PARAMS);

    // then
    expect(api.getCustomers).toHaveBeenCalledWith({
      include: CustomersIncludeEnum.Formfields
    });
  });

  it('should logout if there is no customer', async () => {
    // given
    const { login } = useUser();
    api.getCustomers.mockResolvedValueOnce({ data: null });
    const COOKIE_NAME = BIGCOMMERCE_USER_AUTHENTICATED;
    const COOKIE_VALUE = '0';
    const COOKIE_ATTRIBUTE = {
      path: '/',
      maxAge: BIGCOMMERCE_COOKIE_MAXAGE
    };

    // when
    await login(AUTH_PARAMS);

    // then
    expect(api.logoutCustomer).toHaveBeenCalled();
    expect(setCookie).toHaveBeenCalledWith(
      COOKIE_NAME,
      COOKIE_VALUE,
      COOKIE_ATTRIBUTE
    );
  });

  it('should use loadCustomerCart of useCart', async () => {
    // given
    const { login } = useUser();

    // when
    await login(AUTH_PARAMS);

    // then
    expect(useCartMocks.loadCustomerCart).toHaveBeenCalled();
  });

  it('should store current customer into customerStore', async () => {
    // given
    const { login } = useUser();

    // when
    await login(AUTH_PARAMS);

    // then
    expect(customerStore.currentCustomer).toBe(userMock);
  });

  it('should set cookies for authenticated users', async () => {
    // given
    const { login } = useUser();
    const COOKIE_NAME = BIGCOMMERCE_USER_AUTHENTICATED;
    const COOKIE_VALUE = '1';
    const COOKIE_ATTRIBUTES = {
      path: '/',
      maxAge: BIGCOMMERCE_COOKIE_MAXAGE
    };

    // when
    await login(AUTH_PARAMS);

    // then
    expect(setCookie).toHaveBeenCalledWith(
      COOKIE_NAME,
      COOKIE_VALUE,
      COOKIE_ATTRIBUTES
    );
  });

  it('should logout and set up error in case of failure', async () => {
    // given
    const MOCKED_ERROR = 'Mocked error';
    api.loginCustomer.mockRejectedValueOnce(new Error(MOCKED_ERROR));
    const { login, error } = useUser();

    // when
    await login(AUTH_PARAMS);

    // then
    expect(api.logoutCustomer).toHaveBeenCalled();
    expect(error.value.login instanceof Error).toBe(true);
    expect(error.value.login.message).toBe(MOCKED_ERROR);
  });

  it('should throw if credentials are not valid', async () => {
    // given
    const CREDENTIALS_NOT_VALID = 'Credentials are invalid.';
    api.loginCustomer.mockResolvedValueOnce(new Error(CREDENTIALS_NOT_VALID));
    const { login, error } = useUser();

    // when
    await login(AUTH_PARAMS);

    // then
    expect(error.value.login instanceof Error).toBe(true);
    expect(error.value.login.message).toBe(CREDENTIALS_NOT_VALID);
  });
});
