import { defineStore } from 'pinia';
import { UserShippingAddress } from '@vsf-enterprise/bigcommerce-api';

import { User } from '@vsf-enterprise/bigcommerce-api';

/**
 * State of `customerStore`.
 */
interface CustomerState {
  /**
   * Customer shipping addresses.
   */
  shipping: UserShippingAddress;

  /**
   * Current customer.
   */
  currentCustomer: User | null;
}

/**
 * Customer [Pinia](https://pinia.vuejs.org/) store.
 */
export const useCustomerStore = defineStore('customerStore', {
  state: (): CustomerState => ({
    shipping: [],
    currentCustomer: null
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.currentCustomer)
  }
});

/**
 * Customer [Pinia](https://pinia.vuejs.org/) store.
 */
export type CustomerStore = ReturnType<typeof useCustomerStore>;
