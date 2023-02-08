import { ComputedRef } from '@nuxtjs/composition-api';

export type QueryItem = string | string[];

interface FacetsFromUrl {
  page: number;
  sort: QueryItem;
  direction: QueryItem;
  filters: Record<string, QueryItem>;
  itemsPerPage: number;
  term: QueryItem;
}

/**
 * Data and methods returned from the {@link useUiHelpers} composable.
 */
export interface UseUiHelpersInterface {
  /**
   * Current category slug.
   */
  categorySlug: ComputedRef<string>;

  /**
   * Updates current URL with items per page count as query/search param.
   */
  changeItemsPerPage(itemsPerPage: number): void;

  /**
   * Updates current URL with sorting as query/search param.
   */
  changeSorting(sort: string): void;

  /**
   * Updates current URL with filters as query/search param.
   */
  changeFilters(filters?: Record<string, string[]>): void;

  /**
   * Gets facets parameters from current URL query/search params.
   */
  getFacetsFromURL(): FacetsFromUrl;

  /**
   * Returns filter from query in common format as array.
   */
  getFilterFromUrlAsArray(filterFromUrl: QueryItem): string[];

  /**
   * Formats date string.
   */
  formatDateString(date: string, format?: string): string;
}
