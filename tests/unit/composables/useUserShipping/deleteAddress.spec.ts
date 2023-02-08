import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { useUserShipping } from '~/composables/useUserShipping';
import { mockedAddress } from '~/tests/__mocks__/address.mock';
import { useCustomerStore } from '~/stores/customer';

const deleteCustomerAddressMock = jest.fn();

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
          deleteCustomerAddress: deleteCustomerAddressMock
        }
      }
    })
  };
});

describe('[BigCommerce - composables] useUserShipping update', () => {
  createTestingPinia();
  const customerStore = useCustomerStore();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should delete the address and update store state', async () => {
    // given
    const DELETE_CUSTOMER_PARAMS = {
      'id:in': [mockedAddress.id]
    };
    customerStore.shipping = [mockedAddress];
    deleteCustomerAddressMock.mockResolvedValueOnce({ data: [] });
    const { deleteAddress } = useUserShipping();

    // when
    await deleteAddress(mockedAddress);

    // then
    expect(deleteCustomerAddressMock).toHaveBeenCalledWith(DELETE_CUSTOMER_PARAMS);
    expect(customerStore.shipping).toHaveLength(0);
  });

  it('should use createRequestErrorMessage of useErrorMessage when request fails', async () => {
    // given
    const ERROR_MESSAGE = 'Mocked error message';
    customerStore.shipping = [mockedAddress];
    deleteCustomerAddressMock.mockRejectedValueOnce(new Error(ERROR_MESSAGE));
    const { error, deleteAddress } = useUserShipping();

    // when
    await deleteAddress(mockedAddress);

    // then
    expect(error.value.deleteAddress instanceof Error).toBe(true);
    expect(error.value.deleteAddress.message).toBe(ERROR_MESSAGE);
  });
});
