<template>
  <div class="header-navigation">
    <div class="sf-header__navigation desktop-only">
      <SfHeaderNavigationItem
        v-for="category in categories"
        :key="category.key"
        class="nav-item"
        data-e2e="`app-header-url_${category.key}`"
        :label="category.label"
        :link="localePath(`/c${category.slug}`)"
      />
    </div>
    <SfModal class="smartphone-only" :visible="isMobileMenuOpen">
      <SfList>
        <SfListItem
          v-for="category in categories"
          :key="category.key"
          class="nav-item sf-header-navigation-item"
          v-e2e="`app-header-url_${category.key}`"
        >
          <SfMenuItem
            :label="category.label"
            class="sf-header-navigation-item__menu-item"
            :link="localePath(`/c${category.slug}`)"
            @click.native="toggleMobileMenu"
          />
        </SfListItem>
      </SfList>
    </SfModal>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, useRouter } from '@nuxtjs/composition-api';
import { SfMenuItem, SfModal, SfList } from '@storefront-ui/vue';
import { SearchResultNavigationItem } from '~/composables/types';
import { useUiState } from '~/composables';

export default defineComponent({
  name: 'HeaderNavigation',
  components: {
    SfMenuItem,
    SfModal,
    SfList
  },
  props: {
    categories: {
      type: Array as PropType<Array<SearchResultNavigationItem>>,
      default: () => []
    }
  },
  setup() {
    const router = useRouter();
    const { isMobileMenuOpen, toggleMobileMenu } = useUiState();

    const navigate = (path) => {
      toggleMobileMenu();
      router.push(path);
    };

    return {
      isMobileMenuOpen,
      toggleMobileMenu,
      navigate
    };
  }
});
</script>

<style lang="scss" scoped>
.sf-header-navigation-item {
  ::v-deep &__item--mobile {
    display: block;
  }
}
.sf-list__item {
  @include for-mobile {
    display: block;
  }
}
.sf-modal {
  ::v-deep &__bar {
    display: none;
  }
  ::v-deep &__content {
    padding: var(--modal-content-padding, var(--spacer-base) 0);
  }
}
</style>
