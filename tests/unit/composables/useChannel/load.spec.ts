import { expect } from '@jest/globals';
import { useChannel } from '~/composables/useChannel';
import { createTestingPinia } from '@pinia/testing';
import {
  createChannelMock,
  createChannelApiErrorMock,
  createSeoDetailsMock
} from '~/tests/__mocks__/channel.mock';
import { useChannelStore } from '~/stores/channel';
const api = {
  getChannel: jest.fn(),
  getStoreMeta: jest.fn()
};

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api
      }
    })
  };
});

describe('[bigcommerce-theme] useChannel load method', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    createTestingPinia();
  });

  it('saves channel details to channel store', async () => {
    // given
    const channelStore = useChannelStore();
    const CHANNEL_RESPONSE_FROM_API_CLIENT = {
      data: [createChannelMock()],
      meta: {}
    };
    const SEO_META_RESPONSE_FROM_API_CLIENT = {
      data: [createSeoDetailsMock()],
      meta: {}
    };
    api.getChannel.mockResolvedValue(CHANNEL_RESPONSE_FROM_API_CLIENT);
    api.getStoreMeta.mockResolvedValue(SEO_META_RESPONSE_FROM_API_CLIENT);

    // when
    const { load } = useChannel();
    await load();

    // then
    expect(channelStore.channel).toBe(CHANNEL_RESPONSE_FROM_API_CLIENT.data);
  });

  it('saves seo meta to channel store', async () => {
    // given
    const channelStore = useChannelStore();
    const CHANNEL_RESPONSE_FROM_API_CLIENT = {
      data: [createChannelMock()],
      meta: {}
    };
    const SEO_META_RESPONSE_FROM_API_CLIENT = {
      data: [createSeoDetailsMock()],
      meta: {}
    };
    api.getChannel.mockResolvedValue(CHANNEL_RESPONSE_FROM_API_CLIENT);
    api.getStoreMeta.mockResolvedValue(SEO_META_RESPONSE_FROM_API_CLIENT);

    // when
    const { load } = useChannel();
    await load();
    // then
    expect(channelStore.seoMeta).toBe(SEO_META_RESPONSE_FROM_API_CLIENT.data);
  });

  it('returns error about failure to pull products when getChannel returns api error', async () => {
    // given
    const API_CLIENT_ERROR = createChannelApiErrorMock();
    const USER_FRIENDLY_API_CLIENT_ERROR_MESSAGE = new Error(
      JSON.stringify(API_CLIENT_ERROR)
    );
    api.getChannel.mockResolvedValue(API_CLIENT_ERROR);

    // when
    const { load, error } = useChannel();
    await load();

    // then
    expect(error.value.load.message).toBe(
      USER_FRIENDLY_API_CLIENT_ERROR_MESSAGE.message
    );
  });
});
