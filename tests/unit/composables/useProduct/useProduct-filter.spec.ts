import { expect } from '@jest/globals';
import { useProduct } from '~/composables/useProduct';
import { mockedProduct } from '~/tests/__mocks__/product.mock';

const getProductsWithFilterMock = jest.fn();

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api: {
          getProductsWithFilter: getProductsWithFilterMock
        }
      }
    })
  };
});

describe('[bigcommerce-theme] useProduct composable', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('filter', () => {
    it('returns results from API Client getProducts function', async () => {
      const PRODUCT_RETURNED_BY_API_CLIENT = [mockedProduct];
      getProductsWithFilterMock.mockResolvedValue(PRODUCT_RETURNED_BY_API_CLIENT);

      const { filter } = useProduct();
      const products = await filter({
        filters: {
          categoryEntityId: 5
        },
        first: 5
      });

      expect(products).toBe(PRODUCT_RETURNED_BY_API_CLIENT);
    });
  });
});
