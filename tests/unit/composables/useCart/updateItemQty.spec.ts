import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { useCartStore } from '~/stores/cart';
import { useCart } from '~/composables/useCart';
import { mockCart } from '~/tests/__mocks__/cart.mock';
import { BIGCOMMERCE_USER_CART_KEY } from '~/composables/useUser/helpers';
import { getCartIncludeParamValue } from '~/composables/useCart/helpers';

const api = {
  updateCartItem: jest.fn()
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

describe('[BigCommerce - composables] useCart updateItemQty method', () => {
  createTestingPinia();

  const cartMock = mockCart();
  const cartStore = useCartStore();
  cartStore.cart = cartMock;
  const CART_ITEM = cartMock.line_items.physical_items[0];
  const QUANTITY = 3;

  const { updateItemQty, error } = useCart();

  it('should update the quantity of a cart item', async () => {
    api.updateCartItem.mockResolvedValue({ data: cartMock });

    await updateItemQty(CART_ITEM, QUANTITY);

    expect(api.updateCartItem).toHaveBeenCalledWith({
      cartId: cartMock.id,
      itemId: String(CART_ITEM.id),
      include: getCartIncludeParamValue(),
      data: {
        line_item: {
          quantity: QUANTITY,
          product_id: Number(CART_ITEM.product_id)
        }
      }
    });
    expect(cartStore.cart).toEqual(cartMock);
  });

  it('should set updateItemQty error when updateItemQty fails', async () => {
    const ERROR_MESSAGE = 'Update fails.';
    api.updateCartItem.mockRejectedValueOnce(ERROR_MESSAGE);

    await updateItemQty(CART_ITEM, QUANTITY);

    expect(error.value.updateItemQty).toBe(ERROR_MESSAGE);
  });
});
