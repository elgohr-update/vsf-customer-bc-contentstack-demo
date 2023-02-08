import { defineStore } from 'pinia';
import { Channel } from '@vsf-enterprise/bigcommerce-api';
import { StoreMeta } from '@vsf-enterprise/bigcommerce-api';

/**
 * State of `useChannelStore`.
 */
interface ChannelState {
  /**
   * Current channel.
   */
  channel: Channel | null;
  /**
   * SEO meta data.
   */
  seoMeta: StoreMeta | null;
}

/**
 * Channel [Pinia](https://pinia.vuejs.org/) store.
 *
 * @remarks
 *
 * Supporting multiple currencies are planned after finishing initial multi-storefront feature scope.
 */
export const useChannelStore = defineStore('channelStore', {
  state: (): ChannelState => ({
    channel: null,
    seoMeta: null
  }),
  getters: {
    currency: (state) => state.channel?.currencies?.default_currency
  }
});

/**
 * Channel [Pinia](https://pinia.vuejs.org/) store.
 *
 * @remarks
 *
 * Supporting multiple currencies are planned after finishing initial multi-storefront feature scope.
 */
export type ChannelStore = ReturnType<typeof useChannelStore>;
