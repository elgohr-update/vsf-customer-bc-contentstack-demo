import type { Ref } from '@nuxtjs/composition-api';
import {
  UserAddress,
  GetAddressParameters
} from '@vsf-enterprise/bigcommerce-api';

/**
 * `useUserShipping` composable errors.
 */
export interface UseUserShippingErrors {
  /**
   * Errors occurred during `load` action.
   */
  load: Error;

  /**
   * Errors occurred during `addAddress` action.
   */
  addAddress: Error;

  /**
   * Errors occurred during `deleteAddress` action.
   */
  deleteAddress: Error;

  /**
   * Errors occurred during `updateAddress` action.
   */
  updateAddress: Error;
}

/**
 * Data and methods returned from the {@link useUserShipping|useUserShipping()} composable
 */
export interface UseUserShippingInterface {
  /**
   * Contains errors from the composable methods.
   */
  error: Ref<UseUserShippingErrors>;

  /**
   * Indicates whether any of the methods is in progress.
   */
  loading: Ref<boolean>;

  /**
   * Loads current customer shipping information.
   *
   * @remarks
   *
   * Saves the details returned from the API in the `customerStore`.
   */
  load(params?: GetAddressParameters): Promise<void>;

  /**
   * Adds customers new shipping address.
   *
   * @remarks
   *
   * Saves the details returned from the API in the `customerStore`.
   */
  addAddress(address: UserAddress): Promise<void>;

  /**
   * Removes customers shipping address.
   *
   * @remarks
   *
   * Saves the details returned from the API in the `customerStore`.
   */
  deleteAddress(address: UserAddress): Promise<void>;

  /**
   * Updates customers shipping address.
   *
   * @remarks
   *
   * Saves the details returned from the API in the `customerStore`.
   */
  updateAddress(address: UserAddress): Promise<void>;
}
