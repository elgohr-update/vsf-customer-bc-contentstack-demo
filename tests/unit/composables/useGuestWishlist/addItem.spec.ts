import { expect } from '@jest/globals';
import { Product } from '@vsf-enterprise/bigcommerce-api';
import { Wishlist, WishlistItem } from '~/composables/useWishlist/types';
import { mockedProduct } from '~/tests/__mocks__/product.mock';
import { useWishlistStore } from '~/stores/wishlist';
import { useGuestWishlist } from '~/composables/useGuestWishlist';
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
      }
    })
  };
});

describe('[BigCommerce - composables] useGuestWishlist addItem', () => {
  createTestingPinia();

  const wishlistItemParams = {
    productId: mockedProduct.id,
    variantId: 3
  };

  const wishlistStore = useWishlistStore();
  const { addItem } = useGuestWishlist();

  beforeEach(() => {
    wishlistStore.wishlist.items = [];
    jest.clearAllMocks();
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    jest.spyOn(window.localStorage.__proto__, 'removeItem');
    window.localStorage.__proto__.setItem = jest.fn();
  });

  it('should add item to the items array', async () => {
    const wishlistItem: WishlistItem = {
      id: `${wishlistItemParams.productId}_${wishlistItemParams.variantId}`,
      product_id: wishlistItemParams.productId,
      variant_id: wishlistItemParams.variantId
    };
    const expectedItems: Wishlist['items'] = [wishlistItem];

    await addItem(mockedProduct as Product);

    expect(wishlistStore.wishlist.items).toStrictEqual(expectedItems);
  });

  it('should call api to get products from guest wishlists', async () => {
    const expectedParams = { 'id:in': [mockedProduct.id], include: 'variants' };

    await addItem(mockedProduct as Product);

    expect(getProductsMock).toHaveBeenCalledTimes(1);
    expect(getProductsMock).toHaveBeenCalledWith(expectedParams);
  });

  it('should not add item to items array if it is there', async () => {
    const wishlistItem: WishlistItem = {
      id: `${wishlistItemParams.productId}_${wishlistItemParams.variantId}`,
      product_id: wishlistItemParams.productId,
      variant_id: wishlistItemParams.variantId
    };
    wishlistStore.wishlist.items = [wishlistItem];
    const expectedLength = 1;

    await addItem(mockedProduct as Product);

    expect(getProductsMock).toHaveBeenCalledTimes(0);
    expect(wishlistStore.wishlist.items).toHaveLength(expectedLength);
  });
});
