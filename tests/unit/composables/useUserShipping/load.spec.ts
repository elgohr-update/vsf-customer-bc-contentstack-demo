import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { useUserShipping } from '~/composables/useUserShipping';
import { mockedAddress } from '~/tests/__mocks__/address.mock';
import { useCustomerStore } from '~/stores/customer';
import { CustomersIncludeEnum } from '@vsf-enterprise/bigcommerce-api';

const getCustomerAddressMock = jest.fn();

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      user: {
        user: { value: { id: 1 } }
      },
      $bigcommerce: {
        api: {
          getCustomerAddress: getCustomerAddressMock
        }
      }
    })
  };
});

describe('[BigCommerce - composables] useUserShipping load', () => {
  createTestingPinia();

  const customerStore = useCustomerStore();

  it('should get customer addresses and store it into customerStore', async () => {
    // given
    const { load } = useUserShipping();
    const GET_ADDRESSES_PARAMS = { include: CustomersIncludeEnum.Formfields };
    getCustomerAddressMock.mockResolvedValueOnce({ data: [mockedAddress] });

    // when
    await load();

    // then
    expect(getCustomerAddressMock).toHaveBeenCalledWith(GET_ADDRESSES_PARAMS);
    expect(customerStore.shipping).toEqual([mockedAddress]);
  });

  it('should use createFetchErrorMessage of useErrorMessage when fetch fails', async () => {
    // given
    const ERROR_MESSAGE = 'Mocked error message';
    getCustomerAddressMock.mockRejectedValueOnce(new Error(ERROR_MESSAGE));
    const { error, load } = useUserShipping();

    // when
    await load();

    // then
    expect(error.value.load instanceof Error).toBe(true);
    expect(error.value.load.message).toBe(ERROR_MESSAGE);
  });
});
