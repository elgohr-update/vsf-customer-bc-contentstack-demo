import dayjs from 'dayjs';
import {
  computed,
  useContext,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api';
import { nonFilters, reduceFilters } from './helpers';
import { UseUiHelpersInterface, QueryItem } from './types';

/**
 * Allows handling the parameters for filtering, searching, sorting and pagination in the URL search/query params.
 *
 * See the {@link UseUiHelpersInterface} for more information.
 */
export function useUiHelpers(): UseUiHelpersInterface {
  const { $config } = useContext();
  const route = useRoute();
  const router = useRouter();

  const categorySlug = computed(() => {
    return `/${route.value.path.split('/c/').pop()}${
      /\/$/.test(route.value.path) ? '' : '/'
    }`;
  });

  const getFiltersDataFromUrl = (onlyFilters) => {
    const { query } = route.value;

    return Object.keys(query)
      .filter((f) =>
        onlyFilters ? !nonFilters.includes(f) : nonFilters.includes(f)
      )
      .reduce(reduceFilters(query), {});
  };

  const getFacetsFromURL = () => {
    const { query } = route.value;

    return {
      page: parseInt(query.page as string, 10) || 1,
      sort: query.sort,
      direction: query.direction,
      filters: getFiltersDataFromUrl(true),
      itemsPerPage:
        parseInt(query.itemsperpage as string, 10) ||
        $config.theme?.itemsPerPage?.[0] ||
        20,
      term: query.term
    };
  };

  const changeSorting = (sort: string) => {
    const sortOptions = $config.theme?.productsSortOptions ?? [];
    const selectedOption = sortOptions.find(
      (option) => option.id === Number.parseInt(sort)
    );

    const { query } = route.value;
    router.push({
      query: {
        ...query,
        sort: selectedOption?.value.sort,
        direction: selectedOption?.value.direction
      }
    });
  };

  const changeFilters = (filters: Record<string, string[]> = {}) => {
    /**
     * Remove empty filter values from query.
     */
    const query = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value.length > 0)
    );

    router.push({
      query
    });
  };

  const changeItemsPerPage = (itemsPerPage: number) => {
    router.push({
      query: {
        ...getFiltersDataFromUrl(false),
        itemsperpage: itemsPerPage,
        page: 1
      }
    });
  };

  const getFilterFromUrlAsArray = (filterFromUrl: QueryItem) => {
    if (!filterFromUrl) {
      return [];
    }

    return Array.isArray(filterFromUrl) ? filterFromUrl : [filterFromUrl];
  };

  const formatDateString = (
    date: string,
    format: 'long' | string = 'DD.MM.YYYY'
  ): string => {
    let normalizedFormat = format;
    if (format === 'long') {
      normalizedFormat = 'DD.MM.YYYY HH:mm';
    }

    return dayjs(date).format(normalizedFormat);
  };

  return {
    categorySlug,
    getFacetsFromURL,
    changeSorting,
    changeFilters,
    changeItemsPerPage,
    formatDateString,
    getFilterFromUrlAsArray
  };
}
