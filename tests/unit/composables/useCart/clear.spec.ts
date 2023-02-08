import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { useCartStore } from '~/stores/cart';
import { useCart } from '~/composables/useCart';
import { mockEmptyCart } from '~/tests/__mocks__/emptyCart.mock';
import { BIGCOMMERCE_USER_CART_KEY } from '~/composables/useUser/helpers';
import { mockCart } from '~/tests/__mocks__/cart.mock';
import { COOKIE_KEY_CART_ID } from '@vsf-enterprise/bigcommerce-api';

const api = {
  deleteCart: jest.fn(),
  createCart: jest.fn()
};

const cookies = {
  remove: jest.fn(),
  set: jest.fn(),
  get: jest.fn()
};

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
          bigcommerceCookieMaxAge: 123
        }
      }
    })
  };
});

describe('[bigcommerce-theme] useCart removeItem method', () => {
  createTestingPinia();

  const { clear, error } = useCart();

  const cartStore = useCartStore();
  const cartMock = mockCart();
  const emptyCartMock = mockEmptyCart();

  beforeEach(() => {
    jest.resetAllMocks();

    cartStore.cart = cartMock;
    api.createCart.mockResolvedValue(emptyCartMock);
  });

  it('should delete the cart and create a new one', async () => {
    await clear();

    expect(api.deleteCart).toHaveBeenCalledWith({
      id: cartMock.id
    });
    expect(api.createCart).toHaveBeenCalled();
    expect(cookies.remove).toHaveBeenCalledWith(COOKIE_KEY_CART_ID);
  });

  it('should set clear error when deleteCart fails', async () => {
    const ERROR_MESSAGE = 'Clear fails.';
    api.deleteCart.mockRejectedValueOnce(ERROR_MESSAGE);

    await clear();

    expect(error.value.clear).toBe(ERROR_MESSAGE);
  });
});
