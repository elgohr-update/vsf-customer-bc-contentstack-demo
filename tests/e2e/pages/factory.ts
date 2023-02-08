import { category } from './category';
import { customer, shipping, payment } from './checkout';
import { cart } from './components/cart-sidebar';
import Home from './home';
import Product from './product';

const page = {
  cart,
  category,
  get checkout() {
    cy.frameLoaded('#checkout iframe');

    return {
      customer,
      shipping,
      payment
    };
  },
  get home() {
    return Home;
  },
  get product() {
    return Product;
  }
};

export default page;
