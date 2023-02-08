import { useContext, ref } from '@nuxtjs/composition-api';
import { useLogger } from '~/composables/useLogger';
import { GetFiltersParameters, GraphQL } from '@vsf-enterprise/bigcommerce-api';
import { UseFilterErrors, UseFilterInterface } from './types';

/**
 * @public
 *
 * Allows loading filters available for products.
 *
 * See the {@link UseFilterInterface} for a list of methods and values available in this composable.
 */
export function useFilters(): UseFilterInterface {
  const { $bigcommerce } = useContext();
  const { Logger } = useLogger();

  const loading = ref(false);
  const error = ref<UseFilterErrors>({
    load: null
  });

  const load = async (
    params: GetFiltersParameters
  ): Promise<GraphQL.SearchProductFilterConnection> => {
    try {
      loading.value = true;
      error.value.load = null;

      return await $bigcommerce.api.getFilters(params);
    } catch (err) {
      Logger.error('useFilters/load', err);
      error.value.load = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    load,
    loading,
    error
  };
}
