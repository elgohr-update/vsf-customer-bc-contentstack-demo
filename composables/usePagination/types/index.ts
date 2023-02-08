import { ComputedRef, Ref } from '@nuxtjs/composition-api';
import { MetaCollection } from '@vsf-enterprise/bigcommerce-api';

/**
 * Pagination object formatted for client-side
 */
export interface GetPaginationResponse {
  /**
   * Current page
   */
  currentPage: number;
  /**
   * Total page
   */
  totalPages: number;
  /**
   * Total items
   */
  totalItems: number;
  /**
   * Current selected size of the page
   */
  itemsPerPage: number;
  /**
   * Available size options of the page
   */
  pageOptions: number[];
}

/**
 * Collection object is derived from the common paginated collection from BigCommerce API
 */
export interface Collection {
  /**
   * List of data from the collection
   */
  data: unknown[];
  /**
   * Data about the response, including pagination and collection totals.Pagination links for the previous and next parts of the whole collection.
   */
  meta: MetaCollection;
}

/**
 * Collection reactive type
 */
export type PaginatedCollection = Ref<Collection>;

/**
 * Data and methods returned from the {@link usePagination|usePagination()} composable
 */
export interface UsePaginationInterface {
  /**
   * Computed pagination.
   */
  pagination: ComputedRef<GetPaginationResponse>;
  /**
   * Computed page info.
   */
  pageInfo: ComputedRef<MetaCollection['pageInfo']>;
}
