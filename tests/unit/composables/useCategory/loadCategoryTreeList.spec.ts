import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { mockCategoryTreeResponse } from '~/tests/__mocks__/categoryTreeResponse.mock';
import { useCategory } from '~/composables/useCategory';
import { useCategoryTreeStore } from '~/stores/categoryTree';

const api = {
  getCategoryTree: jest.fn()
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

describe('[bigcommerce-theme] useCategory loadCategoryTree method', () => {
  let categoryTreeResponseMock;

  beforeEach(() => {
    jest.clearAllMocks();
    createTestingPinia({
      initialState: {
        categoryTree: { listOfRootBranches: [] }
      }
    });
    categoryTreeResponseMock = mockCategoryTreeResponse();
  });

  it('it should call getCategoryTree endpoint', async () => {
    // given
    api.getCategoryTree.mockResolvedValueOnce(categoryTreeResponseMock);

    // when
    const { loadCategoryTreeList } = useCategory();
    await loadCategoryTreeList();

    // then
    expect(api.getCategoryTree).toBeCalledTimes(1);
  });

  it('it should use category tree store to set state.list property', async () => {
    // given
    const categoryTreeStore = useCategoryTreeStore();
    api.getCategoryTree.mockResolvedValueOnce(categoryTreeResponseMock);

    // when
    const { loadCategoryTreeList } = useCategory();
    await loadCategoryTreeList();

    // then
    expect(categoryTreeStore.listOfRootBranches).toBe(categoryTreeResponseMock.data);
  });

  it('it should NOT call api if category tree list exists and is set up', async () => {
    // given
    const categoryTreeStore = useCategoryTreeStore();
    categoryTreeStore.listOfRootBranches = categoryTreeResponseMock.data;

    // when
    const { loadCategoryTreeList } = useCategory();
    await loadCategoryTreeList();

    // then
    expect(api.getCategoryTree).toBeCalledTimes(0);
  });

  it('it should set up error when fetching fails', async () => {
    // given
    const dummyError = Error('dummy error');
    api.getCategoryTree.mockRejectedValueOnce(dummyError);

    // when
    const { loadCategoryTreeList, error } = useCategory();
    await loadCategoryTreeList();

    // then
    expect(error.value.loadCategoryTreeList instanceof Error).toBe(true);
    expect(error.value.loadCategoryTreeList.message).toBe(
      dummyError.message
    );
  });
});
