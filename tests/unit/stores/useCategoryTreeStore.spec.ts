import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { mockFlattenedCategoryTreeList } from '~/tests/__mocks__/flattenCategoryTree.mock';
import { mockCategoryTreeList } from '~/tests/__mocks__/categoryTreeList.mock';
import { useCategoryTreeStore } from '~/stores/categoryTree';
import { mockCategoryTreeDictionary } from '~/tests/__mocks__/categoryTreeDictionary.mock';

describe('[bigcommerce-theme] useCategoryTreeStore', () => {
  const categoryTreeListMock = mockCategoryTreeList();
  const flattenCategoryTreeListMock = mockFlattenedCategoryTreeList();
  const categoryTreeDictionaryMock = mockCategoryTreeDictionary();
  createTestingPinia();

  it('should flatten category tree list when state.list is set up', () => {
    // given
    const categoryTreeStore = useCategoryTreeStore();

    // when
    categoryTreeStore.listOfRootBranches = categoryTreeListMock;

    // then
    expect(categoryTreeStore.flattenList).toStrictEqual(
      flattenCategoryTreeListMock
    );
  });

  it('should build dictionary when state.list is set up', () => {
    // given
    const categoryTreeStore = useCategoryTreeStore();

    // when
    categoryTreeStore.listOfRootBranches = categoryTreeListMock;

    // then
    expect(categoryTreeStore.dictionary).toStrictEqual(
      categoryTreeDictionaryMock
    );
  });
});
