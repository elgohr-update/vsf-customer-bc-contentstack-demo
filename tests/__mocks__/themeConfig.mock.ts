export const themeConfigMock = {
  itemsPerPage: [10],
  userCartKey: 'Cart ID',
  channelIds: [921432],
  bigcommerceCookieMaxAge: 60 * 60 * 24 * 7,
  home: {
    bannerA: {
      link: '/',
      image: {
        mobile: '/homepage/bannerB.webp',
        desktop: '/homepage/bannerF.webp'
      }
    },
    bannerB: {
      link: '/',
      image: '/homepage/bannerE.webp'
    },
    bannerC: {
      link: '/',
      image: '/homepage/bannerC.webp'
    },
    bannerD: {
      link: '/',
      image: '/homepage/bannerG.webp'
    }
  },
  productsSortOptions: [
    { label: 'Latest', id: 1, value: { sort: 'id', direction: 'desc' } },
    { label: 'Oldest', id: 2, value: { sort: 'id' } },
    { label: 'Name: A to Z', id: 3, value: { sort: 'name' } },
    {
      label: 'Name: Z to A',
      id: 4,
      value: { sort: 'name', direction: 'desc' }
    },
    {
      label: 'Price from high to low',
      id: 5,
      value: { sort: 'price', direction: 'desc' }
    },
    { label: 'Price from low to high', id: 6, value: { sort: 'price' } }
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
