<template>
  <SfTabs :open-tab="1" v-if="user">
    <!-- Personal data update -->
    <SfTab title="Personal data">
      <div v-if="!showEditProfileForm">
        <p class="profile">
          <span class="profile__label">{{ $t('Email') }}</span>
          {{ user.email }}
        </p>
        <p class="profile">
          <span class="profile__label">{{ $t('First Name') }}</span>
          {{ user.first_name }}
        </p>
        <p class="profile">
          <span class="profile__label">{{ $t('Last Name') }}</span>
          {{ user.last_name }}
        </p>

        <SfButton @click="showEditProfileForm = true">
          {{ $t('Edit Personal Data') }}
        </SfButton>
      </div>
      <ProfileUpdateForm
        :cancel="closeEditProfileForm"
        v-if="showEditProfileForm"
        @submit="updatePersonalData"
        :loading="loading"
      />

      <p class="notice">
        {{ $t('Use your personal data') }}
        <a href="">{{ $t('Privacy Policy') }}</a>
      </p>
    </SfTab>

    <!-- Password reset -->
    <SfTab title="Password change">
      <p class="message">
        {{ $t('Change password your account') }}:<br />
        {{ $t('Your current email address is') }}
        <span class="message__label">{{ user.email }}</span>
      </p>

      <PasswordResetForm @submit="updatePassword"/>
    </SfTab>
  </SfTabs>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { extend } from 'vee-validate';
import { email, required, min, confirmed } from 'vee-validate/dist/rules';
import ProfileUpdateForm from '~/components/MyAccount/ProfileUpdateForm.vue';
import PasswordResetForm from '~/components/MyAccount/PasswordResetForm.vue';
import { SfTabs, SfButton } from '@storefront-ui/vue';
import { useCustomerStore } from '../../stores/customer';
import { storeToRefs } from 'pinia';
import { useUser } from '../../composables/useUser';

// import { storeToRefs } from 'pinia'
extend('email', {
  ...email,
  message: 'Invalid email'
});

extend('required', {
  ...required,
  message: 'This field is required'
});

extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});

extend('password', {
  validate: (value) =>
    String(value).length >= 8 &&
    /[A-Za-z]/gi.test(String(value)) &&
    /[0-9]/gi.test(String(value)),
  message:
    'Password must have at least 8 characters including one letter and a number'
});

extend('confirmed', {
  ...confirmed,
  message: 'Passwords don\'t match'
});

export default defineComponent({
  name: 'PersonalDetails',

  components: {
    SfTabs,
    SfButton,
    ProfileUpdateForm,
    PasswordResetForm
  },
  setup() {
    const { currentCustomer: user } = storeToRefs(useCustomerStore());
    const { updateCustomer, error, loading } = useUser();
    const showEditProfileForm = ref(false);
    const closeEditProfileForm = () => {
      showEditProfileForm.value = false;
    };

    // todo(BC-514)
    const formHandler = async (fn, onComplete, onError) => {
      try {
        const data = await fn();
        await onComplete(data);
        if (error.value.updateCustomer) throw error.value.updateCustomer;
        closeEditProfileForm();
      } catch (error) {
        onError(error);
      }
    };

    const updatePersonalData = ({ form, onComplete, onError }) =>
      formHandler(() => updateCustomer({
        first_name: form.value.first_name,
        last_name: form.value.last_name,
        email: form.value.email,
        validation: form.value.validation
      }),
      onComplete,
      onError);
    const updatePassword = ({ form, onComplete, onError }) =>
      formHandler(() => updateCustomer({
        authentication: { new_password: form.value.newPassword },
        validation: form.value.validation
      }),
      onComplete,
      onError
      );

    return {
      updatePersonalData,
      updatePassword,
      user,
      showEditProfileForm,
      closeEditProfileForm,
      loading
    };
  }
});
</script>

<style lang="scss" scoped>
.message,
.notice {
  font-family: var(--font-family--primary);
  line-height: 1.6;
}
.message {
  margin: 0 0 var(--spacer-xl) 0;
  font-size: var(--font-size--base);
  &__label {
    font-weight: 400;
  }
}
.notice {
  margin: var(--spacer-lg) 0 0 0;
  font-size: var(--font-size--sm);
}
.profile {
  margin: 0 0 var(--spacer-lg) 0;
  font-size: var(--font-size--base);
  &__label {
    font-weight: 400;
    width: 120px;
    display: inline-flex;
  }
}
</style>
