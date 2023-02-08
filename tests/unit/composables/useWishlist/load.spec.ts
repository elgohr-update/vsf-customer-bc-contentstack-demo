import { expect } from '@jest/globals';
import { WishlistResponse, WishlistCollectionResponse, Wishlist as WishlistAPI } from '@vsf-enterprise/bigcommerce-api';
import { createTestingPinia } from '@pinia/testing';
import { useWishlist } from '~/composables/useWishlist';
import { useCustomerStore } from '~/stores/customer';
import { themeConfigMock } from '~/tests/__mocks__/themeConfig.mock';
import { mockUser } from '~/tests/__mocks__/user.mock';
import { EMPTY_PRODUCT_RESPONSE } from '~/composables/useWishlist/helpers';
import { useWishlistStore } from '~/stores/wishlist';

const getProductsMock = jest.fn();
const deleteWishlistMock = jest.fn();
const getAllWishlistsMock = jest.fn();
const addWishlistItemsMock = jest.fn();
const createWishlistMock = jest.fn();

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api: {
          getProducts: getProductsMock,
          deleteWishlist: deleteWishlistMock as jest.Mock,
          createWishlist: createWishlistMock as jest.Mock,
          addWishlistItems: addWishlistItemsMock as jest.Mock,
          getAllWishlists: getAllWishlistsMock as jest.Mock
        }
      },
      $config: {
        theme: themeConfigMock
      }
    })
  };
});

describe('[BigCommerce - composables] useWishlist load', () => {
  createTestingPinia();

  const customerId = 1;
  const wishlistName = 'Mocked wishlist';
  const wishlistMock: WishlistAPI = {
    id: 1,
    customer_id: customerId,
    is_public: true,
    items: [{ id: 1, product_id: 1, variant_id: 1 }],
    name: wishlistName,
    token: 'mocked_token'
  };
  const customerStore = useCustomerStore();
  const wishlistStore = useWishlistStore();
  const userMock = mockUser();
  customerStore.currentCustomer = userMock;

  beforeEach(() => {
    wishlistStore.wishlist = {
      ...wishlistMock,
      wishlist_product_data: {
        meta: {},
        data: []
      }
    };
    jest.clearAllMocks();
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    jest.spyOn(window.localStorage.__proto__, 'removeItem');
  });

  const { load } = useWishlist();

  it('should get existing customer wishlist', async () => {
    const getAllWishlistResponseMock: WishlistCollectionResponse = {
      data: [wishlistMock],
      meta: {}
    };

    getAllWishlistsMock.mockImplementation(() => getAllWishlistResponseMock);

    await load();

    expect(getAllWishlistsMock).toHaveBeenCalledTimes(1);
    expect(wishlistStore.wishlist).toEqual({
      ...wishlistMock,
      wishlist_product_data: EMPTY_PRODUCT_RESPONSE
    });
  });

  it('should not create new wishlist if there is created one', async () => {
    const getAllWishlistResponseMock: WishlistCollectionResponse = {
      data: [wishlistMock],
      meta: {}
    };
    getAllWishlistsMock.mockImplementation(() => getAllWishlistResponseMock);

    await load();

    expect(createWishlistMock).toHaveBeenCalledTimes(0);
    expect(wishlistStore.wishlist).toEqual({
      ...wishlistMock,
      wishlist_product_data: EMPTY_PRODUCT_RESPONSE
    });
  });

  it('should create new wishlist if it was not created before', async () => {
    const getAllWishlistResponseMock: WishlistCollectionResponse = {
      data: [],
      meta: {}
    };
    const createWishlistResponseMock: WishlistResponse = {
      data: wishlistMock,
      meta: {}
    };
    getAllWishlistsMock.mockImplementation(() => getAllWishlistResponseMock);
    createWishlistMock.mockImplementation(() => createWishlistResponseMock);

    await load();

    expect(createWishlistMock).toHaveBeenCalledTimes(1);
    expect(wishlistStore.wishlist).toEqual({
      ...wishlistMock,
      wishlist_product_data: EMPTY_PRODUCT_RESPONSE
    });
  });

  it('should call getProducts to refresh product list', async () => {
    const getAllWishlistResponseMock: WishlistCollectionResponse = {
      data: [wishlistMock],
      meta: {}
    };
    getAllWishlistsMock.mockImplementation(() => getAllWishlistResponseMock);

    await load();

    expect(getProductsMock).toHaveBeenCalledTimes(1);
  });

  it('should merge wishlists if there is guest wishlist', async () => {
    window.localStorage.__proto__.getItem = jest.fn(() => JSON.stringify(wishlistMock));
    window.localStorage.__proto__.removeItem = jest.fn();

    const getAllWishlistResponseMock: WishlistCollectionResponse = {
      data: [wishlistMock],
      meta: {}
    };
    const addItemsResponseMock: WishlistResponse = {
      data: wishlistMock,
      meta: {}
    };
    addWishlistItemsMock.mockImplementation(() => addItemsResponseMock);
    getAllWishlistsMock.mockImplementation(() => getAllWishlistResponseMock);

    await load();

    expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(addWishlistItemsMock).toHaveBeenCalledTimes(1);
    expect(window.localStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(wishlistStore.wishlist).toEqual({
      ...wishlistMock,
      wishlist_product_data: EMPTY_PRODUCT_RESPONSE
    });
  });

  it('should not merge wishlist if there is no guest wishlist', async () => {
    window.localStorage.__proto__.getItem = jest.fn(() => null);
    window.localStorage.__proto__.removeItem = jest.fn();

    const getAllWishlistResponseMock: WishlistCollectionResponse = {
      data: [wishlistMock],
      meta: {}
    };
    getAllWishlistsMock.mockImplementation(() => getAllWishlistResponseMock);

    await load();

    expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(addWishlistItemsMock).toHaveBeenCalledTimes(0);
    expect(window.localStorage.removeItem).toHaveBeenCalledTimes(0);
    expect(wishlistStore.wishlist).toEqual({
      ...wishlistMock,
      wishlist_product_data: EMPTY_PRODUCT_RESPONSE
    });
  });
});
