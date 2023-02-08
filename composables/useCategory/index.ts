import { useContext, ref } from '@nuxtjs/composition-api';
import {
  CategoryResponse,
  CategoryParameters,
  Product
} from '@vsf-enterprise/bigcommerce-api';
import { useLogger } from '~/composables/useLogger';
import {
  Breadcrumb,
  UseCategoryInterface,
  UseCategoryError,
  SearchCategory
} from './types';
import { useCategoryTreeStore } from '~/stores/categoryTree';

/**
 * @public
 *
 * Allows loading category tree list for current storefront and categories information.
 * It can be also used to build breadcrumbs and search categories.
 *
 * See the {@link UseCategoryInterface} for a list of methods and values available in this composable.
 */
export function useCategory(): UseCategoryInterface {
  const loading = ref(false);
  const { Logger } = useLogger();
  const error = ref<UseCategoryError>({
    loadCategoryTreeList: null,
    fetchCategory: null
  });
  const { i18n, localePath, $bigcommerce } = useContext();
  const categoryTreeStore = useCategoryTreeStore();

  const loadCategoryTreeList = async () => {
    if (categoryTreeStore.listOfRootBranches.length) return;

    try {
      loading.value = true;
      error.value.loadCategoryTreeList = null;

      const categoryTreeResponse = await $bigcommerce.api.getCategoryTree();

      categoryTreeStore.listOfRootBranches = categoryTreeResponse.data;
    } catch (err) {
      Logger.error('useCategory/loadCategoryTreeList', err);
      error.value.loadCategoryTreeList = err;
    } finally {
      loading.value = false;
    }
  };

  const buildBreadcrumbs = (categoryId: number): Breadcrumb[] => {
    const home = { text: i18n.t('Home') as string, link: localePath('/') };
    const categoryTreeLevel = categoryTreeStore.dictionary[categoryId];

    if (!categoryTreeStore.listOfRootBranches.length || !categoryTreeLevel) {
      return [home];
    }

    const intermediateCategories = categoryTreeLevel.path.map((id) => {
      const level = categoryTreeStore.dictionary[id];

      return {
        text: i18n.t(level.name) as string,
        link: localePath(`/c${level.url}`)
      };
    });

    const currentCategory = {
      text: i18n.t(categoryTreeLevel.name) as string,
      link: localePath(`/c${categoryTreeLevel.url}`)
    };

    return [home, ...intermediateCategories, currentCategory];
  };

  const buildSearchCategories = (products: Product[]): SearchCategory[] => {
    const productsCategories = [
      ...new Set(products.map((product) => product.categories).flat())
    ];
    return productsCategories
      .map((categoryId) => {
        const categoryTreeLevel = categoryTreeStore.dictionary[categoryId];

        if (categoryTreeLevel) {
          return {
            key: categoryTreeLevel.id,
            label: categoryTreeLevel.name,
            slug: localePath(`/c${categoryTreeLevel.url}`)
          };
        }

        return null;
      })
      .filter((item) => Boolean(item));
  };

  const fetchCategory = async (
    params: CategoryParameters
  ): Promise<CategoryResponse> => {
    try {
      loading.value = true;
      error.value.fetchCategory = null;

      return await $bigcommerce.api.getCategory(params);
    } catch (err) {
      Logger.error('useCategory/fetchCategory', err);
      error.value.fetchCategory = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    loadCategoryTreeList,
    buildBreadcrumbs,
    buildSearchCategories,
    fetchCategory
  };
}
