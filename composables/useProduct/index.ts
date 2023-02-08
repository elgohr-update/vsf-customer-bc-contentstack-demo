import { useContext, ref } from '@nuxtjs/composition-api';
import { useLogger } from '~/composables/useLogger';
import {
  ProductsResponse,
  GetProductsParameters,
  GetProductsWithFilterParameters
} from '@vsf-enterprise/bigcommerce-api';
import { UseProductInterface, UseProductErrors } from './types';

/**
 * @public
 *
 * Allows searching for products.
 *
 * See the {@link UseProductInterface} for a list of methods and values available in this composable.
 */
export function useProduct(): UseProductInterface {
  const { $bigcommerce } = useContext();
  const { Logger } = useLogger();

  const loading = ref(false);
  const error = ref<UseProductErrors>({
    search: null,
    filter: null
  });

  const search = async (
    params: GetProductsParameters
  ): Promise<ProductsResponse> => {
    try {
      loading.value = true;
      error.value.search = null;

      return await $bigcommerce.api.getProducts(params);
    } catch (err) {
      Logger.error('useProduct/search', err);
      error.value.search = err;
    } finally {
      loading.value = false;
    }
  };

  const filter = async (
    params: GetProductsWithFilterParameters
  ): Promise<ProductsResponse> => {
    try {
      loading.value = true;
      error.value.filter = null;

      return await $bigcommerce.api.getProductsWithFilter(params);
    } catch (err) {
      Logger.error('useProduct/filter', err);
      error.value.filter = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    search,
    filter,
    loading,
    error
  };
}
