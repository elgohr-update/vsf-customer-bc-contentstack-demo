export const cart = {
  get goToCheckoutButton(): Cypress.Chainable {
    return cy.get('[href^="/checkout?t="]');
  }
};
