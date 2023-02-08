import type { Ref, ComputedRef } from '@nuxtjs/composition-api';

/**
 * `useChannel` errors.
 */
export interface UseChannelError {
  /**
   * Errors occurred during `load` action.
   */
  load: Error;
}

/**
 * Computed config entry that includes also a `link`.
 */
export interface AvailableChannel {
  /**
   * Channel name.
   */
  name: string;
  /**
   * Link to the channel.
   */
  link: string;
  /**
   * Channel id.
   */
  channelId: number;
}

/**
 * Data and methods returned from the {@link useChannel|useChannel()} composable.
 */
export interface UseChannelInterface {
  /**
   * Indicates whether any of the methods is in progress
   */
  loading: Ref<boolean>;

  /**
   * Contains errors from the composable methods
   */
  error: Ref<UseChannelError>;

  /**
   * Loads current channel information.
   *
   * @remarks
   *
   * Channels and storefronts are the same thing in BigCommerce.
   * Fetches channel information from the API and stores it in `useChannelStore`.
   *
   * @example
   *
   * Loading `seoMeta` of current storefront.
   *
   * ```typescript
   * import { defineComponent, useAsync, useMeta } from '@nuxtjs/composition-api';
   * import { storeToRefs } from 'pinia';
   * import { useChannel } from '~/composables';
   * import { useChannelStore } from '~/stores';
   *
   * export default defineComponent({
   *   setup() {
   *     const { seoMeta } = storeToRefs(useChannelStore());
   *     const { load } = useChannel();
   *
   *     useAsync(async () => {
   *       await load();
   *     });
   *
   *     useMeta({
   *       title: seoMeta.value?.page_title,
   *       meta: [
   *         {
   *           hid: 'og:title',
   *           property: 'og:title',
   *           content: seoMeta.value?.page_title
   *         },
   *         {
   *           hid: 'description',
   *           name: 'description',
   *           content: seoMeta.value?.meta_description
   *         }
   *       ]
   *     });
   *   },
   *   head: {}
   * });
   * ```
   */
  load(): Promise<void>;

  /**
   * List of available channels.
   *
   * @remarks
   *
   * It includes all channels from `storefronts.config.ts` file, except default one.
   */
  availableChannels: ComputedRef<AvailableChannel[]>;
}
