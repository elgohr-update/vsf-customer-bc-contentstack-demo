import { sleep, check, group } from 'k6';
import http from 'k6/http';
import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js';
// See https://k6.io/docs/using-k6/options
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

    const getCustomers1 = http.post(
      `${BASE_URL}/api/bigcommerce/getCustomers`,
      '[{"include":"formfields"}]',
      headers
    );
    check(getCustomers1, {
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

  group('Search for product', () => {

    sleep(5);
    // Search
    const getProduct = http.post(
      `${BASE_URL}/api/bigcommerce/getProducts`,
      '[{"keyword:like:":"orbit","include":"options,variants"}]',
      { headers }
    );
    check(getProduct, {
      'Product search response received': (res) => res.status === 200
    });
  });

  group('Visit PDP of found product', () => {
    sleep(2);
    // PDP
    const pdpProduct = http.post(
      `${BASE_URL}/api/bigcommerce/getProducts`,
      '[{"id":"81","include":"options,variants"}]',
      { headers }
    );
    check(pdpProduct, {
      'PDP product received': (res) => res.status === 200
    });
    const getProductReviews = http.post(
      `${BASE_URL}/api/bigcommerce/getProductReviewCollection`,
      '[{"productId":81},{"status":1,"limit":5}]',
      { headers }
    );
    check(getProductReviews, {
      'Product reviews received': (res) => res.status === 200
    });
    const getCategoryTree = http.post(
      `${BASE_URL}/api/bigcommerce/getCategoryTree`,
      '[]',
      { headers }
    );
    check(getCategoryTree, {
      'Category tree received': (res) => res.status === 200
    });
    const getRelatedProducts = http.post(
      `${BASE_URL}/api/bigcommerce/getProducts`,
      '[{"id:in":[-1],"include":"options,variants","limit":8}]',
      { headers }
    );
    check(getRelatedProducts, {
      'Related products received': (res) => res.status === 200
    });
  });
  group('Add the product to cart', () => {
    sleep(1);

    const addToCart = http.post(
      `${BASE_URL}/api/bigcommerce/addCartItems`,
      `[{"cartId":"${vars.cartId}","include":"redirect_urls,line_items.physical_items.options,line_items.digital_items.options","data":{"line_items":[{"product_id":81,"quantity":1,"variant_id":65}]}}]`,
      { headers }
    );
    check(addToCart, {
      'Product successfully added to cart': (res) => res.status === 200
    });
  });
}
