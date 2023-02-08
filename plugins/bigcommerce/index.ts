import axios from "axios";
import { Plugin } from "@nuxt/types";
import {
  ContextDuringPluginsConstruction,
  VSFCoreI18nCookies,
  CreateProxiedApiParams,
} from "~/plugins/bigcommerce/types";
import { BigcommerceIntegrationContext, BigcommerceConfig } from "~/types";
import { getStorefrontConfig } from "./multiStorefront";
import { MetaInfo, VueMetaPlugin } from "vue-meta";

const getCookies = (context: ContextDuringPluginsConstruction) =>
  context?.req?.headers?.cookie ?? "";

const createIntegrationConfig = (
  context: ContextDuringPluginsConstruction
): BigcommerceConfig => {
  const baseURL = process.server
    ? context?.$config?.ssrMiddlewareUrl || context?.$config?.middlewareUrl
    : context?.$config?.middlewareUrl;
  const cookie = getCookies(context);
  const storefront = getStorefrontConfig(context);

  if (process.server && context?.$config?.middlewareUrl) {
    console.log("Applied middlewareUrl as ", context.$config.middlewareUrl);
  }

  return {
    axios: {
      baseURL,
      headers: {
        ...(cookie ? { cookie } : {}),
        "x-bigcommerce-channel-id": storefront.channelId,
      },
      withCredentials: true,
    },
    app: context.app,
  };
};

const parseCookies = (cookieString: string): Record<string, string> =>
  cookieString
    .split(";")
    .filter(String)
    .map((item) => item.split("=").map((part) => part.trim()))
    .reduce((obj, [name, value]) => ({ ...obj, [name]: value }), {});

const setCookieValues = (
  cookieValues: Record<string, string>,
  cookieString = ""
) => {
  const parsed = parseCookies(cookieString);

  return Object.entries({ ...parsed, ...cookieValues })
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
};

const createProxiedApi = ({
  givenApi,
  client,
  tag,
}: CreateProxiedApiParams): BigcommerceIntegrationContext["api"] => {
  return new Proxy<CreateProxiedApiParams["givenApi"]>(givenApi, {
    get: (target, accessedProperty, receiver) => {
      const functionName = String(accessedProperty);
      if (Reflect.has(target, functionName)) {
        return Reflect.get(target, accessedProperty, receiver);
      }

      return async (...args) =>
        client.post(`/${tag}/${functionName}`, args).then((r) => r.data);
    },
    // Proxy typings are done poorly in TS: https://github.com/microsoft/TypeScript/pull/44458
  }) as BigcommerceIntegrationContext["api"];
};

function buildBigcommercePlugin(nuxtCtx: ContextDuringPluginsConstruction) {
  const tag = "bigcommerce";
  const config = createIntegrationConfig(nuxtCtx);
  const client = axios.create(config.axios);

  const api = createProxiedApi({ givenApi: {}, client, tag });
  const NuxtI18NExtendedByCore = nuxtCtx.app.i18n as VSFCoreI18nCookies;
  if (NuxtI18NExtendedByCore.cookieValues) {
    client.defaults.headers.cookie = setCookieValues(
      NuxtI18NExtendedByCore.cookieValues,
      client.defaults.headers.cookie
    );
  }

  return { api, client, config };
}

const bigcommercePlugin: Plugin = (ctx: ContextDuringPluginsConstruction) => {
  const { beforeNuxtRender, app } = ctx;

  const vsfGeneratorMeta = {
    hid: "generator",
    name: "generator",
    content: "Vue Storefront 2",
  };

  if (process.server && beforeNuxtRender) {
    beforeNuxtRender(() => {
      const ssrCtx = ctx.ssrContext as unknown as { meta: VueMetaPlugin };

      if (Object.prototype.hasOwnProperty.call(ssrCtx, "meta") && ssrCtx.meta) {
        // vue-meta official approach on adding metatags on server side
        // Reference: https://vue-meta.nuxtjs.org/api/#meta-addapp
        const { set } = ssrCtx.meta.addApp("vsf-meta-generator");

        set({
          meta: [vsfGeneratorMeta],
        });
      }
    });
  }

  if (process.client) {
    const doesVsfMetaGeneratorTagExist = (_head: MetaInfo) =>
      _head.meta.find(
        (item) =>
          item.content === vsfGeneratorMeta.content && item.hid === "generator"
      );

    if (
      typeof app.head === "object" &&
      !doesVsfMetaGeneratorTagExist(app.head)
    ) {
      app.head = {
        ...app.head,
        meta: [vsfGeneratorMeta, ...(app.head.meta ?? [])],
      };
    }
  }

  if (ctx?.$vsf?.$bigcommerce) return;
  const plugin = buildBigcommercePlugin(ctx);
  ctx.$bigcommerce ||= plugin;
  if (!ctx?.$vsf) ctx.$vsf = {};
  if (!ctx.$vsf?.$bigcommerce) ctx.$vsf.$bigcommerce = plugin;
};

export default bigcommercePlugin;
