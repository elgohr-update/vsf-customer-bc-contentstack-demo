import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { COOKIE_KEY_CART_ID } from '@vsf-enterprise/bigcommerce-api';
import { BIGCOMMERCE_USER_CART_KEY } from '~/composables/useUser/helpers';
import { useCart } from '~/composables/useCart';
import {
  getCartIncludeParamValue
} from '~/composables/useCart/helpers';
import { useCustomerStore } from '~/stores/customer';
import { mockCart } from '~/tests/__mocks__/cart.mock';
import { mockUser } from '~/tests/__mocks__/user.mock';

const api = {
  getCart: jest.fn(),
  createCart: jest.fn(),
  updateCart: jest.fn(),
  updateCustomerFormFields: jest.fn()
};

const cookies = {
  remove: jest.fn(),
  set: jest.fn(),
  get: jest.fn()
};

const COOKIE_MAX_AGE = 123;
const USER_ID = 1;

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
            $cookies: cookies
          }
        }
      },
      $config: {
        theme: {
          userCartKey: BIGCOMMERCE_USER_CART_KEY,
          bigcommerceCookieMaxAge: COOKIE_MAX_AGE
        }
      }
    })
  };
});

describe('[bigcommerce-theme] useCart load method', () => {
  createTestingPinia();

  const { load, error } = useCart();

  const customerStore = useCustomerStore();

  const userMock = mockUser();
  const cartMock = mockCart();
  const userCartMock = mockCart();

  beforeEach(() => {
    jest.resetAllMocks();

    customerStore.currentCustomer = null;

    userCartMock.customer_id = USER_ID;
    api.getCart.mockResolvedValue({ data: cartMock });
    api.createCart.mockResolvedValue({ data: cartMock });
    api.updateCart.mockResolvedValue({ data: userCartMock });
    cookies.get.mockReturnValue(cartMock.id);
  });

  it('should create a new cart if no cart_id cookie found', async () => {
    cookies.get.mockReturnValueOnce(null);
    const CREATE_CART_PARAMS = {
      data: {
        line_items: []
      },
      include: getCartIncludeParamValue()
    };
    const COOKIE_ATTRIBUTES = {
      path: '/',
      maxAge: COOKIE_MAX_AGE
    };

    await load();

    expect(api.createCart).toHaveBeenCalledWith(CREATE_CART_PARAMS);
    expect(cookies.set).toHaveBeenCalledWith(
      COOKIE_KEY_CART_ID,
      cartMock.id,
      COOKIE_ATTRIBUTES
    );
  });

  it('should create new cart if forceNew is set to true', async () => {
    const CREATE_CART_PARAMS = {
      data: {
        line_items: []
      },
      include: getCartIncludeParamValue()
    };

    await load(true);

    expect(api.createCart).toHaveBeenCalledWith(CREATE_CART_PARAMS);
  });

  it('should assign new cart to customer if user is authenticated', async () => {
    cookies.get.mockReturnValueOnce(null);
    customerStore.currentCustomer = userMock;
    const CREATE_CART_PARAMS = {
      data: {
        line_items: []
      },
      include: getCartIncludeParamValue()
    };
    const COOKIE_ATTRIBUTES = {
      path: '/',
      maxAge: COOKIE_MAX_AGE
    };

    await load();

    expect(api.createCart).toHaveBeenCalledWith(CREATE_CART_PARAMS);
    expect(api.updateCart).toHaveBeenCalledWith({
      id: cartMock.id,
      include: getCartIncludeParamValue()
    });
    expect(api.updateCustomerFormFields).toHaveBeenCalledWith({
      data: [
        {
          name: BIGCOMMERCE_USER_CART_KEY,
          value: cartMock.id
        }
      ]
    });
    expect(cookies.set).toHaveBeenCalledWith(
      COOKIE_KEY_CART_ID,
      userCartMock.id,
      COOKIE_ATTRIBUTES
    );
  });

  it('should fetch a cart when cart_id cookie is set', async () => {
    await load();

    expect(api.getCart).toBeCalledWith({
      id: cartMock.id,
      include: getCartIncludeParamValue()
    });
  });

  it('should create new cart if fetching fails', async () => {
    api.getCart.mockRejectedValueOnce('Fetch error.');
    const CREATE_CART_PARAMS = {
      data: {
        line_items: []
      },
      include: getCartIncludeParamValue()
    };

    await load();

    expect(api.createCart).toHaveBeenCalledWith(CREATE_CART_PARAMS);
  });

  it('should set load error if create fails', async () => {
    const ERROR_MESSAGE = 'Create error.';
    api.getCart.mockRejectedValueOnce('Fetch error.');
    api.createCart.mockRejectedValueOnce(ERROR_MESSAGE);

    await load();

    expect(error.value.load).toBe(ERROR_MESSAGE);
  });
});
