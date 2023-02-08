<template>
  <SfModal
    v-e2e="'login-modal'"
    :visible="isLoginModalOpen"
    class="modal"
    @close="closeModal"
  >
    <template #modal-bar>
      <SfBar
        class="sf-modal__bar smartphone-only"
        :close="true"
        :title="$t(barTitle)"
        @click:close="closeModal"
      />
    </template>
    <transition name="sf-fade" mode="out-in">
      <div v-if="currentScreen === SCREEN_LOGIN">
        <ValidationObserver v-slot="{ handleSubmit }" key="log-in">
          <form class="form" @submit.prevent="handleSubmit(handleLogin)">
            <ValidationProvider rules="required|email" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-email'"
                v-model="form.email"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="email"
                label="Your email"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-password'"
                v-model="form.password"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="password"
                label="Password"
                type="password"
                class="form__element"
              />
            </ValidationProvider>
            <SfCheckbox
              v-e2e="'login-modal-remember-me'"
              v-model="rememberMe"
              name="remember-me"
              label="Remember me"
              class="form__element checkbox"
            />
            <div v-if="error.login">{{ error.login }}</div>
            <SfButton
              v-e2e="'login-modal-submit'"
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="loading"
            >
              <SfLoader :class="{ loader: loading }" :loading="loading">
                <div>{{ $t('Login') }}</div>
              </SfLoader>
            </SfButton>
          </form>
        </ValidationObserver>
        <div class="bottom">
          <p class="bottom__paragraph">{{ $t('No account') }}</p>
          <SfButton
            class="sf-button--text"
            @click="setCurrentScreen(SCREEN_REGISTER)"
            >{{ $t('Register today') }}</SfButton
          >
        </div>
      </div>
      <div v-else class="form">
        <ValidationObserver v-slot="{ handleSubmit }" key="sign-up">
          <form
            class="form"
            @submit.prevent="handleSubmit(handleRegister)"
            autocomplete="off"
          >
            <ValidationProvider rules="required|email" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-email'"
                v-model="form.email"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="email"
                label="Your email"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-firstName'"
                v-model="form.first_name"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="first-name"
                label="First Name"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-lastName'"
                v-model="form.last_name"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="last-name"
                label="Last Name"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required|password" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-password'"
                v-model="form.password"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="password"
                label="Password"
                type="password"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider
              :rules="{ required: { allowFalse: false } }"
              v-slot="{ errors }"
            >
              <SfCheckbox
                v-e2e="'login-modal-create-account'"
                v-model="createAccount"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="create-account"
                label="I want to create an account"
                class="form__element"
              />
            </ValidationProvider>
            <SfCheckbox
              v-model="acceptsMarketingEmails"
              value="true"
              name="accept-marketing-emails"
              label="I want to receive marketing emails"
              class="form__element"
            />
            <div v-if="error.register">{{ error.register }}</div>
            <SfButton
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="loading"
            >
              <SfLoader :class="{ loader: loading }" :loading="loading">
                <div>{{ $t('Create an account') }}</div>
              </SfLoader>
            </SfButton>
          </form>
        </ValidationObserver>
        <div class="action">
          {{ $t('or') }}
          <SfButton
            class="sf-button--text"
            @click="setCurrentScreen(SCREEN_LOGIN)"
            >{{ $t('login in to your account') }}</SfButton
          >
        </div>
      </div>
    </transition>
  </SfModal>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  useRouter,
  useContext,
  watch
} from '@nuxtjs/composition-api';
import {
  SfModal,
  SfInput,
  SfButton,
  SfCheckbox,
  SfLoader,
  SfBar
} from '@storefront-ui/vue';
import {
  AuthCustomerParams,
  CreateCustomerParameters
} from '@vsf-enterprise/bigcommerce-api';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';
import { useUiState, useUser } from '~/composables';
import { useCustomerStore } from '~/stores';
import { storeToRefs } from 'pinia';

extend('email', {
  ...email,
  message: 'Invalid email'
});

extend('required', {
  ...required,
  message: 'This field is required'
});

export default defineComponent({
  name: 'LoginModal',
  components: {
    SfModal,
    SfInput,
    SfButton,
    SfCheckbox,
    SfLoader,
    ValidationProvider,
    ValidationObserver,
    SfBar
  },
  setup() {
    const router = useRouter();
    const { i18n, localePath } = useContext();
    const { isAuthenticated } = storeToRefs(useCustomerStore());
    const { login, error: useUserErrors, register, loading } = useUser();
    const SCREEN_LOGIN = 'login';
    const SCREEN_REGISTER = 'register';

    extend('password', {
      validate: (value) =>
        String(value).length >= 7 &&
        String(value).match(/[A-Za-z]/gi) !== null &&
        String(value).match(/[0-9]/gi) !== null,
      message: i18n.t(
        'Password must have at least 7 characters including one letter and a number'
      ) as string
    });

    const { isLoginModalOpen, toggleLoginModal } = useUiState();
    const form = ref<{
      email?: string;
      first_name?: string;
      last_name?: string;
      password?: string;
      accepts_product_review_abandoned_cart_emails?: boolean;
    }>({});
    const createAccount = ref(false);
    const rememberMe = ref(false);
    const acceptsMarketingEmails = ref(false);
    const currentScreen = ref(SCREEN_REGISTER);

    const error = reactive({
      login: null,
      register: null
    });

    const resetErrorValues = () => {
      error.login = null;
      error.register = null;
    };

    const barTitle = computed(() => {
      switch (currentScreen.value) {
        case SCREEN_LOGIN:
          return 'Sign in';
        case SCREEN_REGISTER:
          return 'Register';
        default:
          return 'Reset Password';
      }
    });

    watch(isLoginModalOpen, () => {
      if (isLoginModalOpen) {
        form.value = {};
        resetErrorValues();
      }
    });

    const setCurrentScreen = (screenName) => {
      resetErrorValues();
      currentScreen.value = screenName;
    };

    type HandleFormCallback = (payload: typeof form.value) => void;
    const handleForm = (fn: HandleFormCallback) => async () => {
      resetErrorValues();
      form.value.accepts_product_review_abandoned_cart_emails =
        acceptsMarketingEmails.value;
      await fn(form.value);

      const hasUserErrors =
        useUserErrors.value.login || useUserErrors.value.register;
      if (hasUserErrors) {
        error.login =
          useUserErrors.value.login instanceof Error
            ? useUserErrors.value.login?.message
            : useUserErrors.value.login;
        error.register =
          useUserErrors.value.register instanceof Error
            ? useUserErrors.value.register?.message
            : useUserErrors.value.register;
        return;
      }

      toggleLoginModal();

      if (isAuthenticated.value) {
        const localeAccountPath = localePath({ name: 'my-account' });
        return router.push(localeAccountPath);
      }
    };

    const closeModal = () => {
      resetErrorValues();
      setCurrentScreen(SCREEN_LOGIN);
      toggleLoginModal();
    };

    // todo(BC-514): typings are forced till a proper form handler will be created
    const handleRegister = async () =>
      handleForm((args) => register(args as CreateCustomerParameters))();
    const handleLogin = async () =>
      handleForm((args) => login(args as AuthCustomerParams))();

    return {
      form,
      error,
      isAuthenticated,
      loading,
      createAccount,
      rememberMe,
      isLoginModalOpen,
      toggleLoginModal,
      handleLogin,
      handleRegister,
      closeModal,
      barTitle,
      currentScreen,
      setCurrentScreen,
      SCREEN_LOGIN,
      SCREEN_REGISTER,
      acceptsMarketingEmails
    };
  }
});
</script>

<style lang="scss" scoped>
.modal {
  --modal-index: 3;
  --overlay-z-index: 3;
}
.form {
  margin-top: var(--spacer-sm);
  &__element {
    margin: 0 0 var(--spacer-xl) 0;
  }
}
.action {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
  font: var(--font-weight--light) var(--font-size--base) / 1.6
    var(--font-family--secondary);
  & > * {
    margin: 0 0 0 var(--spacer-xs);
  }
}
.action {
  margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
}
.checkbox {
  margin-bottom: var(--spacer-2xl);
}
.bottom {
  text-align: center;
  margin: var(--spacer-lg) 0;
  font-size: var(--h3-font-size);
  font-weight: var(--font-weight--semibold);
  font-family: var(--font-family--secondary);
  &__paragraph {
    color: var(--c-primary);
    margin: 0 0 var(--spacer-base) 0;
    @include for-desktop {
      margin: 0;
    }
  }
}
</style>
