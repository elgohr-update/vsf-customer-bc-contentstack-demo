import { mockedProduct } from './product.mock';

export const wishlistMock = {
  id: 0,
  customer_id: 0,
  is_public: true,
  name: 'Guest wishlist',
  token: '',
  items: [{ id: '77_1', product_id: 77, variant_id: 1 }],
  wishlist_product_data: { data: [mockedProduct], meta: {} }
};
