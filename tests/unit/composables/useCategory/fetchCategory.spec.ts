import { expect } from '@jest/globals';
import { useCategory } from '~/composables/useCategory';
import { mockCategory } from '~/tests/__mocks__/category.mock';
import { createTestingPinia } from '@pinia/testing';

const api = {
  getCategory: jest.fn()
};

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api
      }
    })
  };
});

describe('[bigcommerce-theme] useCategory fetchCategory method', () => {
  createTestingPinia();
  const categoryMock = mockCategory();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns results from API Client getCategory function', async () => {
    // given
    const categoryResponseFromApiClient = {
      data: [categoryMock],
      meta: {}
    };
    api.getCategory.mockResolvedValue(categoryResponseFromApiClient);

    // when
    const { fetchCategory } = useCategory();
    const categories = await fetchCategory({
      categoryId: categoryMock.id
    });

    // then
    expect(categories).toBe(categoryResponseFromApiClient);
  });

  it('throws error about failure to pull products when the API Client fails', async () => {
    // given
    const SEARCH_QUERY = { categoryId: null };
    const dummyError = new Error('Dummy error');

    api.getCategory.mockRejectedValue(dummyError);

    // when
    const { fetchCategory, error } = useCategory();
    await fetchCategory(SEARCH_QUERY);

    // then
    expect(error.value.fetchCategory instanceof Error).toBe(true);
    expect(error.value.fetchCategory.message).toBe(
      dummyError.message
    );
  });
});
