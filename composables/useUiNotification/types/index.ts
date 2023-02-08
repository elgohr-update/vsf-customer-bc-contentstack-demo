import { ComputedRef } from '@nuxtjs/composition-api';

/**
 * A UI notification
 */
export interface UiNotification {
  /**
   * Message.
   */
  message: string;
  /**
   * Action.
   */
  action: { text: string; onClick: (...args: any) => void };
  /**
   * Type.
   */
  type: 'danger' | 'success' | 'info';
  /**
   * Icon.
   */
  icon: string;
  /**
   * If persist.
   */
  persist: boolean;
  /**
   * Id.
   */
  id: symbol;
  /**
   * Dismiss call.
   */
  dismiss: () => void;
}

/**
 * Notifications.
 */
export interface Notifications {
  /**
   * Array of notifications.
   */
  notifications: Array<UiNotification>;
}

/**
 * Data and methods returned from the {@link useUiNotification|useUiNotification()} composable
 */
export interface UseUiNotificationInterface {
  /**
   * Displays the notification in the UI
   */
  send(notification: UiNotification): void;

  /**
   * Contains notifications added using the `send` method
   */
  notifications: ComputedRef<UiNotification[]>;
}
