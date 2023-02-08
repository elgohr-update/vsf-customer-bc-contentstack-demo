import { Ref } from '@nuxtjs/composition-api';
import {
  GraphQL,
  GetFiltersParameters
} from '@vsf-enterprise/bigcommerce-api';

/**
 * `useFilters` composable errors.
 */
export interface UseFilterErrors {
  /**
   * Errors occurred during `load` action.
   */
  load: Error;
}

/**
 * Data and methods returned from the {@link useFilters|useFilters()} composable
 */
export interface UseFilterInterface {
  /**
   * Contains errors from the composable methods.
   */
  error: Ref<UseFilterErrors>;

  /**
   * Indicates whether any of the methods is in progress.
   */
  loading: Ref<boolean>;

  /**
   * load filters.
   */
  load: (
    params: GetFiltersParameters
  ) => Promise<GraphQL.SearchProductFilterConnection>;
}
