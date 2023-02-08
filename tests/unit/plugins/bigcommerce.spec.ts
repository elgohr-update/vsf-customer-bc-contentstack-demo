import { Context as NuxtContext } from '@nuxt/types';
import bigcommercePlugin from '~/plugins/bigcommerce';
import { expect, jest } from '@jest/globals';
import { createNuxtContextMock } from '~/tests/__mocks__/context/nuxtContext.mock';
import * as axiosModule from 'axios';
jest.mock('axios');
function createContextMock() {
  const contextMock = createNuxtContextMock();
  const contextI18n = {
    cookieValues: {
      cookie1: 'cookieValue1',
      cookie2: 'cookieValue2'
    }
  };
  const appI18n = {
    cookieValues: {
      cookie1: 'cookieValue1',
      cookie2: 'cookieValue2'
    }
  };
  contextMock.app = {
    $config: contextMock.$config,
    i18n: appI18n
  } as object;
  contextMock.i18n = contextI18n;
  return contextMock;
}

let axiosPostFunction;
let mockedAxios;
const DEFAULT_AXIOS_COOKIES_MOCK = 'dummyCookie=dummyValue;';

describe('$bigcommerce NuxtJS plugin construction', () => {
  beforeEach(() => {
    process.server = true;
    jest.resetAllMocks();
    axiosPostFunction = jest
      .fn<
        ReturnType<axiosModule.AxiosInstance['post']>,
        Parameters<axiosModule.AxiosInstance['post']>
      >()
      .mockResolvedValue({ data: { results: [] } });
    mockedAxios = jest.mocked(axiosModule, true);
    mockedAxios.default.create.mockImplementation(() => {
      return {
        defaults: {
          headers: {
            cookie: DEFAULT_AXIOS_COOKIES_MOCK
          }
        },
        post: axiosPostFunction
      };
    });
  });
  afterEach(() => {
    delete process.server;
  });
  it('builds without errors', () => {
    const context = createContextMock() as any;
    expect(() => bigcommercePlugin(context, jest.fn())).not.toThrow();
  });
  describe('context injection', () => {
    it('populates vsf context with $bigcommerce property that has value conforming to integration schema', () => {
      const context = createContextMock() as any;
      bigcommercePlugin(context, jest.fn());
      expect(context.$bigcommerce).toBeTruthy();
    });
    it('populates nuxt context with $bigcommerce property that has value conforming to integration schema', () => {
      const context = createContextMock() as any;
      bigcommercePlugin(context, jest.fn());
      expect(context.$bigcommerce).toBeTruthy();
    });
  });
  describe('axios configuration', () => {
    it('configures axios in accordance to the passed config', () => {
      const context = createContextMock() as NuxtContext;
      const AXIOS_CONFIGURATION_BASED_ON_CONTEXT_MOCK = {
        baseURL: 'http://localhost:8181/',
        withCredentials: true,
        headers: {
          'x-bigcommerce-channel-id': 1
        }
      };
      bigcommercePlugin(context, jest.fn());

      expect(mockedAxios.default.create).toBeCalledWith(
        AXIOS_CONFIGURATION_BASED_ON_CONTEXT_MOCK
      );
    });
    it('sets axios cookies from i18n core cookies plugin and axio\'s default cookies', () => {
      const context = createContextMock() as NuxtContext;
      bigcommercePlugin(context, jest.fn());
      const axiosConfiguredCookies =
        context.$bigcommerce.client.defaults.headers.cookie;
      const MOCKED_COOKIES =
        'dummyCookie=dummyValue; cookie1=cookieValue1; cookie2=cookieValue2';
      expect(axiosConfiguredCookies).toEqual(MOCKED_COOKIES);
    });
    it('sets only axios default cookies when no cookies are provided by i18n cookie plugin', () => {
      const context = createContextMock() as NuxtContext;
      delete context.app.i18n.cookieValues;
      bigcommercePlugin(context, jest.fn());
      const axiosHeaders = context.$bigcommerce.client.defaults.headers.cookie;
      expect(axiosHeaders).toBe(DEFAULT_AXIOS_COOKIES_MOCK);
    });
  });
  describe('api behaviour', () => {
    it('allows for calls with api-client provided methods', () => {
      const context = createContextMock() as NuxtContext;
      bigcommercePlugin(context, jest.fn());

      expect(() => context.$bigcommerce.api.getProducts({})).not.toThrow();
    });
    it('returns data of http responses returned by axios', async () => {
      const AXIOS_HTTP_POST_RESPONSE = {
        data: {
          results: []
        }
      };
      axiosPostFunction.mockResolvedValue(AXIOS_HTTP_POST_RESPONSE);
      const context = createContextMock() as NuxtContext;
      bigcommercePlugin(context, jest.fn());
      const bigcommercePluginResponse =
        await context.$bigcommerce.api.getProducts({});
      expect(bigcommercePluginResponse).toEqual(AXIOS_HTTP_POST_RESPONSE.data);
    });
    it('calls endpoint following schema `/integrationName/method`', async () => {
      const PARAMETERS_USED_TO_CALL_API = {};
      const context = createContextMock() as NuxtContext;
      bigcommercePlugin(context, jest.fn());
      await context.$bigcommerce.api.getProducts(PARAMETERS_USED_TO_CALL_API);
      expect(axiosPostFunction).toHaveBeenCalledWith(
        '/bigcommerce/getProducts',
        [PARAMETERS_USED_TO_CALL_API]
      );
    });
    it('passes parameters to the axios post call', async () => {
      const PARAMETERS_USED_TO_CALL_API = {
        id: 10
      };
      const context = createContextMock() as NuxtContext;
      bigcommercePlugin(context, jest.fn());
      await context.$bigcommerce.api.getProducts(PARAMETERS_USED_TO_CALL_API);
      expect(axiosPostFunction).toHaveBeenCalledWith(
        '/bigcommerce/getProducts',
        [PARAMETERS_USED_TO_CALL_API]
      );
    });
  });
});
