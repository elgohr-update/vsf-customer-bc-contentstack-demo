import webpack from "webpack";
import theme from "./themeConfig";
import storefronts from "./storefronts.config";

// Client side middleware url
const middlewareUrl =
  process.env.NODE_ENV === "production"
    ? process.env.API_BASE_URL
    : "http://localhost:8181/";

// Server side middleware url
const ssrMiddlewareUrl =
  process.env.NODE_ENV === "production"
    ? process.env.API_SSR_BASE_URL
    : "http://localhost:8181/";

export default {
  components: ['~/components/cms/page/', '~/components/cms/layout/'],
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  publicRuntimeConfig: {
    theme,
    storefronts,
    middlewareUrl,
    ssrMiddlewareUrl,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Vue Storefront",
    titleTemplate: "%s | Vue Storefront Demo",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "crossorigin",
      },
    ],
  },
  loading: { color: "#fff" },
  serverMiddleware: [
    {
      path: "/healthz",
      handler: "~/serverMiddleware/healthCheck.js",
    },
  ],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    /**
     * Plugin is adding `$vsf` and `$bigcommerce` to the context.
     * Must be added before other plugins that are using this context.
     */
    "~/plugins/bigcommerce",
  ],
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    "@pinia/nuxt",
    "@nuxtjs/composition-api/module",
    "@nuxt/typescript-build",
    "@nuxtjs/pwa",
    "@nuxtjs/style-resources",
    '@vsf-enterprise/contentstack/nuxt',
    [
      "@vue-storefront/nuxt",
      {
        useRawSource: {
          dev: [
              "@vue-storefront/core",
              "@vsf-enterprise/contentstack"
        ],
          prod: [
            "@vue-storefront/core",
            "@vsf-enterprise/contentstack"
        ],
        },
      },
    ],
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "nuxt-i18n",
    "cookie-universal-nuxt",
    "vue-scrollto/nuxt",
    "portal-vue/nuxt",
    [
      "@vue-storefront/http-cache/nuxt",
      {
        matchRoute: {
          "/": "max-age=1800, s-maxage=86400, stale-while-revalidate=86400",
          "/p/*": "max-age=300, s-maxage=3600, stale-while-revalidate=86400",
          "/c/*": "max-age=300, s-maxage=3600, stale-while-revalidate=86400",
          "/my-account": "none",
          "/checkout*": "none",
        },
      },
    ],
  ],
  router: {
    extendRoutes(routes, resolve) {
      routes.push(
        {
          path: "/account.php",
          redirect: "/",
        },
        {
          path: "/login.php",
          redirect: "/",
        },
        {
          name: "home",
          path: "/",
          component: resolve(__dirname, "pages/Home.vue"),
        },
        {
          name: "product",
          path: "/p/:id/:slug/",
          component: resolve(__dirname, "pages/Product.vue"),
        },
        {
          name: "category",
          path: "/c/:slug_1/:slug_2?/:slug_3?/:slug_4?/:slug_5?",
          component: resolve(__dirname, "pages/Category.vue"),
        },
        {
          name: "my-account",
          path: "/my-account/:pageName?",
          component: resolve(__dirname, "pages/MyAccount.vue"),
        },
        {
          name: "checkout",
          path: "/checkout",
          component: resolve(__dirname, "pages/Checkout.vue"),
        }
      );
    },
  },
  i18n: {
    currency: "USD",
    country: "US",
    countries: [
      { name: "US", label: "United States", states: ["California", "Nevada"] },
      { name: "AT", label: "Austria" },
      { name: "DE", label: "Germany" },
      { name: "NL", label: "Netherlands" },
    ],
    currencies: [
      { name: "USD", label: "Dollar" },
      { name: "PLN", label: "Polish Zloty" },
      { name: "EUR", label: "Euro" },
    ],
    locales: [
      { code: "en", label: "English", file: "en.js", iso: "en" },
      { code: "de", label: "German", file: "de.js", iso: "de" },
    ],
    defaultLocale: "en",
    autoChangeCookie: {
      currency: false,
      locale: false,
      country: false,
    },
    lazy: true,
    seo: true,
    langDir: "lang/",
    vueI18n: {
      fallbackLocale: "en",
      numberFormats: {
        en: {
          currency: {
            style: "currency",
            currency: "USD",
            currencyDisplay: "symbol",
          },
        },
        de: {
          currency: {
            style: "currency",
            currency: "USD",
            currencyDisplay: "symbol",
          },
        },
      },
    },
    detectBrowserLanguage: false,
  },
  pwa: {
    manifest: {
      name: "Vue Storefront with BigCommerce",
      short_name: "VSF",
      description:
        "Demo of Vue Storefront, Lightning-Fast Frontend for Headless Commerce",
    },
    meta: {
      theme_color: "#5ECE7B",
      name: "Vue Storefront with BigCommerce",
    },
  },
  styleResources: {
    scss: [
      require.resolve("@storefront-ui/shared/styles/_helpers.scss", {
        paths: [process.cwd()],
      }),
    ],
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      config.resolve.alias["~"] = __dirname;
    },
    babel: {
      exclude: [/\bcore-js\b/, /\bwebpack\/buildin\b/],
    },
    transpile: ["vee-validate/dist/rules", "@glidejs/glide"],
    plugins: [
      new webpack.DefinePlugin({
        "process.VERSION": JSON.stringify({
          // eslint-disable-next-line global-require
          version: require("./package.json").version,
          lastCommit: process.env.LAST_COMMIT || "",
        }),
      }),
    ],
  },
};
