import {
  BIGCOMMERCE_USER_AUTHENTICATED
} from '~/composables/useUser/helpers';

import { Middleware } from '@nuxt/types';

const isAuthenticated: Middleware = ({ redirect, $cookies }) => {
  const isLoggedIn = Boolean($cookies.get(BIGCOMMERCE_USER_AUTHENTICATED));
  if (!isLoggedIn) {
    return redirect('/');
  }
};

export default isAuthenticated;
