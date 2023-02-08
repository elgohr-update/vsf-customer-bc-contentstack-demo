import { Ref } from '@nuxtjs/composition-api';
import { Product } from '@vsf-enterprise/bigcommerce-api';
import {
  UseWishlistErrors,
  WishlistItem
} from '~/composables/useWishlist/types';

/**
 * Guest wishlist stored item.
 */
export interface GuestWishlistItem {
  /**
   * Item it created from product id and variant id in ${product_id}_${variant_id} format.
   */
  id: string;

  /**
   * Id of the product vartiant.
   */
  variant_id?: number;

  /**
   * Id of the product from wishlist.
   */
  product_id: number;
}

/**
 * Data and methods returned from the {@link useGuestWishlist|useGuestWishlist()} composable
 */
export interface UseGuestWishlistInterface {
  /**
   * Contains errors from the composable methods
   */
  error: Ref<UseWishlistErrors>;

  /**
   * Indicates whether any of the methods is in progress
   */
  loading: Ref<boolean>;

  /**
   * Loads the guest wishlist.
   *
   * @remarks
   *
   * Loaded wishlist is stored in `wishlistStore` and saved in `localStorage`.
   * Available on client-side only.
   */
  load(): Promise<void>;

  /**
   * Checks whether a `product` is in the guest `wishlist`.
   */
  isInWishlist(product: Product): boolean;

  /**
   * Add a `product` to  the guest `wishlist`.
   */
  addItem(product: Product): Promise<void>;

  /**
   * Removes a `wishlistItem` from  the guest `wishlist`.
   */
  removeItem(wishlistItem: WishlistItem): Promise<void>;

  /**
   * Removes all items from the guest wishlist and create new, empty guest wishlist.
   */
  clear(): Promise<void>;
}
