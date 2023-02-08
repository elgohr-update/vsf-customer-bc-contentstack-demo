// import { Customer } from '../types/customer';
// import { el } from './utils/element';

import { Customer as CustomerType } from '../types/customer';
import { getIframeField } from './utils/iframe';

// const checkoutIframeDocument = () => {
//   return cy.get('#checkout iframe').its('0.contentDocument').should('exist')
// }

// const checkoutIframeBody = () => {
//   return checkoutIframeDocument()
//   .its('body').should('not.be.undefined')
//   .then(cy.wrap)
// }

// class CustomerStep {
//   get form(): Cypress.Chainable {
//     return checkoutIframeBody().its('#checkout-customer-guest').should('exist').get('input#email')
//   }

//   get email(): Cypress.Chainable {
//     return this.form.find('input#email')
//   }

//   get continueButton(): Cypress.Chainable {
//     return this.form.find('[data-test="customer-continue-as-guest-button"]')
//   }
// }

// class Shipping {

//   get firstName(): Cypress.Chainable {
//     return el('shipping-firstName', 'input');
//   }

//   get lastName(): Cypress.Chainable {
//     return el('shipping-lastName');
//   }

//   get streetName(): Cypress.Chainable {
//     return el('shipping-streetName');
//   }

//   get apartment(): Cypress.Chainable {
//     return el('shipping-apartment');
//   }

//   get city(): Cypress.Chainable {
//     return el('shipping-city');
//   }

//   get state(): Cypress.Chainable {
//     return el('shipping-state', 'input');
//   }

//   get country(): Cypress.Chainable {
//     return el('shipping-country', 'select');
//   }

//   get zipcode(): Cypress.Chainable {
//     return el('shipping-zipcode');
//   }

//   get phone(): Cypress.Chainable {
//     return el('shipping-phone');
//   }

//   get continueToBillingButton(): Cypress.Chainable {
//     return el('continue-to-billing');
//   }

//   get heading(): Cypress.Chainable {
//     return cy.get('#checkout');
//   }

//   get selectShippingButton(): Cypress.Chainable {
//     return el('select-shipping');
//   }

//   get shippingMethods(): Cypress.Chainable {
//     return el('shipping-method', 'label');
//   }

//   public fillForm(customer: Customer) {
//     this.firstName.type(customer.firstName);
//     this.lastName.type(customer.lastName);
//     this.streetName.type(customer.address.shipping.streetName);
//     this.apartment.type(customer.address.shipping.apartment);
//     this.city.type(customer.address.shipping.city);
//     this.country.select(customer.address.shipping.country);
//     this.state.type(customer.address.shipping.state);
//     this.zipcode.type(customer.address.shipping.zipcode);
//     this.phone.type(customer.address.shipping.phone);
//   }
// }

// class Billing {
//   get firstName(): Cypress.Chainable {
//     return el('billing-firstName');
//   }

//   get lastName(): Cypress.Chainable {
//     return el('billing-lastName');
//   }

//   get streetName(): Cypress.Chainable {
//     return el('billing-streetName');
//   }

//   get apartment(): Cypress.Chainable {
//     return el('billing-apartment');
//   }

//   get city(): Cypress.Chainable {
//     return el('billing-city');
//   }

//   get state(): Cypress.Chainable {
//     return el('billing-state', 'input');
//   }

//   get country(): Cypress.Chainable {
//     return el('billing-country', 'select');
//   }

//   get zipcode(): Cypress.Chainable {
//     return el('billing-zipcode');
//   }

//   get phone(): Cypress.Chainable {
//     return el('billing-phone');
//   }

//   get continueToPaymentButton(): Cypress.Chainable {
//     return el('continue-to-payment');
//   }

//   get heading(): Cypress.Chainable {
//     return el('billing-heading');
//   }

//   public fillForm(customer: Customer) {
//     this.firstName.type(customer.firstName);
//     this.lastName.type(customer.lastName);
//     this.streetName.type(customer.address.billing.streetName);
//     this.apartment.type(customer.address.billing.apartment);
//     this.city.type(customer.address.billing.city);
//     this.country.select(customer.address.billing.country);
//     this.state.type(customer.address.billing.state);
//     this.zipcode.type(customer.address.billing.zipcode);
//     this.phone.type(customer.address.billing.phone);
//   }

// }

// class Payment {
//   get makeAnOrderButton(): Cypress.Chainable {
//     return el('make-an-order');
//   }

//   get paymentMethods(): Cypress.Chainable {
//     return el('payment-method');
//   }

//   get terms(): Cypress.Chainable {
//     return el('terms', 'label');
//   }
// }

// class ThankYou {
//   get heading(): Cypress.Chainable {
//     return el('thank-you-banner', 'h2');
//   }
// }

export const customer = {
  get form() {
    return cy.iframe().find('[data-test="checkout-customer-guest"]');
  },
  get email() {
    return cy.iframe().find('input#email');
  },
  get continueAsGuestButton() {
    return cy.iframe().find('[data-test="customer-continue-as-guest-button"]');
  }
};

export const shipping = {
  get form(): Cypress.Chainable {
    return cy.iframe().find('.checkout-step--shipping form');
  },
  get firstName() {
    return shipping.form.find('[data-test="firstNameInput-text"]');
  },
  get lastName() {
    return shipping.form.find('[data-test="lastNameInput-text"]');
  },
  get address() {
    return shipping.form.find('[data-test="addressLine1Input-text"]');
  },
  get city() {
    return shipping.form.find('[data-test="cityInput-text"]');
  },
  get country() {
    return shipping.form.find('[data-test="countryCodeInput-select"]');
  },
  get postalCode() {
    return shipping.form.find('[data-test="postCodeInput-text"]');
  },
  fillForm(customer: CustomerType) {
    shipping.firstName.type(customer.firstName);
    shipping.lastName.type(customer.lastName);

    const address = `${customer.address.shipping.streetName} ${customer.address.shipping.apartment}`;

    shipping.address.type(address);
    shipping.city.type(customer.address.shipping.city);
    shipping.country.select(1);
    shipping.postalCode.type(customer.address.shipping.zipcode);
  },
  get continueShippingButton() {
    return shipping.form.find('#checkout-shipping-continue', { timeout: 10000 }).should('exist').should('not.be.disabled');
  }
};

export const payment = {
  get cardNumber() {
    return getIframeField('[id$="ccNumber"] iframe').find('input#card-number');
  },
  get cardExpiry(): Cypress.Chainable {
    return getIframeField('[id*="ccExpiry"] iframe').find('input#card-expiry');
  },
  get cardName(): Cypress.Chainable {
    return getIframeField('[id*="ccName"] iframe').find('input#card-name');
  },
  get cardCode(): Cypress.Chainable {
    return getIframeField('[id*="ccCvv"] iframe').find('input#card-code');
  },
  get checkoutPaymentButton() {
    return cy.iframe().find('#checkout-payment-continue', { timeout: 10000 }).should('exist').should('not.be.disabled');
  }
};

// export {
//   Shipping,
//   Billing,
//   Payment,
//   ThankYou,
//   CustomerStep
// };
