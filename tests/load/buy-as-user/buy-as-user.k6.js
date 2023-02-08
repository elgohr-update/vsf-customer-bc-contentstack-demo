import { sleep, group, check} from 'k6';
import http from 'k6/http';

import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js';

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
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
  'accept-encoding': 'gzip, deflate, br',
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

  group('Visit Homepage', () => {
    const getHomepage = http.get(BASE_URL, { headers });
    sleep(3);
    check(getHomepage, {
      'Visit homepage': (res) => res.status === 200
    });

    const getCustomers = http.post(
      `${BASE_URL}api/bigcommerce/getCustomers`,
      '[{"include":"formfields"}]',
      { headers }
    );
    check(getCustomers, {
      'Get customers': (res) => res.status === 200
    });

    const createCart = http.post(
      `${BASE_URL}api/bigcommerce/createCart`,
      '[{"data":{"line_items":[],"channel_id":921432},"include":"redirect_urls,line_items.physical_items.options,line_items.digital_items.options"}]',
      { headers }
    );
    check(createCart, {
      'Create cart': (res) => res.status === 200
    });
    vars.cartId = jsonpath.query(createCart.json(), '$.data.id')[0];
    sleep(2);
  });
  group('Creating account', () => {
    vars.username = new Array(20)
      .fill(null)
      .map(() => String.fromCharCode(97 + Math.round(Math.random() * 25)))
      .join()
      .replace(/,/g, '');
    const createCustomer = http.post(
      `${BASE_URL}api/bigcommerce/createCustomer`,
      `[{"first_name":"Jon","last_name":"Doe","email":"${vars.username}@mail.com","password":"jondoe123231","accepts_product_review_abandoned_cart_emails":false,"channel_ids":[921432],"custom_fields":[]}]`,
      { headers }
    );
    check(createCustomer, {
      'createCustomer response received': (res) => res.status === 200
    });
    const loginCustomer = http.post(
      `${BASE_URL}api/bigcommerce/loginCustomer`,
      `[{"email":"${vars.username}@mail.com","password":"jondoe123231","channel_id":921432}]`,
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
  group('Visit Product Page', () => {
    const getProductPage = http.post(
      `${BASE_URL}api/bigcommerce/getProducts`,
      '[{"id":"81","include":"options,variants"}]',
      { headers }
    );
    check(getProductPage, {
      'Get product from product page': (res) => res.status === 200
    });

    const getProductReviews = http.post(
      `${BASE_URL}api/bigcommerce/getProductReviewCollection`,
      '[{"productId":81},{"status":1,"limit":5}]',
      { headers }
    );
    sleep(1);
    check(getProductReviews, {
      'Get product reviews': (res) => res.status === 200
    });

    const getCategoryTree = http.post(`${BASE_URL}api/bigcommerce/getCategoryTree`, '[]',
      { headers });
    check(getCategoryTree, {
      'Get category tree': (res) => res.status === 200
    });

    const getRecommenedProducts = http.post(
      `${BASE_URL}api/bigcommerce/getProducts`,
      '[{"id:in":[-1],"include":"options,variants","limit":8}]',
      { headers }
    );
    sleep(1);
    check(getRecommenedProducts, {
      'Get products recommendations': (res) => res.status === 200
    });
  });

  group('Add product to cart', () => {
    const addToCart = http.post(
      `${BASE_URL}api/bigcommerce/addCartItems`,
      `[{"cartId":"${vars.cartId}","include":"redirect_urls,line_items.physical_items.options,line_items.digital_items.options","data":{"line_items":[{"product_id":81,"quantity":1,"variant_id":65}]}}]`,
      { headers }
    );
    check(addToCart, {
      'Add product to cart': (res) => res.status === 200
    });
    sleep(7);

    const getCart = http.post(
      `${BASE_URL}api/bigcommerce/getCart`,
      `[{"id":"${vars.cartId}","include":"redirect_urls,line_items.physical_items.options,line_items.digital_items.options"}]`,
      { headers }
    );
    check(getCart, {
      'Get cart': (res) => res.status === 200
    });

    const getCategoryTree = http.post(`${BASE_URL}api/bigcommerce/getCategoryTree`, '[]',
      { headers });
    sleep(1);
    check(getCategoryTree, {
      'Get Get category tree': (res) => res.status === 200
    });

    const getCustomers = http.post(
      `${BASE_URL}api/bigcommerce/getCustomers`,
      '[{"include":"formfields"}]',
      { headers }
    );
    check(getCustomers, {
      'Get customers': (res) => res.status === 200
    });
  });

  group('Proceed with checkout', () => {
    const getCheckout = http.get(
      'https://checkout.demo.vuestorefront.io/embedded-checkout/allow-cookie?returnUrl=https%3A%2F%2Fdemo.vuestorefront.io%2Fcheckout%3Ft%3D1652101470700',
      { headers }
    );
    sleep(2);
    check(getCheckout, {
      'Go to Checkout': (res) => {
        return res.status === 200;
      }
    });

    const getCart = http.post(
      `${BASE_URL}api/bigcommerce/getCart`,
      `[{"id":"${vars.cartId}","include":"redirect_urls,line_items.physical_items.options,line_items.digital_items.options"}]`,
      { headers }
    );
    check(getCart, {
      'Get cart': (res) => res.status === 200
    });
  });

}
