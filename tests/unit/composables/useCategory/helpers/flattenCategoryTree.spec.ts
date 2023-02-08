import { expect } from '@jest/globals';
import { flattenCategoryTree } from '~/composables/useCategory/helpers';
import { mockCategoryTreeList } from '~/tests/__mocks__/categoryTreeList.mock';
import { mockFlattenedCategoryTreeList } from '~/tests/__mocks__/flattenCategoryTree.mock';

describe('[bigcommerce-theme] flattenCategoryTree', () => {
  it('should respond with flat array with levels from category tree list', () => {
    // given
    const expectedFlatCategoryTree = mockFlattenedCategoryTreeList();
    const categoryTreeListMock = mockCategoryTreeList();

    // when
    const flatCategoryTree = flattenCategoryTree(categoryTreeListMock);

    // then
    expect(flatCategoryTree).toStrictEqual(expectedFlatCategoryTree);
  });

  it('should return empty array if there are no category tree in list', () => {
    // given
    const EMPTY_FLAT_CATEGORY_TREE = [];

    // when
    const flatCategoryTree = flattenCategoryTree([]);

    // then
    expect(flatCategoryTree).toStrictEqual(EMPTY_FLAT_CATEGORY_TREE);
  });
});
