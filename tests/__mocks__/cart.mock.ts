import { Cart } from '@vsf-enterprise/bigcommerce-api';

export const mockCart = (): Cart => ({
  id: 'd52c12ca-e548-4794-97ed-4374843074b5',
  customer_id: 0,
  channel_id: 1,
  email: '',
  currency: { code: 'PLN' },
  tax_included: false,
  base_amount: 309,
  discount_amount: 0,
  cart_amount: 309,
  coupons: [],
  line_items: {
    physical_items: [
      {
        id: '71c374d5-c4d4-429d-aa0d-446a7f45bb4e',
        parent_id: null,
        variant_id: 49,
        product_id: 93,
        sku: 'SLLPJ-CD28D4F0',
        name: '[Sample] 1 L Le Parfait Jar',
        url: 'https://vuestorefront.mybigcommerce.com/1-l-le-parfait-jar/',
        quantity: 1,
        taxable: true,
        image_url:
          'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/93/images/311/leparfaitmedium3.1633499290.220.290.jpg?c=1',
        discounts: [],
        coupons: [],
        discount_amount: 0,
        coupon_amount: 0,
        list_price: 7,
        sale_price: 7,
        extended_list_price: 7,
        extended_sale_price: 7,
        is_require_shipping: true,
        options: [
          { name: 'Color', nameId: 111, value: 'Orange', valueId: 13 },
          { name: 'Size', nameId: 112, value: 'Small', valueId: 95 }
        ]
      },
      {
        id: '71c374d5-c4d4-429d-aa0d-446a7f45be4b',
        parent_id: null,
        variant_id: 3,
        product_id: 77,
        sku: 'SLLPJ-CD28D4F0',
        name: '[Sample] 1 L Le Parfait Jar',
        url: 'https://vuestorefront.mybigcommerce.com/1-l-le-parfait-jar/',
        quantity: 1,
        taxable: true,
        image_url:
          'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/93/images/311/leparfaitmedium3.1633499290.220.290.jpg?c=1',
        discounts: [],
        coupons: [],
        discount_amount: 0,
        coupon_amount: 0,
        list_price: 7,
        sale_price: 7,
        extended_list_price: 7,
        extended_sale_price: 7,
        is_require_shipping: true,
        options: [
          { name: 'Size', nameId: 111, value: 'M', valueId: 70 },
          { name: 'Color', nameId: 112, value: 'Silver', valueId: 109 }
        ]
      }
    ],
    digital_items: [],
    gift_certificates: [],
    custom_items: []
  },
  created_time: '2021-11-30T13:06:50+00:00',
  updated_time: '2021-12-01T09:59:33+00:00',
  locale: 'en'
});
