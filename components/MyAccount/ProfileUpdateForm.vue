<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }">
    <form class="form" @submit.prevent="handleSubmit(submitForm(reset))">
      <div class="form__horizontal">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2"
          class="form__element"
        >
          <SfInput
            v-model="form.first_name"
            name="firstName"
            label="First Name"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2"
          class="form__element"
        >
          <SfInput
            v-model="form.last_name"
            name="lastName"
            label="Last Name"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
      </div>
      <ValidationProvider
        v-slot="{ errors }"
        rules="required|email"
        class="form__element"
      >
        <SfInput
          v-model="form.email"
          type="email"
          name="email"
          label="Your e-mail"
          required
          :valid="!errors[0]"
          :error-message="errors[0]"
        />
      </ValidationProvider>
      <mounting-portal mount-to="#root-modal" append>
        <SfModal
          :visible="requirePassword"
          :title="$t('Attention!')"
          cross
          persistent
          class="sf-modal__require-password"
          @close="requirePassword = false"
        >
          {{
            $t(
              'Please type your current password to change your personal details.'
            )
          }}
          <SfInput
            v-model="currentPassword"
            type="password"
            name="currentPassword"
            label="Current Password"
            required
            class="form__element"
            style="margin-top: 10px"
            @keypress.enter="handleSubmit(submitForm(reset))"
          />
          <div v-if="error.authentication">
            {{ error.authentication }}
          </div>
          <SfButton
            class="form__button form__button-inline form__button-width-auto"
            type="submit"
            :disabled="loading"
            @click="handleSubmit(submitForm(reset))"
          >
            <SfLoader :class="{ loader: loading }" :loading="loading">
              <div>
                {{ $t('Update personal data') }}
              </div>
            </SfLoader>
          </SfButton>
        </SfModal>
      </mounting-portal>
      <SfButton
        class="form__button form__button-inline form__button-width-auto"
        type="submit"
        :disabled="loading"
      >
        <SfLoader :class="{ loader: loading }" :loading="loading">
          <div>
            {{ $t('Update personal data') }}
          </div>
        </SfLoader>
      </SfButton>
      <SfButton
        @click="cancel()"
        class="form__button form__button-inline form__button-width-auto"
      >
        {{ $t('Cancel') }}
      </SfButton>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  ref,
  useContext
} from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { SfInput, SfButton, SfModal, SfLoader } from '@storefront-ui/vue';
import { useCustomerStore } from '../../stores/customer';
import { storeToRefs } from 'pinia';
export default defineComponent({
  name: 'ProfileUpdateForm',
  components: {
    SfInput,
    SfButton,
    SfModal,
    SfLoader,
    ValidationProvider,
    ValidationObserver
  },
  props: {
    cancel: {
      type: Function as PropType<() => void>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const { i18n } = useContext();
    const { currentCustomer: user } = storeToRefs(useCustomerStore());
    const currentPassword = ref('');
    const requirePassword = ref(false);
    const error = reactive({
      authentication: null
    });
    const resetForm = () => ({
      first_name: user.value.first_name,
      last_name: user.value.last_name,
      email: user.value.email,
      validation: {
        email: user.value.email,
        password: ''
      }
    });
    const form = ref<{
      first_name: string;
      last_name: string;
      email: string;
      password?: string;
      validation: {
        email: string;
        password: string;
      };
    }>(resetForm());

    const submitForm = (resetValidationFn) => () => {
      requirePassword.value = true;
      error.authentication = '';
      const onComplete = () => {
        requirePassword.value = false;
        currentPassword.value = '';
        resetValidationFn();
      };

      const onError = () => {
        // TODO part of the unified error
        error.authentication = i18n.t('Invalid credentials');
        requirePassword.value = true;
        currentPassword.value = '';
      };

      if (currentPassword.value) {
        form.value.password = currentPassword.value;
        form.value.validation = {
          email: user.value.email,
          password: currentPassword.value
        };
        emit('submit', { form, onComplete, onError });
      }
    };

    return {
      requirePassword,
      currentPassword,
      form,
      error,
      submitForm
    };
  }
});
</script>
<style lang="scss" scoped>
.sf-modal {
  $self: &;
  &__require-password {
    ::v-deep #{$self}__overlay {
      z-index: 3;
    }

    ::v-deep #{$self}__container {
      z-index: 4;
    }
  }
}
.form {
  &__element {
    display: block;
    margin: 0 0 var(--spacer-lg) 0;
  }
  &__button {
    display: block;
    width: 100%;
    margin-right: 1rem;
    @include for-desktop {
      width: 17.5rem;
    }
    &-inline {
      display: inline-block;
      margin-bottom: 1rem;
    }
  }
  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-2xl);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
