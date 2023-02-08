import { ref, useContext } from '@nuxtjs/composition-api';
import {
  GetOrderProductsParameters,
  OrderProductResponse
} from '@vsf-enterprise/bigcommerce-api';
import { useLogger } from '../useLogger';
import { UseOrderProductsInterface, UseOrderProductsErrors } from './types';

/**
 * @public
 *
 * Allows searching for order products.
 *
 * See the {@link UseOrderProductsInterface} for a list of methods and values available in this composable.
 */
export function useOrderProducts(): UseOrderProductsInterface {
  const { $bigcommerce } = useContext();

  const loading = ref(false);
  const { Logger } = useLogger();

  const error = ref<UseOrderProductsErrors>({
    search: null
  });

  async function search(
    params: GetOrderProductsParameters
  ): Promise<OrderProductResponse> {
    try {
      loading.value = true;
      error.value.search = null;

      const response = await $bigcommerce.api.getOrderProducts(params);

      return response;
    } catch (err) {
      Logger.error('useOrderProducts/search', err);
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
