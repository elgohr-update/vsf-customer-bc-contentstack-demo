import { expect } from '@jest/globals';
import { Wishlist, WishlistItem } from '~/composables/useWishlist/types';
import { useWishlistStore } from '~/stores/wishlist';
import { useGuestWishlist } from '~/composables/useGuestWishlist';
import { themeConfigMock } from '~/tests/__mocks__/themeConfig.mock';
import { createTestingPinia } from '@pinia/testing';
const { guestWishlistMock }: { guestWishlistMock: Wishlist } = require(
  '~/tests/__mocks__/guestWishlist.mock'
);

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

describe('[BigCommerce - composables] useGuestWishlist clear', () => {
  createTestingPinia();

  const wishlistStore = useWishlistStore();
  const { clear } = useGuestWishlist();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(window.localStorage.__proto__, 'setItem');
    jest.spyOn(window.localStorage.__proto__, 'getItem');

    window.localStorage.__proto__.setItem = jest.fn();

    wishlistStore.wishlist = guestWishlistMock;
  });

  it('should remove all items from the items array', async () => {
    const wishlistItems: WishlistItem[] = [
      { id: '1_1', product_id: 1, variant_id: 1 },
      { id: '2_2', product_id: 2, variant_id: 2 }
    ];
    wishlistStore.wishlist.items.push(...wishlistItems);

    await clear();

    expect(wishlistStore.wishlist.items).toHaveLength(0);
  });

  it('should not call api to refresh the guest wishlists', async () => {
    const wishlistItems: WishlistItem[] = [
      { id: '1_1', product_id: 1, variant_id: 1 },
      { id: '2_2', product_id: 2, variant_id: 2 }
    ];
    wishlistStore.wishlist.items.push(...wishlistItems);
    window.localStorage.__proto__.getItem = jest.fn(() => JSON.stringify(wishlistStore.wishlist));

    await clear();

    expect(getProductsMock).toHaveBeenCalledTimes(0);
  });

  it('should set cleared guest wishlist in the localstorage', async () => {
    const wishlistItem: WishlistItem = { id: '1_1', product_id: 1, variant_id: 1 };

    wishlistStore.wishlist.items.push(wishlistItem);

    window.localStorage.__proto__.getItem = jest.fn(() => JSON.stringify(wishlistStore.wishlist));

    await clear();

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('should clear pinia wishlist', async () => {
    const wishlistItem: WishlistItem = { id: '1_1', product_id: 1, variant_id: 1 };

    wishlistStore.wishlist.items.push(wishlistItem);

    await clear();

    expect(wishlistStore.wishlist.items).toHaveLength(0);
  });
});
