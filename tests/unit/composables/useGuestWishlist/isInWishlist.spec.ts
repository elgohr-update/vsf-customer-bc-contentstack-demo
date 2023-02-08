import { expect } from '@jest/globals';
import { useWishlistStore } from '~/stores/wishlist';
import { useGuestWishlist } from '~/composables/useGuestWishlist';
import { mockedProduct } from '~/tests/__mocks__/product.mock';
import { themeConfigMock } from '~/tests/__mocks__/themeConfig.mock';
import { createTestingPinia } from '@pinia/testing';

const getProductsMock = jest.fn();

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      app: {
        $vsf: {
          $bigcommerce: {
            api: {
              getProducts: getProductsMock as jest.Mock
            }
          }
        }
      },
      $config: {
        theme: themeConfigMock
      }
    })
  };
});

describe('[BigCommerce - composables] useGuestWishlist isInWishlist', () => {
  createTestingPinia();

  const existingItemMock = {
    id: '77_3',
    product_id: 77,
    variant_id: 3
  };

  const nonExistingProduct = {
    ...mockedProduct,
    id: 0
  };

  const wishlistStore = useWishlistStore();
  const { isInWishlist } = useGuestWishlist();

  wishlistStore.wishlist.items.push(existingItemMock);

  it('should return true if item is in the wishlist', () => {
    const res = isInWishlist(mockedProduct);

    expect(res).toBe(true);
  });

  it('should return false if there product is not in the wishlist', () => {
    const res = isInWishlist(nonExistingProduct);

    expect(res).toBe(false);
  });

  it('should return false if there is no wishlist', () => {
    wishlistStore.wishlist.items = [];
    const res = isInWishlist(mockedProduct);

    expect(res).toBe(false);
  });
});

