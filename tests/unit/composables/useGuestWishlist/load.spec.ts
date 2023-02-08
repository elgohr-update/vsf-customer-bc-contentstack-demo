import { expect } from '@jest/globals';
import { useWishlistStore } from '~/stores/wishlist';
import { useGuestWishlist } from '~/composables/useGuestWishlist';
import { guestWishlistMock } from '~/tests/__mocks__/guestWishlist.mock';
import { Wishlist } from '~/composables/useWishlist/types';
import { EMPTY_PRODUCT_RESPONSE } from '~/composables/useWishlist/helpers';
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

describe('[BigCommerce - composables] useGuestWishlist load', () => {
  createTestingPinia();

  const { load } = useGuestWishlist();
  const wishlistStore = useWishlistStore();

  const expectedWishlist: Wishlist = {
    id: 0,
    name: guestWishlistMock.name,
    customer_id: 0,
    items: [],
    wishlist_product_data: EMPTY_PRODUCT_RESPONSE,
    is_public: true,
    token: ''
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window.localStorage.__proto__, 'setItem');
    jest.spyOn(window.localStorage.__proto__, 'getItem');
  });

  it('should store new guest wishlist in localStorage and pinia if it does not exists', async () => {
    window.localStorage.__proto__.setItem = jest.fn();
    window.localStorage.__proto__.getItem = jest.fn(() => null);

    await load();

    expect(getProductsMock).toHaveBeenCalledTimes(0);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('bigcommerce-wishlist', JSON.stringify(expectedWishlist));
    expect(wishlistStore.wishlist).toEqual(expectedWishlist);
  });

  it('should get guest wishlist from localStorage if it exists', async () => {
    window.localStorage.__proto__.setItem = jest.fn();
    window.localStorage.__proto__.getItem = jest.fn(() => JSON.stringify(guestWishlistMock));

    getProductsMock.mockImplementation(() => guestWishlistMock.wishlist_product_data);

    await load();

    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(wishlistStore.wishlist).toStrictEqual(expectedWishlist);
  });

  it('should not call api to get products if there are no items', async () => {
    window.localStorage.__proto__.setItem = jest.fn();
    window.localStorage.__proto__.getItem = jest.fn(() => JSON.stringify(guestWishlistMock));

    await load();

    expect(getProductsMock).toHaveBeenCalledTimes(0);
  });

  it('should call api to get products from guest wishlists', async () => {
    window.localStorage.__proto__.setItem = jest.fn();
    guestWishlistMock.items.push({ id: '1_1', product_id: 1, variant_id: 1 });
    window.localStorage.__proto__.getItem = jest.fn(() => JSON.stringify(guestWishlistMock));

    await load();

    expect(getProductsMock).toHaveBeenCalledTimes(1);
  });
});
