import { ref, useContext } from '@nuxtjs/composition-api';
import { CreateProductReviewProps } from '@vsf-enterprise/bigcommerce-api';
import { useLogger } from '../useLogger';
import { UseReviewInterface } from './types';

/**
 * @public
 *
 * Allows searching for reviews and adding them to a product.
 *
 * See the {@link UseReviewInterface} for a list of methods and values available in this composable.
 */
export function useReview(): UseReviewInterface {
  const { $bigcommerce } = useContext();

  const loading = ref(false);
  const error = ref({ search: null, add: null });
  const { Logger } = useLogger();

  async function search({ productId, query }) {
    try {
      loading.value = true;
      error.value.search = null;

      const response = await $bigcommerce.api.getProductReviewCollection(
        {
          productId
        },
        query
      );

      return response;
    } catch (err) {
      Logger.error('useReview/search', err);
      error.value.search = err;
    } finally {
      loading.value = false;
    }
  }

  async function add(params: CreateProductReviewProps) {
    try {
      loading.value = true;
      error.value.add = null;

      const response = await $bigcommerce.api.createProductReview(params);

      return response;
    } catch (err) {
      Logger.error('useReview/add', err);
      error.value.add = err;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    search,
    add
  };
}
