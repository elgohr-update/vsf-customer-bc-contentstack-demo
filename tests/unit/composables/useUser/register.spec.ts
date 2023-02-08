import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { useUser } from '~/composables/useUser';
import { mockCreateUserParams } from '~/tests/__mocks__/createUserParams.mock';

const api = {
  createCustomer: jest.fn(),
  loginCustomer: jest.fn()
};

const useCartMocks = {
  loadCustomerCart: jest.fn(),
  load: jest.fn()
};

const setCookie = jest.fn();

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

describe('[bigcommerce-theme] useUser register method', () => {
  createTestingPinia();
  const createUserParams = mockCreateUserParams();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call createCustomer endpoint', async () => {
    // given
    const { register } = useUser();

    // when
    await register(createUserParams);

    // then
    expect(api.createCustomer).toHaveBeenCalledWith({
      ...createUserParams,
      custom_fields: []
    });
  });

  it('should login', async () => {
    // given
    const { register } = useUser();

    // when
    await register(createUserParams);

    // then
    expect(api.loginCustomer).toHaveBeenCalledWith({
      email: createUserParams.email,
      password: createUserParams.password
    });
  });

  it('should set up register error', async () => {
    // given
    const MOCKED_ERROR = 'Mocked error';
    api.createCustomer.mockRejectedValue(new Error(MOCKED_ERROR));
    const { register, error } = useUser();

    // when
    await register(createUserParams);

    // then
    expect(error.value.register instanceof Error).toBe(true);
    expect(error.value.register.message).toBe(MOCKED_ERROR);
  });
});
