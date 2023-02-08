<template>
  <div>
    <div v-if="isSuccess" class="thank-you">
      <SfCallToAction
        :title="$t('Thank you for your order!')"
        :button-text="$t('Continue shopping')"
        v-e2e="'thank-you-banner'"
        class="banner"
        :image="{
          mobile: '/thankyou/bannerM.webp',
          desktop: '/thankyou/bannerTY.webp'
        }"
        @click="continueShopping"
      >
        <template #description>
          <div v-if="order && !isOrderLoading" class="banner__order-number">
            <span>{{ $t('Order No.') }}</span>
            <strong>&nbsp;{{ order.id }}</strong>
          </div>
        </template>
      </SfCallToAction>

      <SfLoader :loading="isOrderLoading">
        <order-summary v-if="order" :order="order" />
      </SfLoader>
    </div>

    <div v-else-if="isError" class="error message">
      <SfHeading
        :title="$t('An error occured during the checkout.')"
        :level="1"
        :description="errorMessage"
        class="thank-you__error-heading"
      />

      <SfButton @click="tryAgain">{{ $t('Try again') }}</SfButton>
    </div>

    <div id="checkout" v-if="!isSuccess"></div>
  </div>
</template>

<script lang="ts">
import {
  SfButton,
  SfCallToAction,
  SfHeading,
  SfLoader
} from '@storefront-ui/vue';
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  useContext,
  useRouter
} from '@nuxtjs/composition-api';
import { embedCheckout } from '@bigcommerce/checkout-sdk';
import { useWishlist } from '../composables/useWishlist';
import OrderSummary from '../components/OrderSummary.vue';
import { useCart } from '~/composables/useCart';
import { useSearchOrderByCart } from '~/composables/useSearchOrderByCart';
import { storeToRefs } from 'pinia';
import { useCartStore } from '~/stores/cart';
import { useUser } from '~/composables/useUser';
export default defineComponent({
  name: 'Checkout',
  components: {
    SfButton,
    SfCallToAction,
    SfHeading,
    SfLoader,
    OrderSummary
  },
  layout: 'checkout',
  setup() {
    const router = useRouter();
    const { localePath } = useContext();
    const { cart } = storeToRefs(useCartStore());
    const { load: loadCart } = useCart();
    const { load: loadUser, logout } = useUser();
    const { load: loadWishlist } = useWishlist();
    const { search: searchUserOrder, loading: isOrderLoading } =
      useSearchOrderByCart();

    const isSuccess = ref(false);
    const isError = ref(false);
    const errorMessage = ref('');

    const order = ref(null);

    const onError = (err) => {
      if (err.payload?.message !== 'Invalid login attempt.') {
        document.querySelector('#checkout').innerHTML = '';
        isError.value = true;
      }
    };

    onMounted(async () => {
      await loadCart();
      await loadUser();

      const embeddedCheckoutUrl =
        cart.value?.redirect_urls?.embedded_checkout_url;

      const service = embedCheckout({
        containerId: 'checkout',
        url: embeddedCheckoutUrl,
        onComplete: async () => {
          document.querySelector('#checkout').innerHTML = '';
          isSuccess.value = true;

          if (cart.value) {
            order.value = await searchUserOrder({ cartId: cart.value.id });
          }

          await loadCart(true);
        },
        onError,
        onFrameError: onError,
        onSignOut: async () => {
          await logout();
          router.replace(localePath({ name: 'home' }));
        }
      });

      service.catch((err) => {
        if (err.type !== 'invalid_login') {
          isError.value = true;
          errorMessage.value = err.message;
        }
      });
    });

    onBeforeUnmount(async () => {
      await loadWishlist();
    });

    const continueShopping = async () => {
      router.replace(localePath({ name: 'home' }));
    };

    const tryAgain = async () => {
      window.location.reload();
    };

    return {
      continueShopping,
      tryAgain,
      isSuccess,
      isError,
      errorMessage,
      order,
      isOrderLoading
    };
  }
});
</script>

<style lang="scss" scoped>
.thank-you {
  width: 100%;

  &__error-heading {
    margin: var(--spacer-xl) 0;
  }
}

.banner {
  --call-to-action-color: var(--c-text);
  --call-to-action-title-font-size: var(--h2-font-size);
  --call-to-action-title-font-weight: var(--font-weight--semibold);
  --call-to-action-text-container-width: 50%;
  @include for-desktop {
    margin: 0 0 var(--spacer-xl) 0;
  }
  &__order-number {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--spacer-base);
    font: var(--font-weight--light) var(--font-size--sm) / 1.4
      var(--font-family--primary);
    @include for-desktop {
      flex-direction: row;
      margin-bottom: 0;
      font-size: var(--font-size--normal);
    }
  }
}

/*
 * Fix to the bug: https://github.com/vuestorefront/storefront-ui/issues/2366.
 * Bug is realted to @storefront-ui/core v0.13.0.
 * Images are passed by props to SfCalToAction component where they are assigned to scss vars, but in the wrong way.
 * This fix sets up mobile image for mobile devices and desktop image for desktop devices.
 */
.sf-call-to-action {
  background-image: var(--_call-to-action-background-image);
  @include for-desktop {
    background-image: var(
      --_call-to-action-background-desktop-image,
      --_call-to-action-background-image
    );
  }
}

#checkout {
  box-sizing: border-box;
  font-size: 1.5rem;
  text-align: center;
  @include for-desktop {
    max-width: 1240px;
    min-height: 600px;
    margin: 0 auto;
  }
}

.message {
  align-items: center;
  display: flex;
  flex-direction: column;
}
</style>
