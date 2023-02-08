import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { mockCart } from '~/tests/__mocks__/cart.mock';
import { mockedProduct } from '~/tests/__mocks__/product.mock';
import { useCartStore } from '~/stores/cart';
import { useCart } from '~/composables/useCart';
import { productVariantsMock } from '~/tests/__mocks__/useCart/productVariants.mock';
import { BIGCOMMERCE_USER_CART_KEY } from '~/composables/useUser/helpers';

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

describe('[bigcommerce-theme] useCart isInCart method', () => {
  createTestingPinia();

  const cartMock = mockCart();
  const cartStore = useCartStore();
  const { isInCart } = useCart();

  cartStore.cart = cartMock;

  it('should find product by id when it has no variants', async () => {
    const mockedProductWithoutVariants = {
      ...mockedProduct,
      variants: [],
      option_values: []
    };

    const result = isInCart(mockedProductWithoutVariants);

    expect(result).toEqual(true);
  });

  it('should find product by variant', async () => {
    const mockedProductWithVariants = {
      ...mockedProduct,
      variants: productVariantsMock
    };

    const result = isInCart(mockedProductWithVariants);

    expect(result).toEqual(true);
  });

  it('should return false when no item is found by id', async () => {
    const mockedProductWithoutVariants = {
      ...mockedProduct,
      id: 10
    };

    const result = isInCart(mockedProductWithoutVariants);

    expect(result).toEqual(false);
  });
});
