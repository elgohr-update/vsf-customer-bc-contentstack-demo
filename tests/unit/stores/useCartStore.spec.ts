import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { mockCart } from '~/tests/__mocks__/cart.mock';
import { useCartStore } from '~/stores/cart';

describe('[bigcommerce-theme] useCartStore', () => {
  createTestingPinia();

  const mockedCart = mockCart();

  const cartStore = useCartStore();
  const mockedCartItem = mockedCart.line_items.physical_items[0];
  const mockedCartItem2 = mockedCart.line_items.physical_items[1];

  cartStore.cart = mockedCart;

  it('getItems should return the union of the physical and digital items', async () => {
    expect(cartStore.getItems).toEqual([mockedCartItem, mockedCartItem2]);
  });

  it('getItems should return empty array when cart is not defined', async () => {
    cartStore.cart = undefined;
    expect(cartStore.getItems).toEqual([]);
  });

  it('getTotals should return the total price of cart', async () => {
    cartStore.cart = mockedCart;
    expect(cartStore.getTotals).toEqual({
      total: mockedCart.base_amount,
      subtotal: mockedCart.base_amount,
      special: mockedCart.cart_amount
    });
  });

  it('getTotals should return object with 0 values when cart is not defined', async () => {
    cartStore.cart = undefined;
    expect(cartStore.getTotals).toEqual({
      total: 0,
      subtotal: 0,
      special: 0
    });
  });

  it('getTotalItems should return the number of items in the cart', async () => {
    cartStore.cart = mockedCart;
    expect(cartStore.getTotalItems).toEqual(2);
  });

  it('getTotalItems should return 0 when cart is not defined', async () => {
    cartStore.cart = undefined;
    expect(cartStore.getTotalItems).toEqual(0);
  });
});
