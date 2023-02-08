import { expect } from '@jest/globals';
import { mockCategoryTreeResponse } from '~/tests/__mocks__/categoryTreeResponse.mock';
import { useCategory } from '~/composables/useCategory';
import { useCategoryTreeStore } from '~/stores/categoryTree';
import { createTestingPinia } from '@pinia/testing';

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

describe('[bigcommerce-theme] useCategory buildBreadcrumbs method', () => {
  const categoryTreeResponseMock = mockCategoryTreeResponse();
  const HOME_BREADCRUMBS = [{ text: 'Home', link: '/' }];

  beforeEach(() => {
    jest.clearAllMocks();
    createTestingPinia();
    const categoryTreeStore = useCategoryTreeStore();
    categoryTreeStore.listOfRootBranches = categoryTreeResponseMock.data;
  });

  it('should build breadcrumbs based on category tree level `path` property and categoryTreeStore dictionary', () => {
    // given
    const ID_OF_CHILD_IN_CATEGORY_TREE = 24;
    const BREADCRUMBS_FOR_CHILD_CATEGORY = [
      {
        text: 'Home',
        link: '/'
      },
      {
        text: 'Household Items',
        link: '/c/household-items/'
      },
      {
        text: 'Bath',
        link: '/c/household-items/bath/'
      },
      {
        text: 'Bath - Exclusives',
        link: '/c/bath/bath-exclusives/'
      }
    ];

    // when
    const { buildBreadcrumbs } = useCategory();
    const builtBreadcrumbs = buildBreadcrumbs(ID_OF_CHILD_IN_CATEGORY_TREE);

    // then
    expect(builtBreadcrumbs).toStrictEqual(BREADCRUMBS_FOR_CHILD_CATEGORY);
  });

  it('should return home page breadcrump when there is no category trees in list', () => {
    // given
    const categoryTreeStore = useCategoryTreeStore();
    categoryTreeStore.listOfRootBranches = [];
    const ID_OF_CHILD_IN_CATEGORY_TREE = 24;

    // when
    const { buildBreadcrumbs } = useCategory();
    const builtBreadcrumbs = buildBreadcrumbs(ID_OF_CHILD_IN_CATEGORY_TREE);

    // then
    expect(builtBreadcrumbs).toStrictEqual(HOME_BREADCRUMBS);
  });

  it('should return home page breadcrump when the categoryId is invalid', () => {
    // given
    const ID_OF_NON_EXISTING_CATEGORY = 1;

    // when
    const { buildBreadcrumbs } = useCategory();
    const builtBreadcrumbs = buildBreadcrumbs(ID_OF_NON_EXISTING_CATEGORY);

    // then
    expect(builtBreadcrumbs).toStrictEqual(HOME_BREADCRUMBS);
  });

  it('should return home page and given category breadcrumbs when first level of the tree has been given', () => {
    // given
    const ID_OF_CHILD_IN_CATEGORY_TREE = 23;
    const CATEGORY_BREADCRUMBS = [
      { text: 'Home', link: '/' },
      {
        text: 'Household Items',
        link: '/c/household-items/'
      }
    ];

    // when
    const { buildBreadcrumbs } = useCategory();
    const builtBreadcrumbs = buildBreadcrumbs(ID_OF_CHILD_IN_CATEGORY_TREE);

    // then
    expect(builtBreadcrumbs).toStrictEqual(CATEGORY_BREADCRUMBS);
  });
});
