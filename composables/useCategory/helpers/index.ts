import { CategoryTree } from '@vsf-enterprise/bigcommerce-api';

export function flattenCategoryTree(
  categoryTree: CategoryTree[]
): CategoryTree[] {
  return categoryTree?.flatMap((categoryTreeLevel) => [
    categoryTreeLevel,
    ...flattenCategoryTree(categoryTreeLevel.children)
  ]) ?? [];
}

export function creatreCategoryTreeDictionary(
  flattenedCategoryTree: CategoryTree[]
): Record<number, CategoryTree> {
  return Object.assign(
    {},
    ...flattenedCategoryTree.map((level) => ({ [level.id]: level }))
  );
}
