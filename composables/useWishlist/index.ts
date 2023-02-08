import { useLogger } from '~/composables/useLogger';
import { ref, useContext } from '@nuxtjs/composition-api';
import { UseWishlistInterface, Wishlist, UseWishlistErrors } from './types';
import { useGuestWishlist, useProduct } from '~/composables';
import { useCustomerStore, useWishlistStore } from '~/stores';
import { getPurchasableDefaultVariant } from '~/composables/useProduct/helpers';
import { EMPTY_PRODUCT_RESPONSE } from './helpers';
import { storeToRefs } from 'pinia';
import {
  GuestWishlistItem,
  BigcommerceIntegrationContext,
  WishlistItem
} from '~/types';
import { Product } from '@vsf-enterprise/bigcommerce-api';

/**
 * @public
 *
 * Allows loading and manipulating wishlist.
 *
 * @remarks
 *
 * Composable would use guest wishlist for not-logged in users and BigCommerce wishlist for authenticated customers.
 *
 * See the {@link UseWishlistInterface} for a list of methods and values available in this composable.
 */
export const useWishlist = (): UseWishlistInterface => {
  const { $config, $bigcommerce } = useContext();
  const { Logger } = useLogger();
  const { isAuthenticated } = storeToRefs(useCustomerStore());
  const loading = ref(false);
  const { search: searchProducts } = useProduct();
  const { wishlist } = storeToRefs(useWishlistStore());
  const {
    load: guestLoad,
    addItem: guestAddItem,
    removeItem: guestRemoveItem,
    clear: guestClear
  } = useGuestWishlist();
  const error = ref<UseWishlistErrors>({
    load: null,
    addItem: null,
    removeItem: null,
    clear: null
  });

  const addItemsToWishlist = async (
    guestWishlistItems: GuestWishlistItem[],
    wishlistId: Wishlist['id']
  ) => {
    const { data } = await $bigcommerce.api.addWishlistItems({
      wishlistId: wishlistId,
      items: guestWishlistItems.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id
      }))
    });

    return data;
  };

  async function createWishlist($bigcommerce: BigcommerceIntegrationContext) {
    const { data } = await $bigcommerce.api.createWishlist({
      name: $config.theme.wishlist.name,
      is_public: $config.theme.wishlist.isPublic,
      items: []
    });

    return data;
  }

  const load = async () => {
    try {
      loading.value = true;
      if (!isAuthenticated.value) {
        return guestLoad();
      }

      const { data: customerWishlists } =
        await $bigcommerce.api.getAllWishlists();
      const rawLocalStorageItem = window.localStorage.getItem(
        $config.theme.wishlist.guest.key
      );
      const { items: guestWishlistItems } = rawLocalStorageItem
        ? JSON.parse(rawLocalStorageItem)
        : { items: [] };
      const bigcommerceWishlist = customerWishlists.length
        ? customerWishlists[0]
        : await createWishlist($bigcommerce);
      const syncedWishlist = guestWishlistItems.length
        ? await addItemsToWishlist(guestWishlistItems, bigcommerceWishlist.id)
        : bigcommerceWishlist;

      const wishlistProductData = await searchProducts({
        'id:in': syncedWishlist.items.map((item) => item.product_id),
        include: 'variants'
      });

      if (guestWishlistItems.length > 0) {
        window.localStorage.removeItem($config.theme.wishlist.guest.key);
      }

      const wishlistToPatch = {
        wishlist_product_data: wishlistProductData || EMPTY_PRODUCT_RESPONSE,
        ...syncedWishlist
      };
      wishlist.value = wishlistToPatch;
    } catch (err) {
      Logger.error('useWishlist/load', err);
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
      loading.value = true;

      if (!isAuthenticated.value) {
        return guestAddItem(product);
      }

      const productId = product.id;
      const variantId = getPurchasableDefaultVariant(product)?.id;

      const res = await $bigcommerce.api.addWishlistItems({
        wishlistId: wishlist.value.id,
        items: [
          {
            product_id: productId,
            variant_id: variantId
          }
        ]
      });
      const updatedWishlist = {
        ...res.data,
        wishlist_product_data: EMPTY_PRODUCT_RESPONSE
      };
      const wishlistProductData = await searchProducts({
        'id:in': updatedWishlist.items.map((item) => item.product_id),
        include: 'variants'
      });
      updatedWishlist.wishlist_product_data =
        wishlistProductData || EMPTY_PRODUCT_RESPONSE;
      wishlist.value = updatedWishlist;
    } catch (err) {
      Logger.error('useWishlist/addItem', err);
      error.value.addItem = err;
    } finally {
      loading.value = false;
    }
  };

  const removeItem = async (item: WishlistItem) => {
    try {
      loading.value = true;
      if (!isAuthenticated.value) {
        return guestRemoveItem(item);
      }

      await $bigcommerce.api.removeWishlistItem({
        wishlistId: wishlist.value.id,
        itemId: Number(item.id)
      });

      const items = wishlist.value.items.filter(
        (wishlistItem) => wishlistItem.id !== item.id
      );

      let wishlistProductData = EMPTY_PRODUCT_RESPONSE;

      if (items.length > 0) {
        wishlistProductData =
          (await searchProducts({
            'id:in': items.map((item) => item.product_id),
            include: 'variants'
          })) || EMPTY_PRODUCT_RESPONSE;
      }

      const updatedWishlist = {
        ...wishlist.value,
        items,
        wishlist_product_data: wishlistProductData
      };

      wishlist.value = updatedWishlist;
    } catch (err) {
      Logger.error('useWishlist/removeItem', err);
      error.value.removeItem = err;
    } finally {
      loading.value = false;
    }
  };

  const clear = async () => {
    try {
      loading.value = true;

      if (!isAuthenticated.value) {
        return guestClear();
      }

      await $bigcommerce.api.deleteWishlist(wishlist.value.id);

      const res = await $bigcommerce.api.createWishlist({
        name: $config.theme.wishlist.name,
        is_public: $config.theme.wishlist.isPublic,
        items: []
      });

      wishlist.value = {
        ...res.data,
        wishlist_product_data: EMPTY_PRODUCT_RESPONSE
      };
    } catch (err) {
      Logger.error('useWishlist/clear', err);
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
};
