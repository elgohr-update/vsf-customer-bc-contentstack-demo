// / <reference types="cypress-iframe" />
import 'cypress-iframe';
import page from '../pages/factory';
// import home from '../pages/home';

context('Order placement', () => {
  beforeEach(function eachTestSetup() {
    cy.fixture('test-data/e2e-place-order').then((fixture) => {
      this.fixtures = {
        data: fixture
      };
    });
  });

  it(['happypath', 'regression'], 'Should successfully place an order', function testOrder() {
    const data = this.fixtures.data;
    let grandTotal = 0;

    cy.intercept('POST', '/api/bigcommerce/createCart').as('createCart');
    cy.intercept('POST', '/api/public/v1/orders/payments', req => {
      grandTotal = req.body.order.totals.grand_total;
    });
    cy.intercept('POST', '/api/bigcommerce/getOrderByCart', req => {
      req.continue((res) => {
        expect(parseFloat(res.body.total_inc_tax)).eq(grandTotal / 100);
      });
    });

    page.home.visit();

    cy.wait('@createCart', { timeout: 10000 });

    page.home.header.categories.first().click();
    cy.wait(1000);
    page.category.products.first().click();
    page.product.addToCartButton.click();
    page.product.header.openCart();
    page.cart.goToCheckoutButton.click();

    page.checkout.customer.form.should('be.visible');
    page.checkout.customer.email.type(data.customer.email);
    page.checkout.customer.continueAsGuestButton.click();

    page.checkout.shipping.fillForm(data.customer);
    page.checkout.shipping.continueShippingButton.click();

    page.checkout.payment.cardNumber.type(data.customer.ccNumber);
    page.checkout.payment.cardExpiry.type(data.customer.ccExpiry);
    page.checkout.payment.cardCode.type(data.customer.ccCode);
    page.checkout.payment.cardName.type(data.customer.ccName);
    page.checkout.payment.checkoutPaymentButton.click();

    cy.get('.thank-you', { timeout: 20000 }).should('be.visible');
  });
});
