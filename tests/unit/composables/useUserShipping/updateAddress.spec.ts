import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { useUserShipping } from '~/composables/useUserShipping';
import {
  mockedAddress,
  mockedAddressFormData
} from '~/tests/__mocks__/address.mock';
import { useCustomerStore } from '~/stores/customer';

const updateCustomerAddressMock = jest.fn();

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api: {
          updateCustomerAddress: updateCustomerAddressMock
        }
      }
    })
  };
});

describe('[BigCommerce - composables] useUserShipping update', () => {
  createTestingPinia();

  const customerStore = useCustomerStore();

  beforeEach(() => {
    customerStore.shipping = [mockedAddress];
    jest.resetAllMocks();
  });

  it('should update the address and return the parameter address if endpoint returned the updated array', async () => {
    // given
    const { updateAddress } = useUserShipping();
    updateCustomerAddressMock.mockResolvedValueOnce({
      ...mockedAddress,
      address1: mockedAddressFormData.address1
    });

    // when
    await updateAddress(mockedAddress);

    // then
    expect(updateCustomerAddressMock).toHaveBeenCalledWith(mockedAddress);
  });

  it('should update the address and save to store updated version', async () => {
    const { updateAddress } = useUserShipping();
    const updateAddressMock = {
      ...mockedAddress,
      city: 'Update City'
    };

    updateCustomerAddressMock.mockResolvedValueOnce({
      data: [updateAddressMock]
    });

    await updateAddress(updateAddressMock);

    expect(updateCustomerAddressMock).toHaveBeenCalledWith(updateAddressMock);
    expect(customerStore.shipping).toEqual([updateAddressMock]);
  });

  it('should use createRequestErrorMessage of useErrorMessage when request fails', async () => {
    // given
    const ERROR_MESSAGE = 'Mocked error message';
    customerStore.shipping = [mockedAddress];
    updateCustomerAddressMock.mockRejectedValueOnce(new Error(ERROR_MESSAGE));
    const { error, updateAddress } = useUserShipping();

    // when
    await updateAddress(mockedAddress);

    // then
    expect(error.value.updateAddress instanceof Error).toBe(true);
    expect(error.value.updateAddress.message).toBe(ERROR_MESSAGE);
  });
});
