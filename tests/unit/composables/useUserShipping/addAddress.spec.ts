import { expect } from '@jest/globals';
import { createTestingPinia } from '@pinia/testing';
import { useUserShipping } from '~/composables/useUserShipping';
import { mockedAddress } from '~/tests/__mocks__/address.mock';
import { useCustomerStore } from '~/stores/customer';

const createCustomerAddressMock = jest.fn();

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api: {
          createCustomerAddress: createCustomerAddressMock
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

  it('should create new address and put to store', async () => {
    // given
    const { addAddress } = useUserShipping();
    createCustomerAddressMock.mockResolvedValueOnce({ data: [mockedAddress] });

    // when
    await addAddress(mockedAddress);

    // then
    expect(createCustomerAddressMock).toHaveBeenCalledWith(mockedAddress);
    expect(customerStore.shipping).toEqual([mockedAddress]);
  });

  it('should use createRequestErrorMessage of useErrorMessage when request fails', async () => {
    // given
    const ERROR_MESSAGE = 'Mocked error message';
    const { addAddress, error } = useUserShipping();
    createCustomerAddressMock.mockRejectedValueOnce(new Error(ERROR_MESSAGE));

    // when
    await addAddress(mockedAddress);

    // then
    expect(error.value.addAddress instanceof Error).toBe(true);
    expect(error.value.addAddress.message).toBe(ERROR_MESSAGE);
  });
});
