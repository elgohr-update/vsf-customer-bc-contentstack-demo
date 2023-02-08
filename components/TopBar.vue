<template>
  <SfTopBar class="topbar">
    <template #left>
      <SfButton class="sf-button--text">{{
        $t('Help & FAQs')
      }}</SfButton>
    </template>
    <template #center>
      <p>{{ $t('Download our application.') }}</p>
      <SfButton class="topbar__button sf-button--text">{{
        $t('Find out more')
      }}</SfButton>
    </template>
    <template #right>
      <div v-if="!isCheckoutPage">
        <LocaleSelector />
      </div>
    </template>
  </SfTopBar>
</template>

<script>
import { SfButton, SfTopBar } from '@storefront-ui/vue';
import LocaleSelector from '~/components/LocaleSelector.vue';
import { defineComponent, useRoute, computed } from '@nuxtjs/composition-api';

export default defineComponent({
  components: {
    SfTopBar,
    SfButton,
    LocaleSelector
  },
  setup() {
    const route = useRoute();
    const routeName = computed(() => route.value.name);
    const isCheckoutPage = computed(() => {
      return Boolean(routeName.value) && routeName.value.includes('checkout');
    });

    return {
      route,
      isCheckoutPage
    };
  }
});
</script>
<style lang="scss" scoped>
.topbar {
  position: relative;
  z-index: 2;
  &__button {
    margin: 0 0 0 var(--spacer-xs);
  }
}
</style>
