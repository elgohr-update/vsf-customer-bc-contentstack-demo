import { defineStore } from 'pinia';
import { CategoryTree } from '@vsf-enterprise/bigcommerce-api';
import {
  flattenCategoryTree,
  creatreCategoryTreeDictionary
} from '~/composables/useCategory/helpers';

/**
 * State of `categoryTreeStore`.
 */
interface CategoryTreeState {
  listOfRootBranches: CategoryTree[];
}

/**
 * Category tree [Pinia](https://pinia.vuejs.org/) store.
 */
export const useCategoryTreeStore = defineStore('categoryTreeStore', {
  state: (): CategoryTreeState => ({
    listOfRootBranches: []
  }),
  getters: {
    flattenList: (state): CategoryTree[] =>
      flattenCategoryTree(state.listOfRootBranches),
    dictionary(): Record<number, CategoryTree> {
      return creatreCategoryTreeDictionary(this.flattenList);
    }
  }
});

/**
 * Category tree [Pinia](https://pinia.vuejs.org/) store.
 */
export type CategoryTreeStore = ReturnType<typeof useCategoryTreeStore>;
