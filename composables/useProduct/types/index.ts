import type { Ref } from '@nuxtjs/composition-api';
import type {
  GetProductsParameters,
  GetProductsWithFilterParameters,
  ProductsResponse
} from '@vsf-enterprise/bigcommerce-api';

/**
 * Inventory tracking object with the current level, warning level and if its a product or variant
 */
export interface InventoryValue {
  /**
   * Base on value of product inventory tracking type.
   */
  enabled: boolean;
  /**
   * Current inventory level of the product. Simple inventory tracking must be enabled (See the `inventory_tracking` field) for this to take any effect.
   */
  current?: number;
  /**
   * * Inventory warning level for the product. When the product's inventory level drops below the warning level, the store owner will be informed. Simple inventory tracking must be enabled (see the `inventory_tracking` field) for this to take any effect.
   */
  warningLevel?: number;
}

/**
 * `useProduct` composable errors.
 */
export interface UseProductErrors {
  /**
   * Errors occurred during `search` action.
   */
  search: Error;
  /**
   * Errors occurred during `filter` action.
   */
  filter: Error
}

/**
 * Data and methods returned from the {@link useProduct|useProduct()} composable
 */
export interface UseProductInterface {
  /**
   * Contains errors from the composable methods.
   */
  error: Ref<UseProductErrors>;

  /**
   * Indicates whether any of the methods is in progress.
   */
  loading: Ref<boolean>;

  /**
   * Searches for products.
   */
  search: (params: GetProductsParameters) => Promise<ProductsResponse>;

  /**
   * Filters products.
   */
  filter: (params: GetProductsWithFilterParameters) => Promise<ProductsResponse>
}

/**
 * Price used by `SfPrice` component.
 */
export interface Price {
  /**
   * Regular price.
   */
  regular: number | null;

  /**
   * Special price.
   */
  special?: number | null;
}
