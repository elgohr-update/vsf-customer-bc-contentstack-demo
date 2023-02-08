import { useContext, computed } from '@nuxtjs/composition-api';
import { useChannelStore } from '~/stores/channel';
import { storeToRefs } from 'pinia';
import { useLogger } from '~/composables/useLogger';
import { ref, Ref } from '@nuxtjs/composition-api';
import { UseChannelInterface, UseChannelError } from './types';

/**
 * @public
 *
 * Allows loading current channel information.
 *
 * See the {@link UseChannelInterface} for a list of methods and values available in this composable.
 */
export function useChannel(): UseChannelInterface {
  const { $bigcommerce, $config } = useContext();
  const { Logger } = useLogger();
  const { channel, seoMeta } = storeToRefs(useChannelStore());
  const error: Ref<UseChannelError> = ref({ load: null });
  const loading = ref(false);

  const fetchChannelDetails = () => {
    return $bigcommerce.api.getChannel({
      include: 'currencies'
    });
  };

  const fetchSEOMeta = () => {
    return $bigcommerce.api.getStoreMeta();
  };

  const load = async (): Promise<void> => {
    try {
      error.value.load = null;

      const [channelResponse, seoMetaResponse] = await Promise.all([
        fetchChannelDetails(),
        fetchSEOMeta()
      ]);

      if ('errors' in channelResponse) {
        throw new Error(JSON.stringify(channelResponse));
      }

      channel.value = channelResponse.data;
      seoMeta.value = seoMetaResponse.data;
    } catch (err) {
      Logger.error('useChannel/loadChannelDetails', err);
      error.value.load = err;
    } finally {
      loading.value = false;
    }
  };

  const availableChannels = computed(() => {
    const defaultProtocol = 'https';
    const multiStorefrontConfigCopy = { ...$config.storefronts };
    delete multiStorefrontConfigCopy.default;

    return Object.entries(multiStorefrontConfigCopy).map(
      ([host, { name, channelId, protocol }]) => ({
        name: name,
        link: `${protocol || defaultProtocol}://${host}`,
        channelId: channelId
      })
    );
  });

  return {
    load,
    loading,
    error,
    availableChannels
  };
}
