import {
  AddLineItemsParameters,
  PhysicalCartItem,
  DigitalCartItem,
  Product
} from '@vsf-enterprise/bigcommerce-api';
import type { Ref } from '@nuxtjs/composition-api';

/**
 * Type alias for physical and digital cart items.
 */
export type CartItem = PhysicalCartItem | DigitalCartItem;

/**
 * Type alias for the item of AddLineItemsParameters line items array.
 */
export type LineItem = AddLineItemsParameters['data']['line_items'][number];

/**
 * Cart actions errors.
 */
export interface UseCartErrors {
  /**
   * Errors occurred during `addItem` action.
   */
  addItem: Error;
  /**
   * Errors occurred during `removeItem` action.
   */
  removeItem: Error;
  /**
   * Errors occurred during `updateItemQty` action.
   */
  updateItemQty: Error;
  /**
   * Errors occurred during `load` action.
   */
  load: Error;
  /**
   * Errors occurred during `loadCustomerCart` action.
   */
  loadCustomerCart: Error;
  /**
   * Errors occurred during `clear` action.
   */
  clear: Error;
}

/**
 * Data and methods returned from the {@link useCart|useCart()} composable
 */
export interface UseCartInterface {
  /**
   * Contains errors from the composable methods.
   */
  error: Ref<UseCartErrors>;

  /**
   * Indicates whether any of the methods is in progress.
   */
  loading: Ref<boolean>;

  /**
   * Loads the current cart.
   */
  load(forceNew?: boolean): Promise<void>;

  /**
   * Loads the cart for current customer.
   *
   * @remarks
   *
   * It also merges guest cart wth customer's cart.
   */
  loadCustomerCart(): Promise<void>;

  /**
   * Takes in a `product`, its `quantity` and `variantId` and adds it to the cart.
   */
  addItem(
    product: Product,
    quantity?: number,
    variantId?: number
  ): Promise<void>;

  /**
   * Removes an `cartItem` from a `cart`.
   */
  removeItem(cartItem: CartItem): Promise<void>;

  /**
   * Updates the `quantity` of an `cartItem` in a `cart`
   */
  updateItemQty(cartItem: CartItem, quantity: number): Promise<void>;

  /**
   * Removes all items from the cart and create new, empty cart.
   */
  clear(): Promise<void>;

  /**
   * Checks whether a `product` is in the `cart`.
   */
  isInCart(product: Product): boolean;
}

/**
 * Cart item attribute.
 */
export interface ItemAttribute {
  /**
   * Attribute name.
   */
  name?: string;
  /**
   * Attribute value.
   */
  value: string | Record<string, any>;
  /**
   * Attribute label.
   */
  label: string;
}
