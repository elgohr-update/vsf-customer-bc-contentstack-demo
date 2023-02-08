import { computed, reactive } from '@nuxtjs/composition-api';
import {
  UiNotification,
  Notifications,
  UseUiNotificationInterface
} from './types';

const state = reactive<Notifications>({
  notifications: []
});
const maxVisibleNotifications = 3;
const timeToLive = 3000;

/**
 * @public
 *
 * Allows managing and showing notifications to the user.
 *
 * See the {@link UseUiNotificationInterface} for a list of methods and values available in this composable.
 */
export function useUiNotification(): UseUiNotificationInterface {
  const send = (notification: UiNotification) => {
    const id = Symbol();

    const dismiss = () => {
      const index = state.notifications.findIndex(
        (notification) => notification.id === id
      );

      if (index !== -1) {
        state.notifications.splice(index, 1);
      }
    };

    const newNotification = {
      ...notification,
      id,
      dismiss
    };

    state.notifications.push(newNotification);
    if (state.notifications.length > maxVisibleNotifications) {
      state.notifications.shift();
    }

    if (!notification.persist) {
      setTimeout(dismiss, timeToLive);
    }
  };

  return {
    send,
    notifications: computed(() => state.notifications)
  };
}
