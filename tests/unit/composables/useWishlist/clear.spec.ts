import { expect } from '@jest/globals';
import { WishlistResponse } from '@vsf-enterprise/bigcommerce-api';
import { createTestingPinia } from '@pinia/testing';
import { useWishlist } from '~/composables/useWishlist';
import { Wishlist } from '~/composables/useWishlist/types';
import { wishlistMock } from '~/tests/__mocks__/wishlist.mock';
import { useCustomerStore } from '~/stores/customer';
import { themeConfigMock } from '~/tests/__mocks__/themeConfig.mock';
import { mockUser } from '~/tests/__mocks__/user.mock';
import { useWishlistStore } from '~/stores/wishlist';

const customerId = 1;
const wishlistName = 'Mocked wishlist';
const isPublic = true;

const getProductsMock = jest.fn();
const deleteWishlistMock = jest.fn();
const createWishlistMock = jest.fn(
  (): Promise<WishlistResponse> => Promise.resolve({
    data: {
      id: 1,
      customer_id: customerId,
      is_public: isPublic,
      items: [],
      name: wishlistName,
      token: 'mocked_token'
    },
    meta: {}
  })
);

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api: {
          getProducts: getProductsMock as jest.Mock,
          deleteWishlist: deleteWishlistMock as jest.Mock,
          createWishlist: createWishlistMock as jest.Mock
        }
      },
      $config: {
        theme: {
          ...themeConfigMock,
          wishlist: {
            ...themeConfigMock.wishlist,
            name: wishlistName
          }
        }
      }
    })
  };
});

describe('[BigCommerce - composables] useWishlist clear', () => {
  createTestingPinia();
  const customerStore = useCustomerStore();
  const wishlistStore = useWishlistStore();
  const userMock = mockUser();
  customerStore.currentCustomer = userMock;

  beforeEach(() => {
    wishlistStore.wishlist = wishlistMock as Wishlist;
    jest.clearAllMocks();
  });

  const { clear } = useWishlist();
  const wishlistName = 'Mocked wishlist';
  const isPublic = true;

  it('should call deleteWishlist with expected params', async () => {
    const expectedWishlistId = wishlistMock.id;

    await clear();

    expect(deleteWishlistMock).toHaveBeenCalledWith(expectedWishlistId);
  });

  it('should create new wishlist after deleting old one', async () => {
    const expectedParams = {
      name: wishlistName,
      is_public: isPublic,
      items: []
    };

    await clear();

    expect(deleteWishlistMock).toHaveBeenCalledTimes(1);
    expect(createWishlistMock).toHaveBeenCalledWith(expectedParams);
  });
});
