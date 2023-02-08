import Base from './base';
import { el } from './utils/element';

class Product extends Base {
  get addToCartButton(): Cypress.Chainable {
    return el('.sf-add-to-cart__button');
  }
}

export default new Product();
