import { expect } from '@jest/globals';
import { useOrderProducts } from '~/composables/useOrderProducts';

const mockGetOrderProducts = jest.fn();

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api: {
          getOrderProducts: mockGetOrderProducts
        }
      }
    })
  };
});

describe('[bigcommerce-theme] useUserOrderProducts composable', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('search function', () => {
    it('should pass the parameters to api-client call getOrderProducts', async () => {
      // given
      const params = { orderId: 1 };

      // when
      const { search } = useOrderProducts();
      await search(params);

      // then
      expect(mockGetOrderProducts).toBeCalledWith(params);
    });

    it('throws error about failure to pull products when the API Client fails', async () => {
      // given
      const MOCKED_ERROR = 'Mocked error.';
      mockGetOrderProducts.mockRejectedValueOnce(new Error(MOCKED_ERROR));

      // when
      const { search, error } = useOrderProducts();
      await search({ orderId: undefined });

      // then
      expect(error.value.search instanceof Error).toBe(true);
      expect(error.value.search.message).toBe(MOCKED_ERROR);
    });
  });
});
