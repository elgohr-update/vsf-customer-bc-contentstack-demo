import { expect } from '@jest/globals';
import { useChannel } from '~/composables/useChannel';
import { createTestingPinia } from '@pinia/testing';

const api = {
  getChannel: jest.fn(),
  getStoreMeta: jest.fn()
};

const DEFAULT_STOREFRONT_CONFIG = {
  name: 'Default storefront',
  channelId: 1,
  protocol: 'http'
};

const SECOND_CHANNEL_URL = 'second-storefront.io';

const SECOND_STOREFRONT_CONFIG = {
  name: 'Second storefornt',
  channelId: 2,
  protocol: 'http'
};

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api
      },
      $config: {
        storefronts: {
          default: DEFAULT_STOREFRONT_CONFIG,
          'second-storefront.io': SECOND_STOREFRONT_CONFIG
        }
      }
    })
  };
});

describe('[bigcommerce-theme] useChannel availableChannels computed property', () => {
  createTestingPinia();

  it('should not include default config entry', () => {
    const { availableChannels } = useChannel();

    const IS_DEFAULT_CHANNEL_IN_AVAILABLE_CHANNELS =
      availableChannels.value.some((channel) => channel.channelId === 1);

    expect(IS_DEFAULT_CHANNEL_IN_AVAILABLE_CHANNELS).toBe(false);
  });

  it('should return list of objects with url and channel id', () => {
    const AVAILABLE_CHANNELS_LIST = [
      {
        channelId: SECOND_STOREFRONT_CONFIG.channelId,
        link: `${SECOND_STOREFRONT_CONFIG.protocol}://${SECOND_CHANNEL_URL}`,
        name: SECOND_STOREFRONT_CONFIG.name
      }
    ];

    const { availableChannels } = useChannel();

    expect(availableChannels.value).toStrictEqual(AVAILABLE_CHANNELS_LIST);
  });
});
