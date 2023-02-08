import { expect } from '@jest/globals';
import { themeConfigMock } from '../../../__mocks__/themeConfig.mock';
import { useSortOptions } from '../../../../composables/useSortOptions';

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useRoute: () => ({
      value: {
        query: {
          sort: 'id',
          direction: 'desc'
        }
      }
    }),
    useContext: () => ({
      $config: {
        theme: themeConfigMock
      }
    })
  };
});

describe('[bigcommerce-theme] useFacetData', () => {
  const { sortOptions, selected } = useSortOptions();

  it('getSortOptions should return an object of available options array and the id of the selected option', async () => {
    const expectedOptions = [
      {
        id: 1,
        metadata: { direction: 'desc', sort: 'id' },
        type: 'sort',
        value: 'Latest'
      },
      { id: 2, metadata: { sort: 'id' }, type: 'sort', value: 'Oldest' },
      {
        id: 3,
        metadata: { sort: 'name' },
        type: 'sort',
        value: 'Name: A to Z'
      },
      {
        id: 4,
        metadata: { direction: 'desc', sort: 'name' },
        type: 'sort',
        value: 'Name: Z to A'
      },
      {
        id: 5,
        metadata: { direction: 'desc', sort: 'price' },
        type: 'sort',
        value: 'Price from high to low'
      },
      {
        id: 6,
        metadata: { sort: 'price' },
        type: 'sort',
        value: 'Price from low to high'
      }
    ];

    const expectedSelected = '1';

    expect(sortOptions.value).toEqual(expectedOptions);
    expect(selected.value).toEqual(expectedSelected);
  });
});
