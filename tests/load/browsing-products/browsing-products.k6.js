import { sleep, check, group } from 'k6';
import http from 'k6/http';

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
 * CDN BASE_URL = 'https://demo-bigcommerce.europe-west1.gcp.vuestorefront.cloud/'
 * NON-CDN BASE_URL = 'https://demo-bigcommerce.europe-west1.gcp.vuestorefront.io/'
 */
const BASE_URL = __ENV.BASE_URL;

export default function main() {
  group('visit home page', () => {
    const res = http.get(
      BASE_URL
    );

    check(res, {
      'visit home successful': (res) => res.status === 200
    });

    sleep(1);
  });

  group('Navigate to PLP', () => {
    const getCategoryTreeRes = http.post(
      `${BASE_URL}api/bigcommerce/getCategoryTree`,
      '[]',
      headers
    );

    check(getCategoryTreeRes, {
      'getCategoryTree successful': (res) => res.status === 200
    });

    const getCategoryRes = http.post(
      `${BASE_URL}api/bigcommerce/getCategory`,
      '[{"categoryId":23}]',
      headers
    );

    check(getCategoryRes, {
      'getCategory successful': (res) => res.status === 200
    });

    const getProductsRes = http.post(
      `${BASE_URL}api/bigcommerce/getProducts`,
      '[{"page":1,"limit":20,"include":"options,variants","categories:in":23}]',
      headers
    );

    check(getProductsRes, {
      'getProducts successful': (res) => res.status === 200
    });

    sleep(1);
  });

  group('Sort by latest', () => {
    const getCategoryTreeRes = http.post(
      `${BASE_URL}api/bigcommerce/getCategoryTree`,
      '[]',
      headers
    );

    check(getCategoryTreeRes, {
      'getCategoryTree successful': (res) => res.status === 200
    });

    const getCategoryRes = http.post(
      `${BASE_URL}api/bigcommerce/getCategory`,
      '[{"categoryId":23}]',
      headers
    );

    check(getCategoryRes, {
      'getCategory successful': (res) => res.status === 200
    });

    const getProductsRes = http.post(
      `${BASE_URL}api/bigcommerce/getProducts`,
      '[{"sort":"id","direction":"desc","page":1,"limit":20,"include":"options,variants","categories:in":23}]',
      headers
    );

    check(getProductsRes, {
      'getProducts successful': (res) => res.status === 200
    });

    sleep(1);
  });

  group('Sort by price from low to high', () => {
    const getCategoryTreeRes = http.post(
      `${BASE_URL}api/bigcommerce/getCategoryTree`,
      '[]',
      headers
    );

    check(getCategoryTreeRes, {
      'getCategoryTree successful': (res) => res.status === 200
    });

    const getCategoryRes = http.post(
      `${BASE_URL}api/bigcommerce/getCategory`,
      '[{"categoryId":23}]',
      headers
    );

    check(getCategoryRes, {
      'getCategory successful': (res) => res.status === 200
    });

    const getProductsRes = http.post(
      `${BASE_URL}api/bigcommerce/getProducts`,
      '[{"sort":"price","page":1,"limit":20,"include":"options,variants","categories:in":23}]',
      headers
    );

    check(getProductsRes, {
      'getProducts successful': (res) => res.status === 200
    });

    sleep(1);
  });

  group('Navigate to PDP', () => {
    const getProductsRes = http.post(
      `${BASE_URL}api/bigcommerce/getProducts`,
      '[{"id":"77","include":"options,variants"}]',
      headers
    );

    check(getProductsRes, {
      'getProducts successful': (res) => res.status === 200
    });

    const getProductReviewCollectionRes = http.post(
      `${BASE_URL}api/bigcommerce/getProductReviewCollection`,
      '[{"productId":93},{"status":1,"limit":5}]',
      headers
    );

    check(getProductReviewCollectionRes, {
      'getProductReviewCollection successful': (res) => res.status === 200
    });

    const getCategoryTreeRes = http.post(
      `${BASE_URL}api/bigcommerce/getCategoryTree`,
      '[]',
      headers
    );

    check(getCategoryTreeRes, {
      'getCategoryTree successful': (res) => res.status === 200
    });

    const getRelatedProductsRes = http.post(
      `${BASE_URL}api/bigcommerce/getProducts`,
      '[{"id:in":[111,80,81,86],"include":"options,variants","limit":8}]',
      headers
    );

    check(getRelatedProductsRes, {
      'getRelatedProducts successful': (res) => res.status === 200
    });

    sleep(1);
  });
}
