<template>
  <div class="sf-confirm-order">
    <SfTable class="sf-table--bordered sf-confirm-order__table">
      <SfTableHeading class="sf-confirm-order__table-row">
        <SfTableHeader
          v-for="tableHeader in tableHeaders"
          :key="tableHeader"
          class="sf-confirm-order__table-header"
          >{{ $t(tableHeader) }}
        </SfTableHeader>
      </SfTableHeading>
      <SfTableRow
        v-for="(product, index) in orderInfo.products"
        :key="index"
        class="sf-confirm-order__table-row"
        data-testid="product-table-row"
      >
        <SfTableData
          class="sf-confirm-order__table-data"
          data-testid="product-description-table-data"
        >
          <div class="sf-confirm-order__product-title">
            {{ product.name }}
          </div>
          <div class="sf-confirm-order__product-sku">
            {{ $t('SKU') }}: {{ product.sku }}
          </div>
          <SfProperty
            v-for="(attribute, key) in getItemAttributes(product)"
            :key="key"
            :name="key"
            :value="attribute"
            class="order-products__property"
          />
        </SfTableData>
        <SfTableData class="sf-confirm-order__table-data">{{
          product.quantity
        }}</SfTableData>
        <SfTableData class="sf-confirm-order__table-data">
          <SfPrice
            :regular="$n(parseOrderItemPrice(product), 'currency')"
            class="sf-confirm-order__product-price"
          />
        </SfTableData>
      </SfTableRow>
    </SfTable>

    <div class="sf-confirm-order__totals">
      <SfProperty
        :name="$t(propertiesNames[0])"
        :value="$n(parseFloat(orderInfo.subtotal), 'currency')"
        class="
          sf-property--full-width
          sf-confirm-order__property sf-confirm-order__property-subtotal
        "
      />
      <SfProperty
        :name="$t(propertiesNames[1])"
        :value="$n(parseFloat(orderInfo.shipping.cost), 'currency')"
        class="sf-property--full-width sf-confirm-order__property"
      />
      <SfDivider class="sf-confirm-order__divider" />
      <SfProperty
        :name="$t(propertiesNames[2])"
        :value="$n(parseFloat(orderInfo.total), 'currency')"
        class="
          sf-property--full-width sf-property--large
          sf-confirm-order__property-total
        "
      />
    </div>
  </div>
</template>

<script lang="ts">
import { OrderByCartResponse } from '@vsf-enterprise/bigcommerce-api';
import { defineComponent } from '@nuxtjs/composition-api';
import { SfTable, SfDivider, SfPrice, SfProperty } from '@storefront-ui/vue';
import {
  mapOrderSummary,
  parseOrderItemPrice,
  getItemAttributes
} from '~/composables/useOrder/helpers';

export default defineComponent({
  name: 'OrderProducts',

  components: {
    SfTable,
    SfDivider,
    SfPrice,
    SfProperty
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
      orderInfo: order,
      parseOrderItemPrice,
      getItemAttributes,
      tableHeaders: ['Item Description', 'Quantity', 'Amount'],
      propertiesNames: ['Subtotal', 'Shipping', 'Total price']
    };
  }
});
</script>

<style lang="scss" scoped>
@import '~@storefront-ui/shared/styles/components/templates/SfConfirmOrder.scss';
.sf-confirm-order__table {
  @include for-mobile {
    width: calc(var(--table-width, 100%) - var(--spacer-sm) * 2);
  }
}

.sf-property--full-width,
.sf-confirm-order__divider {
  @include for-mobile {
    width: calc(100% - var(--spacer-sm) * 2);
  }
}

.order-products {
  &__property {
    .sf-property__name,
    .sf-property__value {
      font-family: var(--font-family--primary);
      color: var(--c-text-muted);
      font-weight: normal;
    }
  }
}
</style>
