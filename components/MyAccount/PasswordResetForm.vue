<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }">
    <form class="form" @submit.prevent="handleSubmit(submitForm(reset))">
      <ValidationProvider
        v-slot="{ errors }"
        rules="required"
        class="form__element"
      >
        <SfInput
          v-model="form.currentPassword"
          type="password"
          name="currentPassword"
          label="Current Password"
          required
          :valid="!errors[0]"
          :error-message="errors[0]"
        />
      </ValidationProvider>
      <div class="form__horizontal">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|password"
          vid="password"
          class="form__element"
        >
          <SfInput
            v-model="form.newPassword"
            type="password"
            name="newPassword"
            label="New Password"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|confirmed:password"
          class="form__element"
        >
          <SfInput
            v-model="form.repeatPassword"
            type="password"
            name="repeatPassword"
            label="Repeat Password"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
      </div>
      <div v-if="error.authentication">
        {{ error.authentication }}
      </div>
      <SfButton type="submit" class="form__button">
        {{ $t('Update password') }}
      </SfButton>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive
} from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { SfInput, SfButton } from '@storefront-ui/vue';
import { useCustomerStore } from '../../stores/customer';
import { storeToRefs } from 'pinia';
export default defineComponent({
  name: 'PasswordResetForm',
  components: {
    SfInput,
    SfButton,
    ValidationProvider,
    ValidationObserver
  },
  emits: ['submit'],
  setup(_, { emit }) {
    const { currentCustomer: user } = storeToRefs(useCustomerStore());
    const resetForm = () => ({
      currentPassword: '',
      newPassword: '',
      repeatPassword: '',
      validation: {
        email: '',
        password: ''
      }
    });
    const error = reactive({
      authentication: null
    });
    const form = ref(resetForm());
    const submitForm = (resetValidationFn) => () => {
      const onComplete = () => {
        error.authentication = '';
        form.value = resetForm();
        resetValidationFn();
      };

      const onError = () => {
        // TODO: Handle error
      };

      form.value.validation = {
        email: user.value.email,
        password: form.value.currentPassword
      };

      emit('submit', { form, onComplete, onError });
    };

    return {
      form,
      error,
      submitForm
    };
  }
});
</script>

<style lang="scss" scoped>
.form {
  &__element {
    display: block;
    margin: 0 0 var(--spacer-lg) 0;
  }
  &__button {
    display: block;
    width: 100%;
    @include for-desktop {
      width: 17.5rem;
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
        margin-right: var(--spacer-lg);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
