import { ComputedRef } from '@nuxtjs/composition-api';

/**
 * Sort option.
 */
export interface SortOption {
  /**
   * Type.
   */
  type: string;
  /**
   * Id.
   */
  id: string;
  /**
   * Value.
   */
  value: any;
  /**
   * Attribute name
   */
  attrName?: string;
  /**
   * Count.
   */
  count?: number;
  /**
   * Indicates whether sort option is selected.
   */
  selected?: boolean;
  /**
   * Meta data.
   */
  metadata?: any;
  /**
   * Label.
   */
  label?: string;
}

/**
 * Data returned from the {@link useSortOptions|useSortOptions()} composable
 */
export interface UseSortOptionsInterface {
  /**
   * Available sort options.
   */
  sortOptions: ComputedRef<SortOption[]>;

  /**
   * Selected sort option based on the route.
   */
  selected: ComputedRef<string>;
}
