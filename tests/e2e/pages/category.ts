import { el } from './utils/element';

export const category = {
  get products(): Cypress.Chainable {
    cy.scrollTo(0, 0).wait(500);
    return el('.sf-product-card', 'a');
  }
};
