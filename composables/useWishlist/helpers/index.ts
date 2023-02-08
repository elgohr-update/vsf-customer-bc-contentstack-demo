import { WishlistItem, WishlistItemParams, Price } from '~/composables/types';
import {
  InventoryTrackingType,
  Product
} from '@vsf-enterprise/bigcommerce-api';
import {
  getVariantById,
  getCoverImageUrl,
  createPriceObject,
  getConfigurationOptions
} from '~/composables/useProduct/helpers';
import { Wishlist, Totals } from '../types';

export const EMPTY_PRODUCT_RESPONSE: Wishlist['wishlist_product_data'] = {
  data: [],
  meta: {
    pagination: {
      total: 0,
      count: 0,
      per_page: 50,
      current_page: 1,
      total_pages: 0,
      links: {
        current:
          '?id%3Ain=&include=variants%2Cimages&is_visible=true&page=1&limit=50'
      }
    }
  }
};

export const getProduct = (
  wishlist: Wishlist,
  wishlistItem: WishlistItem
): Product => {
  if (!wishlist) return null;

  return wishlist.wishlist_product_data.data?.find(
    (item) => item.id === wishlistItem.product_id
  );
};

export const getItems = (wishlist: Wishlist): WishlistItem[] => {
  return wishlist?.items || [];
};

export const getItem = (
  wishlist: Wishlist,
  params: WishlistItemParams
): WishlistItem | undefined => {
  return wishlist?.items.find(
    (item) =>
      item.product_id === params.productId &&
      item.variant_id === params.variantId
  );
};

export const getItemName = (wishlist: Wishlist, item: WishlistItem): string => {
  const product = getProduct(wishlist, item);
  return product?.name || '';
};

export const getItemImage = (
  wishlist: Wishlist,
  item: WishlistItem
): string => {
  const product = getProduct(wishlist, item);
  if (!product) return '';
  const variant = getVariantById(product, item.variant_id);

  return variant?.image_url || getCoverImageUrl(product);
};

export const getItemPrice = (wishlist: Wishlist, item: WishlistItem): Price => {
  const product = getProduct(wishlist, item);
  if (!product) return { regular: null };
  const variant = getVariantById(product, item.variant_id);
  return createPriceObject(product, variant);
};

export const getItemOptions = (
  wishlist: Wishlist,
  item: WishlistItem,
  filters?: string[]
): ReturnType<typeof getConfigurationOptions> => {
  const product = getProduct(wishlist, item);
  return product ? getConfigurationOptions(product, filters) : null;
};

export const getItemSku = (wishlist: Wishlist, item: WishlistItem): string => {
  const product = getProduct(wishlist, item);
  return product?.sku || '';
};

export const getItemQty = (wishlist: Wishlist, item: WishlistItem): number => {
  const product = getProduct(wishlist, item);
  if (!product) return 0;
  const variant = getVariantById(product, item.variant_id);
  return variant?.inventory_level || product?.inventory_level || 0;
};

export const isItemPurchasable = (
  wishlist: Wishlist,
  item: WishlistItem
): boolean => {
  const product = getProduct(wishlist, item);
  if (!product) return;
  const variant = getVariantById(product, item.variant_id);

  switch (product.inventory_tracking) {
    case InventoryTrackingType.none:
      return true;
    case InventoryTrackingType.product:
      return product.inventory_level >= 1;
    case InventoryTrackingType.variant:
      if (!variant) return false;
      return variant.inventory_level >= 1;
  }
};

export const getShippingPrice = (wishlist: Wishlist): number => {
  return (
    wishlist?.wishlist_product_data?.data.reduce((price, product) => {
      price += product.fixed_cost_shipping_price;
      return price;
    }, 0) || 0
  );
};

export const getTotalItems = (wishlist: Wishlist): number => {
  return wishlist?.items?.length || 0;
};

export const getTotals = (wishlist: Wishlist): Totals => {
  const subtotal = wishlist?.items.reduce((sum, item) => {
    const product = getProduct(wishlist, item);
    if (!product) return sum + 0;
    const variant = getVariantById(product, item.variant_id);
    const price = createPriceObject(product, variant);
    return sum + (price.special || price.regular || 0);
  }, 0);

  const shippingPrice = getShippingPrice(wishlist);

  const total = subtotal + shippingPrice;

  return {
    total,
    subtotal
  };
};
