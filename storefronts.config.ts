import { MultiStorefrontConfig } from "./types";

const DEFAULT_BIGCOMMERCE_CHANNEL = 1;

/**
 * Multi-storefront configuration.
 * Key of the configuration is the host of application.
 *
 * Example host: "my-vsf-app.io".
 *
 * Configuration contains:
 * - `name` - Name of the storefront. It's visible when it comes to listing available channels.
 * - `channelId` - Storefront's channel id.
 * - `protocol` - (optional) Protocol that should be used when it comes to redirecting to specific channel.
 */
const storefrontsConfig: MultiStorefrontConfig = {
  default: {
    name: "Default channel",
    channelId:
      Number(process.env.DEFAULT_CHANNEL_ID) || DEFAULT_BIGCOMMERCE_CHANNEL,
  },
  "store1.demo-bc.vuestorefront.io": {
    name: "Household items",
    channelId: 983771,
  },
  "store2.demo-bc.vuestorefront.io": {
    name: "Garden",
    channelId: 993626,
  },
};

export default storefrontsConfig;
