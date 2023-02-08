import { Ref } from '@nuxtjs/composition-api';
import {
  GetOrderProductsParameters,
  OrderProductResponse
} from '@vsf-enterprise/bigcommerce-api';

/**
 * Errors of {@link useOrderProducts|useOrderProducts()} composable
 */
export interface UseOrderProductsErrors {
  /**
   * Errors occurred during `search` action.
   */
  search: Error;
}

/**
 * Data and methods returned from the {@link useOrderProducts|useOrderProducts()} composable
 */
export interface UseOrderProductsInterface {
  /**
   * Contains errors from the composable methods.
   */
  error: Ref<UseOrderProductsErrors>;

  /**
   * Indicates whether any of the methods is in progress.
   */
  loading: Ref<boolean>;

  /**
   * Searches for order products.
   */
  search: (params: GetOrderProductsParameters) => Promise<OrderProductResponse>;
}
