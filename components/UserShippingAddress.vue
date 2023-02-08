<template>
  <div v-if="address">
    <div>
      {{ address.first_name }}
      {{ address.last_name }}
      {{ address.phone }}
    </div>
    <div>
      <strong>{{ address.address1 }}</strong>
      {{ address.address1 }}
    </div>
    <div>
      {{ address.city }}
      {{ address.state_or_province }}
      {{ address.postal_code }},
      {{ address.country }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import { UserAddress } from '@vsf-enterprise/bigcommerce-api';

export default defineComponent({
  name: 'UserShippingAddress',
  props: {
    address: {
      type: Object as PropType<UserAddress>
    }
  }
});
</script>
