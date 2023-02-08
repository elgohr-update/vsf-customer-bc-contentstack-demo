/* eslint-disable no-undef */

import { sleep, check, group } from 'k6';
import http from 'k6/http';

import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js';

// See https://k6.io/docs/using-k6/options
export const options = {
  noVUConnectionReuse: true,
  vus: 1,
  duration: '30s',
  ext: {
    loadimpact: {
      distribution: {
        'amazon:de:frankfurt': {
          loadZone: 'amazon:de:frankfurt',
          percent: 100
        }
      }
    }
  }
};

const headers = {
  accept: 'application/json, text/plain, */*',
  'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
  'content-type': 'application/json;charset=UTF-8',
  'sec-ch-ua':
    '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin'
};

/**
 * This load test uses two (2) important env variable
 *  1. BASE_URL = https://api.bigcommerce.com/stores/{store_hash}/v3/
 *  2. ACCESS_TOKEN = (31 chars random string)
 *
 * You may run the k6 via the ff command below
 *
 * $ k6 run -e BASE_URL=https://api.bigcommerce.com/stores/{store_hash}/v3/\
 * -e ACCESS_TOKEN=(31 chars random string) (path to bigcommerce load test)/bigcommerce-apis.k6.js
 *
 * or
 *
 * $ BASE_URL=https://api.bigcommerce.com/stores/{store_hash}/v3/ \
 * ACCESS_TOKEN=(31 chars random string) \
 * k6 run (path to bigcommerce load test)/bigcommerce-apis.k6.js
 *
 * Warning:
 * By default, passing system environment variables doesn't work for k6 archive, k6 cloud,
 * and k6 inspect. This is a security measure to avoid the risk of uploading sensitive data
 * to k6 Cloud. To override this mode, specify --include-system-env-vars.
 */
const BASE_URL = __ENV.BASE_URL;

export default function main() {
  headers['X-Auth-Token'] = __ENV.ACCESS_TOKEN;

  const vars = {};

  group('Get A Category Tree', () => {
    const getCategoryTree = http.get(
      `${BASE_URL}catalog/trees/1/categories`,
      { headers }
    );

    check(getCategoryTree, {
      'getCategoryTree successful': (res) => res.status === 200
    });

    vars.categories = jsonpath.query(getCategoryTree.json(), '$.data[0].children')[0];

    sleep(1);
  });

  group('Get A Category', () => {
    const getCategory = http.get(
      `${BASE_URL}catalog/categories/${vars.categories[0].id}`,
      { headers }
    );

    check(getCategory, {
      'getCategory successful': (res) => res.status === 200
    });

    sleep(1);
  });

  group('Get Products', () => {
    const getProducts = http.get(
      `${BASE_URL}catalog/products`,
      { headers }
    );

    check(getProducts, {
      'getProducts successful': (res) => res.status === 200
    });

    vars.products = jsonpath.query(getProducts.json(), '$.data[0]');

    sleep(1);
  });

  group('Get Product Reviews', () => {
    const getProductReview = http.get(
      `${BASE_URL}catalog/products/${vars.products[0].id}/reviews`,
      { headers }
    );

    check(getProductReview, {
      'getProductReview successful': (res) => res.status === 200
    });

    sleep(1);
  });

  group('Create Cart', () => {
    const createCart = http.post(
      `${BASE_URL}carts?include=redirect_urls,line_items.physical_items.options,line_items.digital_items.options`,
      '{"line_items":[],"channel_id":1}',
      { headers }
    );

    check(createCart, {
      'Create cart': (res) => res.status === 201
    });

    vars.cartId = jsonpath.query(createCart.json(), '$.data.id')[0];

    sleep(2);
  });

  group('Add Product to Cart', () => {
    const addToCart = http.post(
      `${BASE_URL}carts/${vars.cartId}/items?include=redirect_urls,line_items.physical_items.options,line_items.digital_items.options`,
      '{"line_items":[{"product_id":81,"quantity":1,"variant_id":65}]}',
      { headers }
    );

    check(addToCart, {
      'Add product to cart': (res) => res.status === 201
    });
    sleep(2);

    const getCart = http.get(
      `${BASE_URL}carts/${vars.cartId}?include=redirect_urls,line_items.physical_items.options,line_items.digital_items.options`,
      { headers }
    );
    check(getCart, {
      'Get cart': (res) => res.status === 200
    });
  });
}
