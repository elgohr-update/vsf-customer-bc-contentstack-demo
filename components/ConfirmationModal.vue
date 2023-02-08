<template>
  <SfModal :visible="isOpen" class="modal" @close="close">
    <template #modal-bar>
      <SfBar
        class="sf-modal__bar smartphone-only"
        :close="true"
        :title="$t('Please confirm')"
        @click:close="close"
      />
    </template>
    <transition name="sf-fade" mode="out-in">
      <div>
        <slot>{{ $t(confirmationText) }}</slot>
        <div class="action">
          <SfButton @click="confirm">
            {{ $t(confirmLabel) }}
          </SfButton>
          <SfButton class="color-light" @click="close">
            {{ $t(cancelLabel) }}
          </SfButton>
        </div>
      </div>
    </transition>
  </SfModal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from '@nuxtjs/composition-api';
import { SfModal, SfButton, SfBar } from '@storefront-ui/vue';
import { useUiState } from '~/composables';
import { useUser } from '~/composables/useUser';
export default defineComponent({
  name: 'ConfirmationModal',
  components: {
    SfModal,
    SfButton,
    SfBar
  },
  props: {
    onConfirm: {
      type: Function,
      required: true
    },
    isOpen: {
      type: Boolean,
      required: true
    },
    confirmationText: {
      type: String,
      default: 'Are you sure?'
    },
    confirmLabel: {
      type: String,
      default: 'Yes'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    }
  },
  emits: ['on-close'],
  setup() {
    const { isLoginModalOpen, toggleLoginModal } = useUiState();
    const form = ref({});
    const isLogin = ref(false);
    const createAccount = ref(false);
    const rememberMe = ref(false);
    const { login, error: useUserErrors, register, loading } = useUser();

    const error = reactive({
      login: null,
      register: null
    });

    const resetErrorValues = () => {
      error.login = null;
      error.register = null;
    };

    watch(isLoginModalOpen, () => {
      if (isLoginModalOpen) {
        form.value = {};
        resetErrorValues();
      }
    });

    const setIsLoginValue = (value) => {
      resetErrorValues();
      isLogin.value = value;
    };

    const handleForm = (fn) => async () => {
      resetErrorValues();
      await fn({ user: form.value });

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
    };

    const handleRegister = async () => handleForm(register)();

    const handleLogin = async () => handleForm(login)();

    return {
      form,
      error,
      loading,
      isLogin,
      createAccount,
      rememberMe,
      isLoginModalOpen,
      toggleLoginModal,
      handleLogin,
      handleRegister,
      setIsLoginValue
    };
  },
  methods: {
    close() {
      this.$emit('on-close');
    },
    confirm() {
      this.onConfirm();
      this.close();
    }
  }
});
</script>

<style lang="scss" scoped>
.modal {
  --modal-index: 3;
  --overlay-z-index: 3;
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
.bottom {
  text-align: center;
  margin-bottom: var(--spacer-lg);
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
