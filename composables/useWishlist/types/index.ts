import { Ref } from '@nuxtjs/composition-api';
import {
  ProductsResponse,
  Wishlist as WishlistAPI,
  WishlistItem as WishlistItemAPI,
  Product
} from '@vsf-enterprise/bigcommerce-api';
import { GuestWishlistItem } from '~/composables/useGuestWishlist/types';

/**
 * Wishlist stored item.
 */
export type WishlistItem = GuestWishlistItem | WishlistItemAPI;

/**
 * Parameters of wishlist item.
 */
export interface WishlistItemParams {
  /**
   * Id of the product.
   */
  productId: number;
  /**
   * Id of the product's variant.
   */
  variantId?: number;
}

/**
 * A wishlist.
 */
export interface Wishlist extends Omit<WishlistAPI, 'items'> {
  /**
   * Response of get products api call
   */
  wishlist_product_data: ProductsResponse;

  /**
   * Array of wishlist items.
   */
  items: WishlistItem[];
}

/**
 * `useWishlist` composable errors.
 */
export interface UseWishlistErrors {
  /**
   * Errors occurred during `load` action.
   */
  load: Error;

  /**
   * Errors occurred during `addItem` action.
   */
  addItem: Error;

  /**
   * Errors occurred during `removeItem` action.
   */
  removeItem: Error;

  /**
   * Errors occurred during `clear` action.
   */
  clear: Error;
}

/**
 * Data and methods returned from the {@link useWishlist|useWishlist()} composable
 */
export type UseWishlistInterface = {
  /**
   * Contains errors from the composable methods.
   */
  error: Ref<UseWishlistErrors>;

  /**
   * Indicates whether any of the methods is in progress.
   */
  loading: Ref<boolean>;

  /**
   * Loads current wishlist.
   *
   * @remarks
   *
   * Saves the details returned from the API in the `wishlistStore`.
   */
  load: () => Promise<void>;

  /**
   * Adds an item to the wishlist.
   *
   * @remarks
   *
   * Saves the details returned from the API in the `wishlistStore`.
   */
  addItem: (product: Product) => Promise<void>;

  /**
   * Removes an item from the wishlist.
   *
   * @remarks
   *
   * Saves the details returned from the API in the `wishlistStore`.
   */
  removeItem: (item: WishlistItem) => Promise<void>;

  /**
   * Clears current wishlist.
   *
   * @remarks
   *
   * Saves the details returned from the API in the `wishlistStore`.
   */
  clear: () => Promise<any>;

  /**
   * Checks whether a `product` is in the `wishlist`.
   */
  isInWishlist: (product: Product) => boolean;
};

/**
 * Wishlist total prices..
 */
export interface Totals {
  /**
   * Total price, includes shipping.
   */
  total: number;
  /**
   * Subtotal price.
   */
  subtotal: number;
  /**
   * Special price.
   */
  special?: number;
  /**
   * Other values.
   */
  [x: string]: unknown;
}
