
import { expect } from '@jest/globals';
import { Express } from 'express';
import request from 'supertest';
import { mockQueryProducts, mockResultProducts } from '../../__mocks__/product.mock';
import { integrations } from '../../../middleware.config';
import buildApp from '../../../middleware';
import { SetupServerApi, setupServer } from 'msw/node';
import { rest } from 'msw';

const mockedQueryProducts = mockQueryProducts();
const mockedResultProducts = mockResultProducts();

describe('Get Products with Filter /bigcommerce/getProductsWithFilter', () => {
  let app: Express;
  let server: SetupServerApi;

  beforeEach(() => {
    jest.clearAllMocks();

    const { storeHash } = integrations.bigcommerce.configuration.sdkSettings;

    const bigcommerceApiUrl = `https://api.bigcommerce.com/stores/${storeHash}/v3`;
    const canonicalUrl = `https://store-${storeHash}.mybigcommerce.com`;

    server = setupServer(
      rest.get(`${bigcommerceApiUrl}/channels/1/site`, (request, response, context) => {
        return response(context.json({
          data: {
            urls: [{
              type: 'canonical',
              url: canonicalUrl
            }]
          }
        }));
      }),
      rest.post(`${bigcommerceApiUrl}/storefront/api-token-customer-impersonation`, (request, response, context) => {
        return response(context.json({
          data: {
            token: 'token'
          }
        }));
      }),
      rest.post(`${canonicalUrl}/graphql`, (request, response, context) => {
        return response(context.json({
          data: mockedQueryProducts
        }));
      })
    );

    server.listen({
      onUnhandledRequest: 'bypass'
    });
  });

  afterEach(() => {
    server.close();
  });

  beforeAll(async () => {
    app = await buildApp({ integrations });
  });

  it('should return product list', async () => {
    const res = await request(app)
      .post('/bigcommerce/getProductsWithFilter')
      .send([{
        filters: {
          categoryEntityId: 36
        }
      }]);

    expect(res.body).toMatchObject(mockedResultProducts);
  });
});
