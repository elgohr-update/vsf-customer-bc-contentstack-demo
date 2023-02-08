import { defineStore } from 'pinia';
import { Cart } from '@vsf-enterprise/bigcommerce-api';

const cart: Cart = {
  id: null,
  line_items: {
    physical_items: [],
    digital_items: [],
    gift_certificates: [],
    custom_items: []
  }
};

/**
 * State of `cartStore`
 */
interface CartState {
  /**
   * Current cart.
   */
  cart: Cart;
}

/**
 * Cart [Pinia](https://pinia.vuejs.org/) store.
 */
export const useCartStore = defineStore('cartStore', {
  state: (): CartState => ({
    cart
  }),
  getters: {
    getItems: (state) => {
      if (!state.cart) {
        return [];
      }

      return [
        ...state.cart.line_items.physical_items,
        ...state.cart.line_items.digital_items
      ];
    },
    getTotals: (state) => {
      return {
        total: state.cart?.base_amount ?? 0,
        subtotal: state.cart?.base_amount ?? 0,
        special: state.cart?.cart_amount ?? 0
      };
    },
    getTotalItems: (state) => {
      return state.cart
        ? state.cart.line_items.physical_items.reduce(
          (sum, item) => sum + item.quantity,
          0
        ) +
            state.cart.line_items.digital_items.reduce(
              (sum, item) => sum + item.quantity,
              0
            )
        : 0;
    }
  }
});

/**
 * Cart [Pinia](https://pinia.vuejs.org/) store.
 */
export type CartStore = ReturnType<typeof useCartStore>;
