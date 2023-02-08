import { CreateCustomerParameters } from '@vsf-enterprise/bigcommerce-api';

export const mockCreateUserParams = (): CreateCustomerParameters => {
  return {
    accepts_product_review_abandoned_cart_emails: true,
    email: 'example@email.com',
    password: 'password',
    custom_fields: [],
    first_name: 'Foo',
    last_name: 'Bar'
  };
};
