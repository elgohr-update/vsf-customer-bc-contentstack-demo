import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { useCartStore } from '~/stores/cart';
import { useCart } from '~/composables/useCart';
import { mockCart } from '~/tests/__mocks__/cart.mock';
import { mockedProduct } from '~/tests/__mocks__/product.mock';
import { BIGCOMMERCE_USER_CART_KEY } from '~/composables/useUser/helpers';
import { getCartIncludeParamValue } from '~/composables/useCart/helpers';
import { mockEmptyCart } from '~/tests/__mocks__/emptyCart.mock';
import { getPurchasableDefaultVariant } from '~/composables/useProduct/helpers';

const api = {
  addCartItems: jest.fn()
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

describe('[bigcommerce-theme] useCart addItem method', () => {
  createTestingPinia();

  const cartStore = useCartStore();
  const emptyCartMock = mockEmptyCart();
  const cartMock = mockCart();

  cartStore.cart = emptyCartMock;

  const QUANTITY = 2;
  const VARIANT_ID = mockedProduct.variants[0].id;

  const { addItem, error } = useCart();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should add item to the cart', async () => {
    api.addCartItems.mockResolvedValue({ data: cartMock });

    await addItem(mockedProduct, QUANTITY, VARIANT_ID);

    expect(api.addCartItems).toHaveBeenCalledWith({
      cartId: cartStore.cart.id,
      include: getCartIncludeParamValue(),
      data: {
        line_items: [
          {
            product_id: mockedProduct.id,
            quantity: QUANTITY,
            variant_id: VARIANT_ID
          }
        ]
      }
    });

    expect(cartStore.cart).toStrictEqual(cartMock);
  });

  it('should use default product vartiant if variantId is not set', async () => {
    api.addCartItems.mockResolvedValue({ data: cartMock });

    await addItem(mockedProduct, QUANTITY);

    expect(api.addCartItems).toHaveBeenCalledWith({
      cartId: cartStore.cart.id,
      include: getCartIncludeParamValue(),
      data: {
        line_items: [
          {
            product_id: mockedProduct.id,
            quantity: QUANTITY,
            variant_id: getPurchasableDefaultVariant(mockedProduct)?.id
          }
        ]
      }
    });

    expect(cartStore.cart).toStrictEqual(cartMock);
  });

  it('should set addItem error if addCartItems fails', async () => {
    const ERROR_MESSAGE = 'Create error.';
    api.addCartItems.mockRejectedValueOnce(ERROR_MESSAGE);

    await addItem(mockedProduct, QUANTITY, VARIANT_ID);

    expect(error.value.addItem).toBe(ERROR_MESSAGE);
  });
});
