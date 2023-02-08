import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { useChannelStore } from '~/stores/channel';
import { createChannelMock } from '~/tests/__mocks__/channel.mock';
describe('[bigcommerce-theme] useChannelStore', () => {

  beforeEach(() => {
    createTestingPinia();
  });

  it('should start with channel being set as null', () => {
    // when
    const channelStore = useChannelStore();

    // then
    expect(channelStore.channel).toBe(null);
  });

  it('should return default currency when asked for currency', () => {
    // given
    const categoryTreeStore = useChannelStore();
    const CHANNEL_MOCK = createChannelMock();
    // when
    categoryTreeStore.channel = CHANNEL_MOCK;
    const currency = categoryTreeStore.currency;
    // then
    expect(currency).toEqual(CHANNEL_MOCK.currencies.default_currency);
  });
});
