import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { useCartStore } from '~/stores/cart';
import { useCart } from '~/composables/useCart';
import { mockCart } from '~/tests/__mocks__/cart.mock';
import { mockEmptyCart } from '~/tests/__mocks__/emptyCart.mock';
import { BIGCOMMERCE_USER_CART_KEY } from '~/composables/useUser/helpers';
import { getCartIncludeParamValue } from '~/composables/useCart/helpers';

const api = {
  removeCartItem: jest.fn(),
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

  const cartStore = useCartStore();
  const cartMock = mockCart();
  const emptyCartMock = mockEmptyCart();

  const { removeItem, error } = useCart();

  beforeEach(() => {
    jest.resetAllMocks();

    cartStore.cart = cartMock;
  });

  it('should remove an item from the cart', async () => {
    api.removeCartItem.mockResolvedValue({ data: emptyCartMock });
    const CART_ITEM = cartMock.line_items.physical_items[0];

    await removeItem(cartMock.line_items.physical_items[0]);

    expect(api.removeCartItem).toHaveBeenCalledWith({
      cartId: cartMock.id,
      itemId: String(CART_ITEM.id),
      include: getCartIncludeParamValue()
    });

    expect(cartStore.cart).toStrictEqual(emptyCartMock);
  });

  it('should create a new cart when the last item is removed from the previous one', async () => {
    api.removeCartItem.mockResolvedValue({ data: undefined });
    api.createCart.mockResolvedValue({ data: emptyCartMock });
    cookies.get.mockReturnValue(undefined);

    await removeItem(cartMock.line_items.physical_items[0]);

    expect(cartStore.cart).toEqual(emptyCartMock);
    expect(api.createCart).toHaveBeenCalled();
  });

  it('should set removeItem error if create fails', async () => {
    const ERROR_MESSAGE = 'Create error.';
    api.removeCartItem.mockRejectedValueOnce(ERROR_MESSAGE);

    await removeItem(cartMock.line_items.physical_items[0]);

    expect(error.value.removeItem).toBe(ERROR_MESSAGE);
  });
});
