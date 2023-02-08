import { expect } from '@jest/globals';
import { creatreCategoryTreeDictionary } from '~/composables/useCategory/helpers';
import { mockCategoryTreeDictionary } from '~/tests/__mocks__/categoryTreeDictionary.mock';
import { mockFlattenedCategoryTreeList } from '~/tests/__mocks__/flattenCategoryTree.mock';

describe('[bigcommerce-theme] creatreCategoryTreeDictionary', () => {
  it('create dictionary with id as a key and categoryTree as value', () => {
    // given
    const flattenedCategoryTreeListMock = mockFlattenedCategoryTreeList();
    const categoryTreeDictionaryMock = mockCategoryTreeDictionary();

    // when
    const dictionary = creatreCategoryTreeDictionary(
      flattenedCategoryTreeListMock
    );

    // then
    expect(dictionary).toStrictEqual(categoryTreeDictionaryMock);
  });

  it('should return empty object if category tree list is empty', () => {
    // given
    const EMPTY_DICTIONARY = {};
    const EMPTY_CATEGORY_TREE_LIST = [];

    // when
    const dictionary = creatreCategoryTreeDictionary(EMPTY_CATEGORY_TREE_LIST);

    // then
    expect(dictionary).toStrictEqual(EMPTY_DICTIONARY);
  });
});
