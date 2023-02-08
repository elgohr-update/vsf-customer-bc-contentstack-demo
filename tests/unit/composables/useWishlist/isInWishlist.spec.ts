import { expect } from '@jest/globals';
import { Product } from '@vsf-enterprise/bigcommerce-api';
import { createTestingPinia } from '@pinia/testing';
import { useWishlist } from '~/composables/useWishlist';
import { Wishlist } from '~/composables/useWishlist/types';
import { wishlistMock } from '~/tests/__mocks__/wishlist.mock';
import { mockedProduct } from '~/tests/__mocks__/product.mock';
import { useWishlistStore } from '~/stores/wishlist';

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

describe('[BigCommerce - composables] useWishlist isInWishlist', () => {

  createTestingPinia();

  const { isInWishlist } = useWishlist();
  const wishlistStore = useWishlistStore();

  wishlistStore.wishlist = {
    ...wishlistMock,
    items: [
      {
        product_id: mockedProduct.id,
        variant_id: 3
      }
    ]
  } as Wishlist;

  it('should return true if item is in the wishlist', () => {
    const res = isInWishlist(mockedProduct as Product);

    expect(res).toBe(true);
  });

  it('should return false if there product is not in the wishlist', () => {
    const otherProduct = {
      ...mockedProduct,
      id: 1
    };
    const res = isInWishlist(otherProduct as Product);

    expect(res).toBe(false);
  });

  it('should return false if there is no wishlist', () => {

    wishlistStore.wishlist = {
      ...wishlistMock,
      items: []
    } as Wishlist;

    const res = isInWishlist(mockedProduct as Product);

    expect(res).toBe(false);
  });
});
