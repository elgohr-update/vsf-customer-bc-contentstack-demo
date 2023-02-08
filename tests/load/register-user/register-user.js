// Creator: k6 Browser Recorder 0.6.2

import { sleep, group, check } from 'k6';
import http from 'k6/http';

import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js';

export const options = {
  noVUConnectionReuse: true,
  vus: 1,
  duration: '10s',
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
  'content-type': 'application/json; charset=UTF-8',
  'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"'
};

/**
 * CDN BASE_URL = 'https://demo-bigcommerce.europe-west1.gcp.vuestorefront.cloud/'
 * NON-CDN BASE_URL = 'https://demo-bigcommerce.europe-west1.gcp.vuestorefront.io/'
 */
const BASE_URL = __ENV.BASE_URL;

export default function main() {
  const vars = {};
  group('Visit homepage', () => {
    const getHomepage = http.get(BASE_URL, { headers });
    sleep(1);
    check(getHomepage, {
      'Home HTML document received': (res) => res.status === 200
    });

    const getCustomers = http.post(
      `${BASE_URL}/api/bigcommerce/getCustomers`,
      '[{"include":"formfields"}]',
      headers
    );
    check(getCustomers, {
      'GetCustomers response received': (res) => res.status === 200
    });

    const createCart = http.post(
      `${BASE_URL}/api/bigcommerce/createCart`,
      '[{"data":{"line_items":[],"channel_id":921432},"include":"redirect_urls,line_items.physical_items.options,line_items.digital_items.options"}]',
      { headers }
    );
    check(createCart, {
      'Cart successfuly created': (res) => res.status === 200
    });
    vars.cartId = jsonpath.query(createCart.json(), '$.data.id')[0];
  });
  group('Creating account', () => {
    const randomString = new Array(20)
      .fill(null)
      .map(() => String.fromCharCode(97 + Math.round(Math.random() * 25)))
      .join()
      .replace(/,/g, '');
    const createCustomer = http.post(
      `${BASE_URL}api/bigcommerce/createCustomer`,
      `[{"first_name":"Jon","last_name":"Doe","email":"${randomString}@mail.com","password":"jondoe123231","accepts_product_review_abandoned_cart_emails":false,"channel_ids":[921432],"custom_fields":[]}]`,
      { headers }
    );
    check(createCustomer, {
      'createCustomer response received': (res) => res.status === 200
    });
    const loginCustomer = http.post(
      `${BASE_URL}api/bigcommerce/loginCustomer`,
      '[{"email":"jon231@mail.com","password":"jondoe123231","channel_id":921432}]',
      { headers }
    );
    sleep(3);
    check(loginCustomer, {
      'loginCustomer response received': (res) => res.status === 200
    });
    const getCustomer = http.post(
      `${BASE_URL}api/bigcommerce/getCustomers`,
      '[{"include":"formfields"}]',
      { headers }
    );
    check(getCustomer, {
      'getCustomer response received': (res) => res.status === 200
    });
    const updateCustomerFormFields = http.post(
      `${BASE_URL}api/bigcommerce/updateCustomerFormFields`,
      `[{"data":[{"name":"Cart ID","value":"${vars.cartId}"}]}]`,
      { headers }
    );
    check(updateCustomerFormFields, {
      'updateCustomerFormFields response received': (res) => res.status === 200
    });
    const updateCart = http.post(
      `${BASE_URL}api/bigcommerce/updateCart`,
      `[{"id":"${vars.cartId}","include":"redirect_urls,line_items.physical_items.options,line_items.digital_items.options"}]`,
      { headers }
    );
    sleep(1);

    check(updateCart, {
      'updateCard response received': (res) => res.status === 200
    });
    const getAllWishlists = http.post(
      `${BASE_URL}api/bigcommerce/getAllWishlists`,
      '[]',
      { headers }
    );
    check(getAllWishlists, {
      'getAllWishlists response received': (res) => res.status === 200
    });
    const getOrders = http.post(
      `${BASE_URL}api/bigcommerce/getOrders`,
      '[{}]',
      { headers }
    );
    check(getOrders, {
      'getOrders response received': (res) => res.status === 200
    });
    const getCustomerAddress = http.post(
      `${BASE_URL}api/bigcommerce/getCustomerAddress`,
      '[{"include":"formfields"}]',
      { headers }
    );
    check(getCustomerAddress, {
      'getCustomerAddress response received': (res) => res.status === 200
    });
    const createWishlist = http.post(
      `${BASE_URL}api/bigcommerce/createWishlist`,
      '[{"name":"My wishlist","is_public":true,"items":[]}]',
      { headers }
    );
    check(createWishlist, {
      'createWishlist response received': (res) => res.status === 200
    });
  }
  );
}
