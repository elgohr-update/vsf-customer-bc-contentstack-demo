import { MetaCollection } from '@vsf-enterprise/bigcommerce-api';
import { GetPaginationResponse } from '../types';

export function getPagination(meta: MetaCollection, defaults: GetPaginationResponse): GetPaginationResponse {
  return {
    currentPage: meta?.pagination?.current_page ?? defaults.currentPage,
    totalPages: meta?.pagination?.total_pages ?? defaults.totalPages,
    totalItems: meta?.pagination?.total ?? meta?.totalItems ?? defaults.totalItems,
    itemsPerPage: meta?.pagination?.per_page ?? defaults.itemsPerPage,
    pageOptions: defaults.pageOptions
  };
}
