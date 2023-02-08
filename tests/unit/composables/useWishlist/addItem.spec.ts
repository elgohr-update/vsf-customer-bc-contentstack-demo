import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { Product } from '@vsf-enterprise/bigcommerce-api';
import { useWishlist } from '~/composables/useWishlist';
import { wishlistMock } from '~/tests/__mocks__/wishlist.mock';
import { mockedProduct } from '~/tests/__mocks__/product.mock';
import { useCustomerStore } from '~/stores/customer';
import { EMPTY_PRODUCT_RESPONSE } from '~/composables/useWishlist/helpers';
import { mockUser } from '~/tests/__mocks__/user.mock';
import { useWishlistStore } from '~/stores/wishlist';

const addWishlistItemsMock = jest.fn(() => ({
  data: {
    ...wishlistMock,
    items: [{ id: '77_3', product_id: 77, variant_id: 3 }]
  },
  meta: {}
}));
const getProductsMock = jest.fn();

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api: {
          getProducts: getProductsMock,
          addWishlistItems: addWishlistItemsMock as jest.Mock
        }
      }
    })
  };
});

describe('[BigCommerce - composables] useWishlist addItem', () => {
  createTestingPinia();

  beforeEach(() => {
    addWishlistItemsMock.mockClear();
    getProductsMock.mockClear();
  });

  const expectedParams = {
    wishlistId: wishlistMock.id,
    items: [
      {
        product_id: mockedProduct.id,
        variant_id: 3
      }
    ]
  };

  const customerStore = useCustomerStore();
  const wishlistStore = useWishlistStore();
  const userMock = mockUser();
  customerStore.currentCustomer = userMock;

  const { addItem } = useWishlist();

  it('should call api with wishlist id and array of items', async () => {
    await addItem(mockedProduct as Product);
    expect(addWishlistItemsMock).toHaveBeenCalledWith(expectedParams);
  });

  it('should refresh product list', async () => {
    await addItem(mockedProduct as Product);
    expect(getProductsMock).toHaveBeenCalledTimes(1);
  });

  it('should have items in pinia store', async () => {
    await addItem(mockedProduct as Product);
    const expectedParams = {
      ...wishlistMock,
      items: [{ id: '77_3', product_id: 77, variant_id: 3 }],
      wishlist_product_data: EMPTY_PRODUCT_RESPONSE
    };
    expect(wishlistStore.wishlist).toEqual(expectedParams);
  });
});
