import { el } from '../utils/element';

class Header {
  get cart(): Cypress.Chainable {
    return cy.get('[aria-label="Toggle cart sidebar"]');
  }

  get categories(): Cypress.Chainable {
    return cy.get('[data-e2e*="app-header"], .sf-header-navigation-item__item');
  }

  get category() {
    return {
      women: () => el('app-header-url_women'),
      men: () => el('app-header-url_men')
    };
  }

  openCart(): Cypress.Chainable {
    const click = $el => $el.click();
    return this.cart.pipe(click).should(() => {
      expect(Cypress.$('.my-cart')).to.exist;
    });
  }
}

export default new Header();
