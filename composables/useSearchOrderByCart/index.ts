import { ref, useContext } from '@nuxtjs/composition-api';
import { useLogger } from '~/composables/useLogger';
import {
  GetOrderByCartParameters,
  OrderByCartResponse
} from '@vsf-enterprise/bigcommerce-api';
import {
  UseSearchOrderByCartErrors,
  UseSearchOrderByCartInterface
} from './types';

/**
 * @public
 *
 * Allows searching for order data by cart id.
 *
 * See the {@link UseSearchOrderByCartInterface} for a list of methods and values available in this composable.
 */
export function useSearchOrderByCart(): UseSearchOrderByCartInterface {
  const { $bigcommerce } = useContext();
  const { Logger } = useLogger();

  const loading = ref(false);

  const error = ref<UseSearchOrderByCartErrors>({
    search: null
  });

  async function search(
    params: GetOrderByCartParameters
  ): Promise<OrderByCartResponse> {
    try {
      loading.value = true;
      error.value.search = null;

      const response = await $bigcommerce.api.getOrderByCart(params);

      return response;
    } catch (err) {
      Logger.error('useSearchOrderByCart/search', err);

      error.value.search = err;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    search
  };
}
