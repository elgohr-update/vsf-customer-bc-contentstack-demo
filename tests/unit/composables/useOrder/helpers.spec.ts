import { OrderItem } from '@vsf-enterprise/bigcommerce-api';
import {
  getItemAttributes
} from '~/composables/useOrder/helpers';
import { mockedOrderItem } from '../../../__mocks__/orderItem.mock';
import { expect } from '@jest/globals';

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $config: jest.fn()
    })
  };
});

describe('[bigcommerce-theme] useUserOrder helpers', () => {
  it('getItemAttributes should correctly mapped the attributes to sfUI compatible object structure', () => {
    expect(getItemAttributes(mockedOrderItem as OrderItem)).toEqual({
      Color: 'Silver',
      Size: 'Small'
    });
  });

  it('getItemAttributes should return empty object when the item is not defined', () => {
    expect(getItemAttributes(undefined)).toEqual({});
  });
});
