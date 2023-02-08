import type { Ref } from '@nuxtjs/composition-api';
import {
  CategoryParameters,
  CategoryResponse,
  Product
} from '@vsf-enterprise/bigcommerce-api';

/**
 * Breadcrumb model.
 */
export interface Breadcrumb {
  /**
   * Breadcrumb text.
   */
  text: string;
  /**
   * Breadcrumb link.
   */
  link: string;
}

/**
 * Search category entry.
 */
export interface SearchCategory {
  /**
   * Unique identifier.
   */
  key: number;
  /**
   * Category label.
   */
  label: string;
  /**
   * Category slug.
   */
  slug: string;
}

/**
 * Search result navigation item model.
 */
export interface SearchResultNavigationItem {
  /**
   * Search result item slug.
   */
  slug: string;
  /**
   * Search result item label.
   */
  label: string;
  /**
   * Search result item key.
   */
  key: string;
}

/**
 * `useCategory` errors.
 */
export interface UseCategoryError {
  /**
   * Errors occurred during `loadCategoryTree` action.
   */
  loadCategoryTreeList: Error;
  /**
   * Errors occurred during `getCategoryDetails` action.
   */
  fetchCategory: Error;
}

/**
 * Data and methods returned from the {@link useCategory|useCategory()} composable
 */
export interface UseCategoryInterface {
  /**
   * Contains errors from the composable methods.
   */
  error: Ref<UseCategoryError>;

  /**
   * Indicates whether any of the methods is in progress.
   */
  loading: Ref<boolean>;

  /**
   * Loads the category treee.
   *
   * @remarks
   *
   * Fetches category tree list from the API and stores it in `categoryTreeStore`.
   *
   * @example
   *
   * Loading a category tree for current storefront.
   *
   * ```typescript
   * import { defineComponent, useAsync } from '@nuxtjs/composition-api';
   * import { useCategory } from '~/composables';
   * import { useCategoryTreeStore } from '~/stores';
   *
   * export default defineComponent({
   *   setup() {
   *     const categoryTreeStore = useCategoryTreeStore();
   *     const { loadCategoryTreeList } = useCategory();
   *
   *     useAsync(async () => {
   *       await loadCategoryTreeList();
   *     });
   *
   *     const navigation = computed(() =>
   *       categoryTreeStore.listOfRootBranches.map((rootLevel) => ({
   *         key: rootLevel.id,
   *         label: rootLevel.name,
   *         slug: rootLevel.url
   *       }))
   *     );
   *
   *     return { navigation };
   *   }
   * });
   * ```
   */
  loadCategoryTreeList(): Promise<void>;

  /**
   * Builds breadcrumbs.
   *
   * @remarks
   *
   * Breadcrumbs starts from home page and ends at a category with a passed id.
   * If no `categoryId` is passed, it responds with breadcrumb for home page only.
   *
   * @example
   *
   * Building breadcrumbs on `Category` page.
   *
   * ```typescript
   * import { defineComponent } from '@nuxtjs/composition-api';
   * import { useCategory } from '~/composables';
   * import { useCategoryTreeStore } from '~/stores';
   *
   * export default defineComponent({
   *   setup() {
   *     const categoryTreeStore = useCategoryTreeStore();
   *     const { buildBreadcrumbs } = useCategory();
   *
   *     const activeCategory = computed(() =>
   *       categoryTreeStore.flattenList.find((level) => level.url === categorySlug)
   *     );
   *
   *     const breadcrumbs = computed(() =>
   *       buildBreadcrumbs(activeCategory.value?.id)
   *     );
   *
   *     return { breadcrumbs };
   *   }
   * });
   * ```
   */
  buildBreadcrumbs(categoryId: number): Breadcrumb[];

  /**
   * Builds the list of search categories.
   *
   * @example
   *
   * Building search categories in search handler.
   *
   * ```typescript
   * import { defineComponent } from '@nuxtjs/composition-api';
   * import { useCategory, useProduct } from '~/composables';
   * import { useCategoryTreeStore } from '~/stores';
   *
   * export default defineComponent({
   *   setup() {
   *     const { search } = useProduct();
   *     const { buildSearchCategories } = useCategory();
   *
   *     const handleSearch = debounce(async (paramValue) => {
   *       if (!paramValue.target) {
   *         term.value = paramValue;
   *       } else {
   *         term.value = paramValue.target.value;
   *       }
   *
   *       const products = await search({
   *         'keyword:like:': term.value.trim(),
   *         include: 'options,variants'
   *       });
   *
   *       const categories = buildSearchCategories(products.data);
   *
   *       result.value = { products: products.data, categories };
   *     }, 1000);
   *
   *     return { handleSearch };
   *   }
   * });
   * ```
   */
  buildSearchCategories(products: Product[]): SearchCategory[];

  /**
   * Fetches category details.
   */
  fetchCategory(params: CategoryParameters): Promise<CategoryResponse>;
}
