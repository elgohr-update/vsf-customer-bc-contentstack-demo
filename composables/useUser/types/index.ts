import { Ref } from '@nuxtjs/composition-api';
import {
  AuthCustomerParams,
  CreateCustomerParameters,
  UpdateCustomerParameters
} from '@vsf-enterprise/bigcommerce-api';

/**
 * `useUser` composable errors.
 */
export interface UseUserErrors {
  /**
   * Errors occurred during `load` action.
   */
  load: Error;
  /**
   * Errors occurred during `login` action.
   */
  login: Error;
  /**
   * Errors occurred during `logout` action.
   */
  logout: Error;
  /**
   * Errors occurred during `register` action.
   */
  register: Error;
  /**
   * Errors occurred during `updateCustomer` action.
   */
  updateCustomer: Error;
}

/**
 * Data and methods returned from the {@link useUser|useUser()} composable
 */
export interface UseUserInterface {
  /**
   * Contains errors from the composable methods.
   */
  error: Ref<UseUserErrors>;

  /**
   * Indicates whether any of the methods is in progress.
   */
  loading: Ref<boolean>;

  /**
   * Loads the current user.
   *
   * @remarks
   *
   * Saves the details returned from the API in the `customerStore`.
   */
  load(): Promise<void>;

  /**
   * Logs in the customer based on provided username and password.
   *
   * @remarks
   *
   * Saves the details returned from the API in the `customerStore`.
   */
  login(credentials: AuthCustomerParams): Promise<boolean>;

  /**
   * Logs out current customer. Clears customer cookies.
   */
  logout(): Promise<boolean>;

  /**
   * Create customers accounnt and logs in the user.
   *
   * @remarks
   *
   * Saves the details returned from the API in the `customerStore`.
   */
  register(user: CreateCustomerParameters): Promise<boolean>;

  /**
   * Update current customer information.
   *
   * @remarks
   *
   * Saves the details returned from the API in the `customerStore`.
   */
  updateCustomer(parameters: UpdateCustomerParameters): Promise<void>;
}
