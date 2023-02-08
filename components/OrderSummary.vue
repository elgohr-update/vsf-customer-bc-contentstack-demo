<template>
  <div class="order-summary">
    <SfOrderReview :order="orderInfo" :characteristics="[]" buttonText="">
      <template #heading>
        <span />
      </template>
      <template #promo>
        <span />
      </template>
    </SfOrderReview>

    <OrderProducts :order="order" />
  </div>
</template>

<script lang="ts">
import { OrderByCartResponse } from '@vsf-enterprise/bigcommerce-api';
import { defineComponent } from '@nuxtjs/composition-api';
import { SfOrderReview } from '@storefront-ui/vue';
import OrderProducts from '~/components/OrderProducts.vue';
import { mapOrderSummary } from '~/composables/useOrder/helpers';

export default defineComponent({
  name: 'OrderSummary',

  components: {
    OrderProducts,
    SfOrderReview
  },

  props: {
    order: {
      type: Object as () => OrderByCartResponse,
      required: true
    }
  },

  setup(props) {
    const order = mapOrderSummary(props.order);

    return {
      orderInfo: order
    };
  }
});
</script>

<style lang="scss" scoped>
.order-summary {
  width: 100%;

  @include for-mobile {
    margin: var(--spacer-sm);
  }
}
</style>
