import { computed, useContext } from '@nuxtjs/composition-api';
import { getPagination } from './helpers/getPagination';
import { PaginatedCollection, UsePaginationInterface } from './types';

/**
 * @public
 *
 * Computes a pagination by api collection object.
 *
 * See the {@link UsePaginationInterface} for a list of methods and values available in this composable.
 */
export const usePagination = (
  collection: PaginatedCollection
): UsePaginationInterface => {
  const { $config } = useContext();

  const defaultPagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 1,
    itemsPerPage: $config.theme?.itemsPerPage?.[0],
    pageOptions: $config.theme?.itemsPerPage
  };

  const pagination = computed(() =>
    getPagination(collection.value?.meta, defaultPagination)
  );

  const pageInfo = computed(() => collection.value?.meta?.pageInfo);

  return {
    pagination,
    pageInfo
  };
};
