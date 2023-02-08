import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { COOKIE_KEY_CART_ID } from '@vsf-enterprise/bigcommerce-api';
import { BIGCOMMERCE_USER_CART_KEY } from '~/composables/useUser/helpers';
import { useCart } from '~/composables/useCart';
import {
  getCartIncludeParamValue,
  trimObjectToLineItem
} from '~/composables/useCart/helpers';
import { useCartStore } from '~/stores/cart';
import { useCustomerStore } from '~/stores/customer';
import { mockCart } from '~/tests/__mocks__/cart.mock';
import { mockUser } from '~/tests/__mocks__/user.mock';

const api = {
  getCart: jest.fn(),
  createCart: jest.fn(),
  addCartItems: jest.fn(),
  updateCart: jest.fn(),
  updateCustomerFormFields: jest.fn()
};

const cookies = {
  remove: jest.fn(),
  set: jest.fn()
};

const bigcommerceCookieMaxAge = 123;
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
          bigcommerceCookieMaxAge
        }
      }
    })
  };
});

describe('[bigcommerce-theme] useCart loadCustomerCart method', () => {
  createTestingPinia();

  const { loadCustomerCart, error } = useCart();

  const customerStore = useCustomerStore();
  const cartStore = useCartStore();

  const userMock = mockUser();
  const cartMock = mockCart();
  const userCartMock = mockCart();

  beforeEach(() => {
    jest.resetAllMocks();

    customerStore.currentCustomer = userMock;
    cartStore.cart = cartMock;

    userCartMock.customer_id = USER_ID;
    api.getCart.mockResolvedValue({ data: userCartMock });
    api.createCart.mockResolvedValue({ data: userCartMock });
    api.addCartItems.mockResolvedValue({ data: userCartMock });
    api.updateCart.mockResolvedValue({ data: userCartMock });
  });

  it('should fetch user cart and remove COOKIE_KEY_CART_ID', async () => {
    // given
    const USER_CART_ID = userMock.form_fields[0].value;

    // when
    await loadCustomerCart();

    // then
    expect(api.getCart).toBeCalledWith({
      id: USER_CART_ID,
      include: getCartIncludeParamValue()
    });
    expect(cookies.remove).toHaveBeenCalledWith(COOKIE_KEY_CART_ID);
  });

  it('should assign current cart to customer if customer does not have cart yet', async () => {
    // given
    api.getCart.mockResolvedValue({ data: null });
    const COOKIE_ATTRIBUTES = {
      path: '/',
      maxAge: bigcommerceCookieMaxAge
    };

    // when
    await loadCustomerCart();

    // then
    expect(cookies.set).toHaveBeenCalledWith(
      COOKIE_KEY_CART_ID,
      cartMock.id,
      COOKIE_ATTRIBUTES
    );
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
    expect(cartStore.cart).toBe(userCartMock);
  });

  it('should use user cart if current cart is not a guest cart', async () => {
    // given
    cartStore.cart = {
      ...cartMock,
      customer_id: USER_ID,
      id: 'old-cart-with-different-id'
    };

    // when
    await loadCustomerCart();

    // then
    expect(cartStore.cart).toBe(userCartMock);
  });

  it('should merge user cart with guest cart and set it as current one', async () => {
    // given
    const { loadCustomerCart } = useCart();
    const MERGE_PARAMS = {
      cartId: userCartMock.id,
      include: getCartIncludeParamValue(),
      data: {
        line_items: [
          ...cartStore.cart.line_items.digital_items,
          ...cartStore.cart.line_items.physical_items.map((item) =>
            trimObjectToLineItem(item)
          )
        ]
      }
    };

    // when
    await loadCustomerCart();

    // then
    expect(api.addCartItems).toHaveBeenCalledWith(MERGE_PARAMS);
  });

  it('should crate new cart when merging throws', async () => {
    // given
    api.addCartItems.mockRejectedValueOnce('Merge failed.');
    const CREATE_CART_PARAMS = {
      data: {
        line_items: []
      },
      include: getCartIncludeParamValue()
    };

    // when
    await loadCustomerCart();

    // then
    expect(api.createCart).toHaveBeenCalledWith(CREATE_CART_PARAMS);
  });

  it('should set up the error when creating new cart throws', async () => {
    // given
    const ERROR_MESSAGE = 'Create failed.';
    api.addCartItems.mockRejectedValueOnce('Merge failed.');
    api.createCart.mockRejectedValueOnce(ERROR_MESSAGE);

    // when
    await loadCustomerCart();

    // then
    expect(error.value.loadCustomerCart).toBe(ERROR_MESSAGE);
  });
});
