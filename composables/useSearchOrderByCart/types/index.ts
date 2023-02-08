import { Ref } from '@nuxtjs/composition-api';
import {
  GetOrderByCartParameters,
  OrderByCartResponse
} from '@vsf-enterprise/bigcommerce-api';

/**
 * `useOrderByCart` composable errors.
 */
export interface UseSearchOrderByCartErrors {
  /**
   * Errors occurred during `load` action.
   */
  search: Error;
}

/**
 * Data and methods returned from the {@link useSearchOrderByCart|useSearchOrderByCart()} composable
 */
export interface UseSearchOrderByCartInterface {
  /**
   * Contains errors from the composable methods.
   */
  error: Ref<UseSearchOrderByCartErrors>;

  /**
   * Indicates whether any of the methods is in progress.
   */
  loading: Ref<boolean>;

  /**
   * Searches order data by cart id.
   */
  search: (params: GetOrderByCartParameters) => Promise<OrderByCartResponse>;
}
