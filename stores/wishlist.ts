import { defineStore } from 'pinia';
import { Wishlist } from '~/composables/useWishlist/types';
import { EMPTY_PRODUCT_RESPONSE } from '~/composables/useWishlist/helpers';

const wishlist: Wishlist = {
  id: 0,
  name: null,
  items: [],
  token: null,
  customer_id: 0,
  is_public: true,
  wishlist_product_data: EMPTY_PRODUCT_RESPONSE
};

/**
 * State of `useWishlistStore`.
 */
interface WishlistState {
  /**
   * Current wishlist.
   */
  wishlist: Wishlist;
}

/**
 * Wishlist [Pinia](https://pinia.vuejs.org/) store.
 */
export const useWishlistStore = defineStore('wishlistStore', {
  state: (): WishlistState => ({
    wishlist
  })
});

/**
 * Wishlist [Pinia](https://pinia.vuejs.org/) store.
 */
export type WishlistStore = ReturnType<typeof useWishlistStore>;
