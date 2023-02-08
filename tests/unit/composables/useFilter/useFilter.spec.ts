import { expect } from '@jest/globals';
import { useFilters } from '~/composables/useFilters';
import { mockedFilterResponse } from '~/tests/__mocks__/product.mock';

const getFiltersMock = jest.fn();

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api: {
          getFilters: getFiltersMock
        }
      }
    })
  };
});

describe('[bigcommerce-theme] useFilters composable', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('load', () => {
    it('returns results from API Client useFilters function', async () => {
      const FILTERS_RETURNED_BY_API_CLIENT = mockedFilterResponse;
      getFiltersMock.mockResolvedValue(FILTERS_RETURNED_BY_API_CLIENT);

      const { load } = useFilters();
      const filters = await load({
        filters: {
          categoryEntityId: 1
        }
      });

      expect(filters).toBe(FILTERS_RETURNED_BY_API_CLIENT);
    });
  });
});
