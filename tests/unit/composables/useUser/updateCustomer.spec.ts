import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { UpdateCustomerParameters } from '@vsf-enterprise/bigcommerce-api';
import { useUser } from '~/composables/useUser';
import { useCustomerStore } from '~/stores/customer';
import { mockUser } from '~/tests/__mocks__/user.mock';
import { BIGCOMMERCE_USER_CART_KEY } from '~/composables/useUser/helpers';
const api = {
  updateCustomer: jest.fn()
};

const setCookie = jest.fn();

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
      },
      $config: {
        theme: {
          userCartKey: BIGCOMMERCE_USER_CART_KEY
        }
      }
    })
  };
});

describe('[bigcommerce-theme] useUser updateCustomer method', () => {
  createTestingPinia();
  const customerStore = useCustomerStore();
  const userMock = mockUser();
  const UPDATE_CUSTOMER_PARAMS: UpdateCustomerParameters = {
    validation: {
      email: 'example@email.com',
      password: 'password'
    },
    first_name: 'FooBar'
  };

  beforeEach(() => {
    jest.resetAllMocks();
    api.updateCustomer.mockResolvedValue({ data: [userMock] });
  });

  it('should call updateCustomer with update params', async () => {
    // given
    const { updateCustomer } = useUser();

    // when
    await updateCustomer(UPDATE_CUSTOMER_PARAMS);

    // then
    expect(api.updateCustomer).toHaveBeenCalledWith(UPDATE_CUSTOMER_PARAMS);
  });

  it('should set current customer in customerStore', async () => {
    // given
    const { updateCustomer } = useUser();

    // when
    await updateCustomer(UPDATE_CUSTOMER_PARAMS);

    // then
    expect(customerStore.currentCustomer).toBe(userMock);
  });

  it('should set up updateCustomer error', async () => {
    // given
    const MOCKED_ERROR = 'Mocked error';
    api.updateCustomer.mockRejectedValue(new Error(MOCKED_ERROR));
    const { updateCustomer, error } = useUser();

    // when
    await updateCustomer(UPDATE_CUSTOMER_PARAMS);

    // then
    expect(error.value.updateCustomer instanceof Error).toBe(true);
    expect(error.value.updateCustomer.message).toBe(MOCKED_ERROR);
  });
});
