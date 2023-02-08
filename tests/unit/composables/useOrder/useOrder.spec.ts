import { expect } from '@jest/globals';
import { useOrder } from '~/composables/useOrder';

const mockGetOrders = jest.fn();

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api: {
          getOrders: mockGetOrders
        }
      }
    })
  };
});

describe('[bigcommerce-theme] useUserOrder composable', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('search function', () => {
    it('should allow blank/undefined params to the api-client function call', async () => {
      const { search } = useOrder();
      await search();

      expect(mockGetOrders).toBeCalledWith(undefined);
    });

    it('should fill the error.value.search prop on catching an error', async () => {
      const errorResponse = new Error('error message');

      mockGetOrders.mockRejectedValue(errorResponse);

      const { search, error } = useOrder();
      await search();

      expect(error.value.search).toBe(errorResponse);
    });
  });
});
