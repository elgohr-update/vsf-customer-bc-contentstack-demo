<template>
  <SfTabs :open-tab="1">
    <SfTab title="My orders">
      <div class="current-order" v-if="currentOrder">
        <SfButton
          class="sf-button--text all-orders"
          @click="currentOrder = null"
          >All Orders</SfButton
        >
        <div class="highlighted highlighted--total">
          <SfProperty
            name="Order ID"
            :value="currentOrder.id"
            class="sf-property--full-width property"
          />
          <SfProperty
            name="Date"
            :value="formatDateString(currentOrder.date_created, 'long')"
            class="sf-property--full-width property"
          />
          <SfProperty
            name="Status"
            :value="currentOrder.status"
            class="sf-property--full-width property"
          />
          <SfProperty
            name="Total"
            :value="$n(parseOrderItemTotalPrice(currentOrder), 'currency')"
            class="sf-property--full-width property"
          />
        </div>
        <SfLoader :loading="isOrderProductsLoading">
          <SfTable class="products">
            <SfTableHeading>
              <SfTableHeader class="products__name">{{
                $t('Product')
              }}</SfTableHeader>
              <SfTableHeader>{{ $t('Quantity') }}</SfTableHeader>
              <SfTableHeader>{{ $t('Price') }}</SfTableHeader>
            </SfTableHeading>
            <SfTableRow v-for="(item, i) in orderProducts" :key="i">
              <SfTableData class="products__name">
                <nuxt-link
                  :to="
                    localePath({
                      name: 'product',
                      params: {
                        id: item.product_id,
                        slug: item.sku
                      }
                    })
                  "
                >
                  {{ item.name }}
                </nuxt-link>
              </SfTableData>
              <SfTableData>{{ item.quantity }}</SfTableData>
              <SfTableData>{{
                $n(parseOrderItemTotalPrice(item), 'currency')
              }}</SfTableData>
            </SfTableRow>
          </SfTable>
        </SfLoader>
      </div>
      <div v-else>
        <p class="message">
          {{ $t('Details and status orders') }}
        </p>
        <div v-if="orders.length === 0" class="no-orders">
          <p class="no-orders__title">
            {{ $t('You currently have no orders') }}
          </p>
          <nuxt-link :to="localePath({ name: 'home' })">
            <SfButton class="no-orders__button">{{
              $t('Start shopping')
            }}</SfButton>
          </nuxt-link>
        </div>
        <div v-else>
          <SfTable class="orders">
            <SfTableHeading>
              <SfTableHeader
                v-for="tableHeader in tableHeaders"
                :key="tableHeader"
                >{{ $t(tableHeader) }}</SfTableHeader
              >
              <SfTableHeader class="orders__element--right" />
            </SfTableHeading>
            <SfTableRow v-for="order in orders" :key="order.id">
              <SfTableData v-e2e="'order-number'">{{ order.id }}</SfTableData>
              <SfTableData>{{
                formatDateString(order.date_created, 'long')
              }}</SfTableData>
              <SfTableData>{{
                $n(parseOrderItemTotalPrice(order), 'currency')
              }}</SfTableData>
              <SfTableData>
                <span :class="getStatusTextClass(order)">{{
                  order.status
                }}</span>
              </SfTableData>
              <SfTableData class="orders__view orders__element--right">
                <SfButton
                  class="sf-button--text desktop-only"
                  @click="handleDetailsClick(order)"
                >
                  {{ $t('View details') }}
                </SfButton>
              </SfTableData>
            </SfTableRow>
          </SfTable>
          <p>Total orders - {{ totalOrders }}</p>
        </div>
      </div>
    </SfTab>
    <SfTab title="Returns">
      <p class="message">
        This feature is not implemented yet! Please take a look at
        <br />
        <SfLink
          class="message__link"
          link="https://github.com/vuestorefront/vue-storefront/issues"
          >https://github.com/vuestorefront/vue-storefront/issues</SfLink
        >
        for our Roadmap!
      </p>
    </SfTab>
  </SfTabs>
</template>

<script lang="ts">
import {
  SfTabs,
  SfTable,
  SfButton,
  SfProperty,
  SfLink,
  SfLoader
} from '@storefront-ui/vue';
import {
  computed,
  defineComponent,
  onMounted,
  ref
} from '@nuxtjs/composition-api';
import { parseOrderItemTotalPrice } from '~/composables/useOrder/helpers';
import { useUiHelpers, useOrder, useOrderProducts } from '~/composables';
import { Order } from '@vsf-enterprise/bigcommerce-api';
import { OrderStatus } from '~/composables/useOrder/types';

export default defineComponent({
  name: 'PersonalDetails',
  components: {
    SfTabs,
    SfTable,
    SfButton,
    SfProperty,
    SfLink,
    SfLoader
  },
  setup() {
    const { formatDateString } = useUiHelpers();
    const orders = ref<Order[]>([]);
    const { search } = useOrder();
    const currentOrder = ref<Order>(null);
    const orderProducts = ref(null);
    const { search: searchOrderProducts, loading: isOrderProductsLoading } =
      useOrderProducts();

    onMounted(async () => {
      orders.value = await search();
    });

    const tableHeaders = ['Order ID', 'Payment date', 'Amount', 'Status'];

    const getStatusTextClass = (order) => {
      const status = order?.status;
      switch (status) {
        case OrderStatus.Open:
          return 'text-warning';
        case OrderStatus.Complete:
          return 'text-success';
        default:
          return '';
      }
    };

    const handleDetailsClick = async (order: Order) => {
      currentOrder.value = order;

      orderProducts.value = await searchOrderProducts({
        orderId: order.id
      });
    };

    return {
      tableHeaders,
      orders: computed(() => orders.value ?? []),
      totalOrders: computed(() => orders.value.length ?? 0),
      getStatusTextClass,
      formatDateString,
      currentOrder,
      orderProducts,
      parseOrderItemTotalPrice,
      isOrderProductsLoading,
      handleDetailsClick
    };
  }
});
</script>

<style lang="scss" scoped>
.no-orders {
  &__title {
    margin: 0 0 var(--spacer-lg) 0;
    font: var(--font-weight--normal) var(--font-size--base) / 1.6
      var(--font-family--primary);
  }
  &__button {
    --button-width: 100%;
    @include for-desktop {
      --button-width: 17, 5rem;
    }
  }
}
.orders {
  @include for-desktop {
    &__element {
      &--right {
        --table-column-flex: 1;
        text-align: right;
      }
    }
  }
}
.all-orders {
  --button-padding: var(--spacer-base) 0;
}
.message {
  margin: 0 0 var(--spacer-xl) 0;
  font: var(--font-weight--light) var(--font-size--base) / 1.6
    var(--font-family--primary);
  &__link {
    color: var(--c-primary);
    font-weight: var(--font-weight--medium);
    font-family: var(--font-family--primary);
    font-size: var(--font-size--base);
    text-decoration: none;
    &:hover {
      color: var(--c-text);
    }
  }
}
.product {
  &__properties {
    margin: var(--spacer-xl) 0 0 0;
  }
  &__property,
  &__action {
    font-size: var(--font-size--sm);
  }
  &__action {
    color: var(--c-gray-variant);
    font-size: var(--font-size--sm);
    margin: 0 0 var(--spacer-sm) 0;
    &:last-child {
      margin: 0;
    }
  }
  &__qty {
    color: var(--c-text);
  }
}
.products {
  --table-column-flex: 1;
  &__name {
    margin-right: var(--spacer-sm);
    @include for-desktop {
      --table-column-flex: 2;
    }
  }
}
.highlighted {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--c-light);
  padding: var(--spacer-sm);
  --property-value-font-size: var(--font-size--base);
  --property-name-font-size: var(--font-size--base);
  &:last-child {
    margin-bottom: 0;
  }
  ::v-deep .sf-property__name {
    white-space: nowrap;
  }
  ::v-deep .sf-property__value {
    text-align: right;
  }
  &--total {
    margin-bottom: var(--spacer-sm);
  }
  @include for-desktop {
    padding: var(--spacer-xl);
    --property-name-font-size: var(--font-size--lg);
    --property-name-font-weight: var(--font-weight--medium);
    --property-value-font-size: var(--font-size--lg);
    --property-value-font-weight: var(--font-weight--semibold);
  }
}
.sf-loader__spinner {
  margin-top: 3rem;
}
</style>
