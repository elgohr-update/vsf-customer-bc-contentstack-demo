import { Context as NuxtContext } from '@nuxt/types';
import { markPropertiesAsNotImplemented, DeepPartial } from './utils';
const NOT_IMPLEMENTED = [
  '$pinia',
  '$icon',
  '$scrollTo',
  '$shared',
  '$cookies',
  'app',
  'error',
  'getRouteBaseName',
  'getRouteBaseName',
  'i18n',
  'localeLocation',
  'localePath',
  'localeRoute',
  'next',
  'pinia',
  'redirect',
  'route',
  'switchLocalePath',
  '_errored',
  '_redirected',
  'nuxtState',
  '$md'
];

export function createNuxtContextMock(): DeepPartial<NuxtContext> {
  const mock = {
    $config: {
      theme: {
        itemsPerPage: [10],
        userCartKey: 'Cart ID',
        channelIds: [921432],
        productsSortOptions: [
          {
            label: 'Latest',
            id: 1,
            value: {
              sort: 'id',
              direction: 'desc'
            }
          },
          {
            label: 'Oldest',
            id: 2,
            value: {
              sort: 'id'
            }
          },
          {
            label: 'Name: A to Z',
            id: 3,
            value: {
              sort: 'name'
            }
          },
          {
            label: 'Name: Z to A',
            id: 4,
            value: {
              sort: 'name',
              direction: 'desc'
            }
          },
          {
            label: 'Price from high to low',
            id: 5,
            value: {
              sort: 'price',
              direction: 'desc'
            }
          },
          {
            label: 'Price from low to high',
            id: 6,
            value: {
              sort: 'price'
            }
          }
        ],
        wishlist: {
          guest: {
            name: 'Guest wishlist'
          },
          name: 'My wishlist',
          isPublic: true
        }
      },
      middlewareUrl: 'http://localhost:8181/',
      storefronts: {
        default: {
          channelId: 1
        }
      },
      _app: {
        basePath: '/',
        assetsPath: '/_nuxt/',
        cdnURL: null
      }
    },
    $cookies: {
      parseJSON: true,
      nodeCookie: {}
    },
    $sharedRefsMap: new Map(),
    $vsf: {},
    base: '/',
    env: {},
    isDev: false,
    isHMR: false,
    isStatic: false,
    params: {},
    query: {},
    req: {
      headers: {}
    }
  };
  return markPropertiesAsNotImplemented<NuxtContext>(
    mock as any,
    NOT_IMPLEMENTED
  );
}
