export default {
  itemsPerPage: [10, 20, 50],
  userCartKey: 'Cart ID',
  bigcommerceCookieMaxAge: 60 * 60 * 24 * 7,
  productsSortOptions: [
    { label: 'Featured', id: 1, value: { sort: 'FEATURED' } },
    { label: 'Relevance', id: 2, value: { sort: 'RELEVANCE' } },
    { label: 'Best selling', id: 3, value: { sort: 'BEST_SELLING' } },
    { label: 'Best reviewed', id: 4, value: { sort: 'BEST_REVIEWED' } },
    { label: 'Newest', id: 5, value: { sort: 'NEWEST' } },
    { label: 'Name: A to Z', id: 6, value: { sort: 'A_TO_Z' } },
    { label: 'Name: Z to A', id: 7, value: { sort: 'Z_TO_A' } },
    {
      label: 'Price from high to low',
      id: 8,
      value: { sort: 'HIGHEST_PRICE' }
    },
    { label: 'Price from low to high', id: 9, value: { sort: 'LOWEST_PRICE' } }
  ],
  wishlist: {
    guest: {
      name: 'Guest wishlist',
      key: 'bigcommerce-wishlist',
      customerId: 0,
      id: 0,
      token: ''
    },
    name: 'My wishlist',
    isPublic: true
  }
};
