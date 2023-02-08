import { ref, useContext } from '@nuxtjs/composition-api';
import { GetOrdersParameters } from '@vsf-enterprise/bigcommerce-api';
import { UseOrderInterface } from './types';

/**
 * @public
 *
 * Allows searching for oders.
 *
 * See the {@link UseOrderInterface} for a list of methods and values available in this composable.
 */
export function useOrder(): UseOrderInterface {
  const { $bigcommerce } = useContext();

  const loading = ref(false);

  const error = ref<{ search: Error }>({
    search: null
  });

  async function search(params?: GetOrdersParameters) {
    try {
      loading.value = true;
      error.value.search = null;

      const response = await $bigcommerce.api.getOrders(params);

      return response;
    } catch (err) {
      error.value.search = err;
    } finally {
      loading.value = false;
    }
  }

  return {
    search,
    loading,
    error
  };
}
