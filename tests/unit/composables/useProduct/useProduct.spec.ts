import { expect } from '@jest/globals';
import { useProduct } from '~/composables/useProduct';
import { mockedProduct } from '~/tests/__mocks__/product.mock';

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
      }
    })
  };
});

describe('[bigcommerce-theme] useProduct composable', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('search', () => {
    it('returns results from API Client getProducts function', async () => {
      const PRODUCT_RETURNED_BY_API_CLIENT = [mockedProduct];
      getProductsMock.mockResolvedValue(PRODUCT_RETURNED_BY_API_CLIENT);

      const { search } = useProduct();
      const products = await search({
        id: mockedProduct.id,
        include: 'options,variants'
      });

      expect(products).toBe(PRODUCT_RETURNED_BY_API_CLIENT);
    });
  });
});
