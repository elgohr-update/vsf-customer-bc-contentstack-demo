import { BIGCOMMERCE_USER_CART_KEY } from '~/composables/useUser/helpers';
import { User } from '@vsf-enterprise/bigcommerce-api';

export const mockUser = (): User => {
  return {
    id: 1,
    email: 'example@email.com',
    first_name: 'Foo',
    last_name: 'Bar',
    accepts_product_review_abandoned_cart_emails: true,
    address_count: 0,
    addresses: [],
    company: 'VSF',
    form_fields: [
      {
        name: BIGCOMMERCE_USER_CART_KEY,
        customer_id: 1,
        value: '123qwe123qwe123'
      }
    ],
    phone: '123456789'
  };
};
