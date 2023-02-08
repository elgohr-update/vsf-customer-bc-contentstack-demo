import { expect } from '@jest/globals';
import { useWishlistStore } from '~/stores/wishlist';
import { useGuestWishlist } from '~/composables/useGuestWishlist';
import { WishlistItem } from '~/composables/useWishlist/types';
import { themeConfigMock } from '~/tests/__mocks__/themeConfig.mock';
import { createTestingPinia } from '@pinia/testing';

const getProductsMock = jest.fn();

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api: {
          getProducts: getProductsMock
        }
      },
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

describe('[BigCommerce - composables] useGuestWishlist removeItem', () => {
  createTestingPinia();

  const { removeItem } = useGuestWishlist();
  const wishlistStore = useWishlistStore();
  const wishlistItem: WishlistItem = { id: '1_1', product_id: 1, variant_id: 1 };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window.localStorage.__proto__, 'setItem');
    window.localStorage.__proto__.setItem = jest.fn();
    wishlistStore.wishlist.items = [];
  });

  it('should remove item from the items array', async () => {

    wishlistStore.wishlist.items = [wishlistItem];

    await removeItem(wishlistItem);

    expect(wishlistStore.wishlist.items).toHaveLength(0);
  });

  it('should call api to get products from guest wishlists', async () => {
    wishlistStore.wishlist.items = [
      { id: '1_1', product_id: 1, variant_id: 1 },
      { id: '2_2', product_id: 2, variant_id: 2 }
    ];

    const expectedParams = { 'id:in': [2], include: 'variants' };

    await removeItem(wishlistItem);

    expect(getProductsMock).toHaveBeenCalledTimes(1);
    expect(getProductsMock).toHaveBeenCalledWith(expectedParams);
  });

  it('should set new guest wishlist in the localstorage', async () => {
    await removeItem(wishlistItem);

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });
});

