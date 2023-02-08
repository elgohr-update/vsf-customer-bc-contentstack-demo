import { Ref } from '@nuxtjs/composition-api';
import {
  GetOrdersParameters,
  Order,
  OrderItem,
  OrderPaymentMethod
} from '@vsf-enterprise/bigcommerce-api';

/**
 * `useOrder` composable errors.
 */
export interface UseOrderErrors {
  /**
   * Errors occurred during `search` action.
   */
  search: Error;
}

/**
 * Data and methods returned from the {@link useOrder|useOrder()} composable
 */
export interface UseOrderInterface {
  /**
   * Contains errors from the composable methods.
   */
  error: Ref<UseOrderErrors>;

  /**
   * Indicates whether any of the methods is in progress.
   */
  loading: Ref<boolean>;

  /**
   * Searches for an order by used params.
   *
   * @remarks
   *
   * For logged in users, only orders that belongs to the user will be returned.
   */
  search: (params?: GetOrdersParameters) => Promise<Order[]>;
}

/**
 * Order summary use in mapping the BigCommerce OrderByCartResponse type to OrderSummary which
 * is needed for sfUI components
 */
export interface OrderSummary {
  /**
   * The first name of the customer.
   */
  firstName: string;
  /**
   * The last name of the customer.
   */
  lastName: string;
  /**
   * The email of the customer. Must be unique.
   */
  email: string;
  /**
   * Override value for subtotal including tax. If specified, the field `subtotal_ex_tax` is also required. (Float, Float-As-String, Integer)
   */
  subtotal: string;
  /**
   * Override value for the total, including tax. If specified, the field `total_ex_tax` is also required. (Float, Float-As-String, Integer)
   */
  total: string;
  /**
   * Shipping address of the customer
   */
  shipping: {
    /**
     * Street address (first line).
     */
    streetName: string;
    /**
     * City of the shipping address
     */
    city: string;
    /**
     * Zip Code of the shipping address
     */
    zipCode: string;
    /**
     * Country of the shipping address
     */
    country: string;
    /**
     * Recipient’s telephone number.
     */
    phoneNumber: string;
    /**
     * Shipping method object contains the value realated to shipping type
     */
    shippingMethod: {
      /**
       * Text code identifying the BigCommerce shipping module selected by the customer.
       */
      value: string;
    };
    /**
     * The value of shipping cost, including tax. (Float, Float-As-String, Integer)
     */
    cost: string;
  };
  payment: {
    /**
     * Street address (first line).
     */
    streetName: string;
    /**
     * City of the shipping address
     */
    city: string;
    /**
     * Zip Code of the shipping address
     */
    zipCode: string;
    /**
     * Country of the shipping address
     */
    country: string;
    /**
     * Recipient’s telephone number.
     */
    phoneNumber: string;
    /**
     * Value of order payment methods.
     */
    paymentMethod: OrderPaymentMethod;
    /**
     * Text code identifying the BigCommerce shipping module selected by the customer.
     */
    shippingMethod: string;
  };
  /**
   * Order products list
   */
  products: OrderItem[];
}

/**
 * Possible values of order status.
 */
export enum OrderStatus {
  /**
   * Open.
   */
  Open = 'Open',
  /**
   * Pending.
   */
  Pending = 'Pending',
  /**
   * Confirmed.
   */
  Confirmed = 'Confirmed',
  /**
   * Shipped.
   */
  Shipped = 'Shipped',
  /**
   * Complete.
   */
  Complete = 'Complete',
  /**
   * Cancelled.
   */
  Cancelled = 'Cancelled',
  /**
   * Refunded.
   */
  Refunded = 'Refunded'
}
