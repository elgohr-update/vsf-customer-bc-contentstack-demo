import { expect } from '@jest/globals';
import { Product } from '@vsf-enterprise/bigcommerce-api';
import { mockCategoryTreeResponse } from '~/tests/__mocks__/categoryTreeResponse.mock';
import { useCategory } from '~/composables/useCategory';
import { useCategoryTreeStore } from '~/stores/categoryTree';
import { createTestingPinia } from '@pinia/testing';
import { mockedProduct } from '~/tests/__mocks__/product.mock';

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      app: {
        $vsf: {
          $bigcommerce: {
            getCategoryTree: jest.fn()
          }
        }
      },
      i18n: {
        t: (str: string): string => str
      },
      localePath: (path: string) => path
    })
  };
});

describe('[bigcommerce-theme] useCategory buildSearchCategories method', () => {
  const categoryTreeResponseMock = mockCategoryTreeResponse();

  beforeEach(() => {
    jest.clearAllMocks();
    createTestingPinia();
    const categoryTreeStore = useCategoryTreeStore();
    categoryTreeStore.listOfRootBranches = categoryTreeResponseMock.data;
  });

  it('should build search categories for product list', () => {
    // given
    const SEARCH_CATEGORIES = [
      {
        key: 18,
        label: 'Bath',
        slug: '/c/household-items/bath/'
      },
      {
        key: 23,
        label: 'Household Items',
        slug: '/c/household-items/'
      }
    ];

    // when
    const { buildSearchCategories } = useCategory();
    const builtCategories = buildSearchCategories([mockedProduct as Product]);

    // then
    expect(builtCategories).toStrictEqual(SEARCH_CATEGORIES);
  });
});
