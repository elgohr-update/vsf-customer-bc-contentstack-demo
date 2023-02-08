import { ref, useContext } from '@nuxtjs/composition-api';
import { Product } from '@vsf-enterprise/bigcommerce-api';
import {
  useProduct,
  useLogger
} from '~/composables';
import {
  UseWishlistErrors,
  Wishlist,
  WishlistItem
} from '~/composables/useWishlist/types';
import { UseGuestWishlistInterface } from './types';
import { getPurchasableDefaultVariant } from '~/composables/useProduct/helpers';
import { EMPTY_PRODUCT_RESPONSE } from '~/composables/useWishlist/helpers';
import { useWishlistStore } from '~/stores';
import { storeToRefs } from 'pinia';

/**
 * Allows loading and manipulating wishlist of the guest user.
 *
 * See the {@link UseGuestWishlistInterface} for a list of methods and values available in this composable.
 */
export function useGuestWishlist(): UseGuestWishlistInterface {
  const { $config } = useContext();
  const { Logger } = useLogger();
  const { wishlist } = storeToRefs(useWishlistStore());
  const loading = ref(false);
  const { search: searchProducts } = useProduct();
  const error = ref<UseWishlistErrors>({
    load: null,
    addItem: null,
    removeItem: null,
    clear: null
  });

  const load = async () => {
    try {
      error.value.load = null;

      let guestWishlist: Wishlist = {
        id: $config.theme.wishlist.guest.id,
        name: $config.theme.wishlist.guest.name,
        customer_id: $config.theme.wishlist.guest.customerId,
        items: [],
        wishlist_product_data: EMPTY_PRODUCT_RESPONSE,
        is_public: $config.theme.wishlist.isPublic,
        token: $config.theme.wishlist.guest.token
      };

      const localStorageItem = window.localStorage.getItem(
        $config.theme.wishlist.guest.key
      );

      if (!localStorageItem) {
        window.localStorage.setItem(
          $config.theme.wishlist.guest.key,
          JSON.stringify(guestWishlist)
        );

        wishlist.value = guestWishlist;

        return;
      }

      guestWishlist = JSON.parse(localStorageItem);

      if (guestWishlist.items.length > 0) {
        const wishlistProductData =
          (await searchProducts({
            'id:in': guestWishlist.items.map((item) => item.product_id),
            include: 'variants'
          })) ||
          EMPTY_PRODUCT_RESPONSE;

        guestWishlist.wishlist_product_data = wishlistProductData;
      }

      wishlist.value = guestWishlist;

      window.localStorage.setItem(
        $config.theme.wishlist.guest.key,
        JSON.stringify(guestWishlist)
      );
    } catch (err) {
      Logger.error('useGuestWishlist/load', err);
      error.value.load = err;
    } finally {
      loading.value = false;
    }
  };

  const isInWishlist = (product: Product) => {
    const productId = product.id;
    const variantId = getPurchasableDefaultVariant(product)?.id;

    return wishlist.value.items.some(
      (item) => item.product_id === productId && item.variant_id === variantId
    );
  };

  const addItem = async (product: Product) => {
    try {
      error.value.addItem = null;
      const variantId = getPurchasableDefaultVariant(product)?.id;

      if (!isInWishlist(product)) {
        wishlist.value.items.push({
          id: `${product.id}_${variantId}`,
          product_id: product.id,
          variant_id: variantId
        });

        const wishlistProductData =
          (await searchProducts({
            'id:in': wishlist.value.items.map((item) => item.product_id),
            include: 'variants'
          })) || EMPTY_PRODUCT_RESPONSE;

        wishlist.value.wishlist_product_data = wishlistProductData;

        localStorage.setItem(
          $config.theme.wishlist.guest.key,
          JSON.stringify(wishlist.value)
        );
      }
    } catch (err) {
      Logger.error('useGuestWishlist/addItem', err);
      error.value.addItem = err;
    } finally {
      loading.value = false;
    }
  };

  const removeItem = async (wishlistItem: WishlistItem) => {
    try {
      error.value.removeItem = null;
      wishlist.value.items = wishlist.value.items.filter(
        (item) => item.id !== wishlistItem.id
      );

      let wishlistProductData = EMPTY_PRODUCT_RESPONSE;

      if (wishlist.value.items.length > 0) {
        wishlistProductData =
          (await searchProducts({
            'id:in': wishlist.value.items.map((item) => item.product_id),
            include: 'variants'
          })) || EMPTY_PRODUCT_RESPONSE;
      }

      wishlist.value.wishlist_product_data = wishlistProductData;

      localStorage.setItem(
        $config.theme.wishlist.guest.key,
        JSON.stringify(wishlist.value)
      );
    } catch (err) {
      Logger.error('useGuestWishlist/removeItem', err);
      error.value.removeItem = err;
    } finally {
      loading.value = false;
    }
  };

  const clear = async () => {
    try {
      error.value.clear = null;
      wishlist.value.items = [];
      wishlist.value.wishlist_product_data = EMPTY_PRODUCT_RESPONSE;

      localStorage.setItem(
        $config.theme.wishlist.guest.key,
        JSON.stringify(wishlist.value)
      );
    } catch (err) {
      Logger.error('useGuestWishlist/clear', err);
      error.value.clear = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    load,
    isInWishlist,
    addItem,
    removeItem,
    clear,
    loading,
    error
  };
}
