import { AxiosInstance } from 'axios';
import { Context as NuxtContext, NuxtAppOptions } from '@nuxt/types';
import { BigcommerceIntegrationContext } from '~/types';

export type NuxtI18nInstance = NuxtAppOptions['i18n'];

/*
  I18n extended by Core's plugin:
  https://github.com/vuestorefront/vue-storefront/blob/main/packages/core/nuxt-module/plugins/i18n-cookies.js
*/
export interface VSFCoreI18nCookies extends NuxtI18nInstance {
  cookieValues: Record<string, string>;
}

export interface CreateProxiedApiParams {
  givenApi: Record<string, unknown>;
  client: AxiosInstance;
  tag: string;
}

export interface ContextDuringPluginsConstruction
  extends Omit<NuxtContext, '$bigcommerce' | '$vsf'> {
  $bigcommerce?: BigcommerceIntegrationContext;
  $vsf?: {
    $bigcommerce?: BigcommerceIntegrationContext;
  };
}
