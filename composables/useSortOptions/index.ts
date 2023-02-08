import { useContext, useRoute, computed } from '@nuxtjs/composition-api';
import { UseSortOptionsInterface, SortOption } from './types';

/**
 * Allows retreiving sort options and selected sort option based on the route.
 *
 * See the {@link UseSortOptionsInterface} for a list of methods and values available in this composable.
 */
export function useSortOptions(): UseSortOptionsInterface {
  const { $config } = useContext();
  const route = useRoute();

  const sortOptions = computed<SortOption[]>(() =>
    ($config.theme?.productsSortOptions ?? []).map((option: SortOption) => ({
      type: 'sort',
      id: option.id,
      value: option.label,
      metadata: option.value
    }))
  );

  const selected = computed(() => {
    const { query } = route.value;
    const sortParams = {
      sort: query.sort,
      direction: query.direction
    };

    const item = sortOptions.value.find(
      (option) =>
        option.metadata.sort === sortParams.sort &&
        option.metadata.direction === sortParams.direction
    );

    return item?.id?.toString() ?? '';
  });

  return { sortOptions, selected };
}
