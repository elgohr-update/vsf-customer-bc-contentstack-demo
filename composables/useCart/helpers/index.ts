/* eslint-disable camelcase */
import {
  Cart,
  CartItem,
  CartIncludeEnum,
  LineItems
} from '@vsf-enterprise/bigcommerce-api';
import { Price } from '~/composables/types';
import { LineItem, ItemAttribute } from '../types';

export const getItemName = (item: CartItem): string => {
  return item?.name ?? '';
};

export const getItemImage = (item: CartItem): string => {
  return item?.image_url ?? '';
};

export const getItemPrice = (item: CartItem): Price => {
  if (item && item.list_price !== item.sale_price) {
    return {
      regular: item.list_price,
      special: item.sale_price
    };
  }

  return {
    regular: item?.sale_price ?? 0
  };
};

export const getItemQty = (item: CartItem): number => {
  return item?.quantity ?? 0;
};

export const getItemAttributes = (
  item: CartItem,
  filterByAttributeName?: Array<string>
): Record<string, ItemAttribute | string> => {
  return (
    item?.options?.reduce((acc, attribute) => {
      if (
        !filterByAttributeName ||
        filterByAttributeName.includes(attribute.name)
      ) {
        acc[attribute.name] = attribute.value;
      }

      return acc;
    }, {} as Record<string, string>) ?? {}
  );
};

export function getItemSku(item: CartItem): string {
  return item?.sku ?? '';
}

/**
 * Create string with filed should be included to cart response.
 * @returns {string}
 */
export const getCartIncludeParamValue = () => {
  return Object.values(CartIncludeEnum).join(',') as CartIncludeEnum;
};

export const isGuestCart = (currentCart: Cart) => {
  return !currentCart || !currentCart.customer_id;
};

export const areLineItemsEmpty = (lineItems: LineItems) => {
  return lineItems.physical_items.length + lineItems.digital_items.length === 0;
};

export const trimObjectToLineItem = (lineItemSuperset: LineItem): LineItem => {
  const { product_id, variant_id, quantity, parent_id } =
    lineItemSuperset as any;
  return { product_id, variant_id, quantity, parent_id } as LineItem;
};
