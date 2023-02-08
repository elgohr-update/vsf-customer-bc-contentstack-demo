<template>
  <SfTabs :open-tab="1" class="tab-orphan">
    <SfTab title="My newsletter">
      <p class="message">
        {{ $t('Set up newsletter') }}
      </p>
      <form class="form" v-on:submit.prevent="triggerModal">
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
              @keypress.enter="submitNewsletterPreferences"
            />
            <div v-if="error.authentication">
              {{ error.authentication }}
            </div>
            <SfButton
              class="form__button form__button-inline form__button-width-auto"
              type="submit"
              :disabled="loading"
              @click="submitNewsletterPreferences"
            >
              <SfLoader :class="{ loader: loading }" :loading="loading">
                <div>
                  {{ $t('Update personal data') }}
                </div>
              </SfLoader>
            </SfButton>
          </SfModal>
        </mounting-portal>
        <p class="form__title">
          {{ $t('I would like to receive marketing newsletters') }}
        </p>
        <div class="form__checkbox-group">
          <SfCheckbox
            v-model="newsletter"
            label="Yes"
            value="true"
            class="form__element"
          />
        </div>
        <SfButton type="submit" class="form__button" :disabled="loading">
          <SfLoader :class="{ loader: loading }" :loading="loading">
            <div>{{ $t('Save changes') }}</div>
          </SfLoader>
        </SfButton>
      </form>
      <p class="notice">
        {{ $t('Read and understand') }}
        <SfLink class="notice__link" link="#">{{ $t('Privacy') }}</SfLink> and
        <SfLink class="notice__link" link="#">{{
          $t('Cookies Policy')
        }}</SfLink>
        {{ $t('Commercial information') }}
      </p>
    </SfTab>
  </SfTabs>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  useContext
} from '@nuxtjs/composition-api';
import {
  SfTabs,
  SfCheckbox,
  SfButton,
  SfModal,
  SfLoader,
  SfLink,
  SfInput
} from '@storefront-ui/vue';
import { useCustomerStore } from '../../stores/customer';
import { storeToRefs } from 'pinia';
import { useUser } from '../../composables/useUser';
export default defineComponent({
  name: 'MyNewsletter',
  components: {
    SfTabs,
    SfInput,
    SfCheckbox,
    SfButton,
    SfLoader,
    SfLink,
    SfModal
  },
  setup() {
    const { currentCustomer: user } = storeToRefs(useCustomerStore());
    const { updateCustomer, error: useUserErrors, loading } = useUser();
    const { i18n } = useContext();
    const newsletter = ref(false);
    const requirePassword = ref(false);
    const currentPassword = ref('');
    const email = ref('');
    const error = reactive({
      authentication: null
    });
    const triggerModal = () => {
      requirePassword.value = true;
    };

    const submitNewsletterPreferences = async () => {
      error.authentication = '';
      try {
        await updateCustomer({
          accepts_product_review_abandoned_cart_emails: newsletter.value,
          validation: {
            email: email.value,
            password: currentPassword.value
          }
        });
        if (useUserErrors.value.updateCustomer) {
          error.authentication = i18n.t('Invalid credentials');
        } else {
          requirePassword.value = false;
          currentPassword.value = '';
        }
      } catch (error) {
        throw new Error(error);
      }
    };

    onMounted(async () => {
      if (user.value) {
        newsletter.value =
          user.value.accepts_product_review_abandoned_cart_emails;
        email.value = user.value.email;
      }
    });

    return {
      requirePassword,
      currentPassword,
      newsletter,
      user,
      error,
      loading,
      triggerModal,
      submitNewsletterPreferences
    };
  }
});
</script>

<style lang="scss" scoped>
.tab-orphan {
  @include for-mobile {
    --tabs-title-display: none;
    --tabs-content-padding: 0;
    --tabs-conent-border-width: 0;
  }
}
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
    margin: 0 0 var(--spacer-base) 0;
    &:last-child {
      margin: 0;
    }
  }
  &__checkbox-group {
    margin: 0 0 var(--spacer-xl) 0;
  }
  &__title {
    margin: 0 0 var(--spacer-base) 0;
  }
  &__button {
    --button-width: 100%;
    @include for-desktop {
      --button-width: 17.5rem;
    }
  }
}
.message {
  margin: 0 0 var(--spacer-xl) 0;
  color: var(--c-dark-variant);
}
.notice {
  margin: var(--spacer-base) 0 0 0;
  font-size: var(--font-size--xs);
  &__link {
    color: var(--c-primary);
    text-decoration: none;
    &:hover {
      color: var(--c-text);
    }
  }
}
</style>
