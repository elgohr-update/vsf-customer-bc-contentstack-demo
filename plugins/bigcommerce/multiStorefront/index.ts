import { IncomingMessage } from 'connect';
import { ContextDuringPluginsConstruction } from '~/plugins/bigcommerce/types';
import { MultiStorefrontConfigEntry } from '~/types';

/**
 * Gets host from the request.
 * @param {IncomingMessage} req - request.
 * @returns {string} request's host
 */
const getHost = (req: IncomingMessage): string => {
  if (process.server) {
    return req.headers['x-forwarded-host'] || req.headers.host;
  }

  return window.location.host;
};

/**
 * Plugin to set up storefront configuration based on initial request.
 * Plugin tries to get config by request's path.
 * In case of failure, it tries to get config by request's host.
 * In case of failre, it gets default configuration.
 */
export const getStorefrontConfig = (
  ctx: ContextDuringPluginsConstruction
): MultiStorefrontConfigEntry => {
  const storefrontsConfig = ctx.$config.storefronts;

  const host = getHost(ctx.req);

  if (host in storefrontsConfig) {
    return storefrontsConfig[host];
  }

  console.warn(
    'There is no configuration for current path or host. Default storefront configuration is used.'
  );

  return storefrontsConfig.default;
};
