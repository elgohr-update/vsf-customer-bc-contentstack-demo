require("dotenv").config();

module.exports = {
  integrations: {
    bigcommerce: {
      location: "@vsf-enterprise/bigcommerce-api/server",
      configuration: {
        sdkSettings: {
          logLevel: "info",
          clientId: process.env.BIGCOMMERCE_API_CLIENT_ID,
          secret: process.env.BIGCOMMERCE_API_CLIENT_SECRET,
          callback: process.env.BIGCOMMERCE_API_URL,
          storeHash: process.env.BIGCOMMERCE_STORE_ID,
          accessToken: process.env.BIGCOMMERCE_API_ACCESS_TOKEN,
          guestToken: process.env.BIGCOMMERCE_STORE_GUEST_TOKEN,
          responseType: "json",
          headers: { "Accept-Encoding": "*" },
          graphqlMaxRetry: Number(process.env.GRAPHQL_MAX_RETRY),
        },
        jwtTokenExpirationDays: 2,
        stdTTL: 86400,
        cookie_options: {
          "customer-data": {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
          },
        },
        // @deprecated - use cookie_options instead.
        secureCookies: process.env.NODE_ENV === "production",
      },
    },
    cnts: {
      location: '@vsf-enterprise/contentstack/server',
      configuration: {
        key: 'blt3091cc6736f3ea7c',
        token: 'cse12957be26820aac56a2ec8a',
        env: 'development',
        live_preview: { // optionally you can add config for live preview
          management_token: 'csa2645247422d5d1822165cbb',
          enable: true,
          host: 'api.contentstack.io',
        },
        fetchOptions: {
          timeout: 30000,
          retryLimit: 5,
          retryDelay: 300,
          retryCondition: (error) => boolean,
        }
      },
  },
},
};
