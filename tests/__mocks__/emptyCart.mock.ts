import { Cart } from '@vsf-enterprise/bigcommerce-api';

export const mockEmptyCart = (): Cart => ({
  id: 'd52c12ca-e548-4794-97ed-4374843074b5',
  customer_id: 0,
  channel_id: 1,
  email: '',
  currency: { code: 'PLN' },
  tax_included: false,
  base_amount: 0,
  discount_amount: 0,
  cart_amount: 0,
  coupons: [],
  line_items: {
    physical_items: [],
    digital_items: [],
    gift_certificates: [],
    custom_items: []
  },
  created_time: '2021-11-30T13:06:50+00:00',
  updated_time: '2021-12-01T09:59:33+00:00',
  locale: 'en'
});
