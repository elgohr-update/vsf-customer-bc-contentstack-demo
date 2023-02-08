import { Wishlist } from '~/composables/useWishlist/types';
import { EMPTY_PRODUCT_RESPONSE } from '~/composables/useWishlist/helpers';

export const guestWishlistMock: Wishlist = {
  id: 0,
  customer_id: 0,
  token: '',
  name: 'Guest wishlist',
  items: [],
  wishlist_product_data: EMPTY_PRODUCT_RESPONSE,
  is_public: true
};
