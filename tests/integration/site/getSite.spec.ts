
import { expect } from '@jest/globals';
import { Express } from 'express';
import request from 'supertest';
import { setupServer, SetupServerApi } from 'msw/node';
import { rest } from 'msw';
import { integrations } from '../../../middleware.config';
import buildApp from '../../../middleware';

describe('Get Site /bigcommerce/getSite', () => {
  let app: Express;
  let server: SetupServerApi;

  beforeEach(() => {
    jest.clearAllMocks();

    const { storeHash } = integrations.bigcommerce.configuration.sdkSettings;

    server = setupServer(
      rest.get(`https://api.bigcommerce.com/stores/${storeHash}/v3/channels/1/site`, (request, response, context) => {
        return response(context.json({
          data: {
            urls: ['test-url']
          }
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

  it('should return the current site', async () => {
    const res = await request(app)
      .post('/bigcommerce/getSite')
      .send([{}]);

    expect(res.body.data.urls).toStrictEqual(['test-url']);
  });

  it('should use the cached site once the non-cached request is done', async () => {
    const { body: firstInstance } = await request(app)
      .post('/bigcommerce/getSite')
      .set({
        'Cache-Control': 'no-cache'
      })
      .send([{}]);

    const { body: secondInstance } = await request(app)
      .post('/bigcommerce/getSite')
      .send([{}]);

    expect(firstInstance.cached).toBeUndefined();
    expect(secondInstance.cached).toBeTruthy();
  });
});
