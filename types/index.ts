import { ContextualizedEndpoints } from '@vsf-enterprise/bigcommerce-api';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { NuxtAppOptions as BigcommerceNuxtAppOptions } from '@nuxt/types';
import { CookiesStatic } from 'js-cookie';
import { Channel } from '@vsf-enterprise/bigcommerce-api';
export interface IntegrationContext<CLIENT = any, CONFIG = any, API = any> {
  client: CLIENT;
  config: CONFIG;
  api: API;
  [x: string]: any;
}

/**
 * An entry of multi-storefront config.
 */
export interface MultiStorefrontConfigEntry {
  /**
   * Name of the channel.
   */
  name: Channel['name'];
  /**
   * Id of the channel.
   */
  channelId: Channel['id'];
  /**
   * Link to the channel.
   */
  protocol?: 'http' | 'https';
}

/**
 * Multi-storefront configuration.
 */
export type MultiStorefrontConfig = Record<string, MultiStorefrontConfigEntry>;

/**
 * Configuration for `$bigcommerce` plugin.
 */
export interface BigcommerceConfig {
  /**
   * Api Client.
   */
  axios: AxiosRequestConfig;

  /**
   * App Config.
   */
  app: BigcommerceNuxtAppOptions;
}

/**
 * Runtime integration context, which includes API client instance, settings, and endpoints that will be passed via middleware server.
 **/
export type BigcommerceIntegrationContext = IntegrationContext<
  AxiosInstance,
  BigcommerceConfig,
  ContextualizedEndpoints
>;

declare module 'http' {
  export interface IncomingHttpHeaders {
    'x-forwarded-host'?: string;
  }
}

declare module 'vue-i18n' {
  export interface IVueI18n {
    cookieValues: Record<string, string>;
  }
}

declare module '@nuxt/types' {
  export interface Context {
    $bigcommerce: BigcommerceIntegrationContext;
    $vsf: {
      $bigcommerce: BigcommerceIntegrationContext;
    };
    $cookies?: CookiesStatic;
  }

  export interface NuxtAppOptions {
    $cookies?: CookiesStatic;
  }
}

declare module '@nuxt/types/config/runtime' {
  interface NuxtRuntimeConfig {
    storefronts: MultiStorefrontConfig;
  }
}

export * from '../composables';
export * from '../stores';
