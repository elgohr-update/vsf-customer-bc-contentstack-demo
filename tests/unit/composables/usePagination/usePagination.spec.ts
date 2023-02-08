import { expect } from '@jest/globals';
import { ref } from '@nuxtjs/composition-api';
import { usePagination } from '~/composables/usePagination';

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $config: {
        theme: {
          itemsPerPage: [10]
        }
      }
    })
  };
});

describe('[bigcommerce-theme] usePagination composable', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return default pagination object when there\'s no pagination info', () => {
    // given
    const params = ref({ data: null, meta: null });

    const expectedPagination = {
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
      itemsPerPage: 10,
      pageOptions: [10]
    };

    // when
    const { pagination } = usePagination(params);

    // then
    expect(pagination.value).toStrictEqual(expectedPagination);
  });

  it('should return pagination info with renamed properties that is compatible to vue components', () => {
    // given
    const meta = {
      pagination: {
        current_page: 5,
        total_pages: 5,
        total: 100,
        per_page: 5
      }
    };
    const params = ref({ data: null, meta });

    const expectedPagination = {
      currentPage: 5,
      totalPages: 5,
      totalItems: 100,
      itemsPerPage: 5,
      pageOptions: [10]
    };

    // when
    const { pagination } = usePagination(params);

    // then
    expect(pagination.value).toStrictEqual(expectedPagination);
  });

  it('should compute page info', () => {
    const params = ref({
      data: [],
      meta: {
        pageInfo: {
          startCursor: '',
          endCursor: '',
          hasPreviousPage: false,
          hasNextPage: true
        }
      }
    });

    const { pageInfo } = usePagination(params);

    expect(pageInfo.value).toStrictEqual(params.value.meta.pageInfo);
  });
});
