import { expect } from '@jest/globals';
import { useSearchOrderByCart } from '~/composables/useSearchOrderByCart';

const mockGetOrdersByCart = jest.fn();

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api: {
          getOrderByCart: mockGetOrdersByCart
        }
      }
    })
  };
});

describe('[bigcommerce-theme] useSearchOrderByCart composable', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('search function', () => {
    it('should pass the parameters to api-client call getOrderByCart', async () => {
      const params = { cartId: '1' };

      const { search } = useSearchOrderByCart();
      await search(params);

      expect(mockGetOrdersByCart).toBeCalledWith(params);
    });

    it('throws error about failure to pull products when the API Client fails', async () => {
      // given
      const MOCKED_ERROR = 'Mocked error.';
      mockGetOrdersByCart.mockRejectedValue(new Error(MOCKED_ERROR));

      // when
      const { search, error } = useSearchOrderByCart();
      await search({ cartId: undefined });

      // then
      expect(error.value.search instanceof Error).toBe(true);
      expect(error.value.search.message).toBe(MOCKED_ERROR);
    });
  });
});
