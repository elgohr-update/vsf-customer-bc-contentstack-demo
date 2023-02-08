import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { useWishlist } from '~/composables/useWishlist';
import { WishlistItem, Wishlist } from '~/composables/useWishlist/types';
import { wishlistMock } from '~/tests/__mocks__/wishlist.mock';
import { useWishlistStore } from '~/stores/wishlist';
import { useCustomerStore } from '~/stores/customer';
import { mockUser } from '~/tests/__mocks__/user.mock';

const getProductsMock = jest.fn();
const removeWishlistItemMock = jest.fn(() => ({
  data: wishlistMock,
  meta: {}
}));

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api: {
          getProducts: getProductsMock as jest.Mock,
          removeWishlistItem: removeWishlistItemMock as jest.Mock
        }
      }
    })
  };
});

describe('[BigCommerce - composables] useWishlist removeItem', () => {
  createTestingPinia();
  const customerStore = useCustomerStore();
  const wishlistStore = useWishlistStore();
  const userMock = mockUser();
  customerStore.currentCustomer = userMock;

  beforeEach(() => {
    wishlistStore.wishlist = wishlistMock as Wishlist;
    getProductsMock.mockClear();
  });

  const { removeItem } = useWishlist();
  const wishlistItem: WishlistItem = { id: 1, product_id: 1, variant_id: 1 };
  (wishlistMock as Wishlist).items.push(wishlistItem);

  it('should call api with expected params', async () => {
    const expectedParams = {
      wishlistId: wishlistMock.id,
      itemId: wishlistItem.id
    };

    await removeItem(wishlistItem);

    expect(removeWishlistItemMock).toHaveBeenCalledWith(expectedParams);
  });

  it('should refresh product list', async () => {
    await removeItem(wishlistItem);

    expect(getProductsMock).toHaveBeenCalledTimes(1);
  });
});
