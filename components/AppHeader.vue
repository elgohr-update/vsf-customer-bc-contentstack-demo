<template>
  <div v-click-outside="closeSearch">
    <SfHeader
      class="sf-header--has-mobile-search"
      :class="{ 'header-on-top': isSearchOpen }"
      :isNavVisible="isMobileMenuOpen"
    >
      <!-- TODO: add mobile view buttons after SFUI team PR -->
      <template #logo>
        <nuxt-link :to="localePath({ name: 'home' })" class="sf-header__logo">
          <SfImage
            src="/icons/logo.svg"
            alt="Vue Storefront Next"
            class="sf-header__logo-image"
            :width="34"
            :height="34"
            @click="closeSearch"
          />
        </nuxt-link>
      </template>
      <template #navigation>
        <HeaderNavigation :categories="navigation" />
      </template>
      <template #aside>
        <div @click="closeSearch" v-if="!isCheckoutPage">
          <LocaleSelector class="smartphone-only" />
        </div>
      </template>
      <template #header-icons>
        <div
          v-e2e="'header-icons'"
          class="sf-header__icons"
          @click="closeSearch"
        >
          <SfButton
            class="sf-button--pure sf-header__action"
            aria-label="Open account button"
            @click="handleAccountClick"
          >
            <SfIcon
              class="sf-header__icon"
              :icon="accountIcon"
              size="1.25rem"
            />
          </SfButton>
          <SfButton
            v-if="!isCheckoutPage"
            class="sf-button--pure sf-header__action"
            aria-label="Toggle wishlist sidebar"
            @click="toggleWishlistSidebar"
          >
            <SfIcon
              class="sf-header__icon"
              :icon="wishlistTotalItems ? 'heart_fill' : 'heart'"
              size="1.25rem"
            />
            <SfBadge v-if="wishlistTotalItems" class="sf-badge--number badge">
              {{ wishlistTotalItems }}
            </SfBadge>
          </SfButton>
          <SfButton
            v-if="!isCheckoutPage"
            class="sf-button--pure sf-header__action"
            aria-label="Toggle cart sidebar"
            data-e2e="app-header-cart"
            @click="toggleCartSidebar"
          >
            <SfIcon class="sf-header__icon" icon="empty_cart" size="1.25rem" />
            <SfBadge
              :style="{ display: cartTotalItems ? 'block' : 'none' }"
              class="sf-badge--number badge"
              >{{ cartTotalItems }}</SfBadge
            >
          </SfButton>
        </div>
      </template>
      <template #search>
        <SfSearchBar
          ref="searchBarRef"
          :placeholder="$t('Search for items')"
          aria-label="Search"
          class="sf-header__search"
          :class="{ 'search-hidden': isCheckoutPage }"
          :value="term"
          @input="handleSearch"
          @keyup.enter="handleSearch($event)"
          @focus="isSearchOpen = true"
          @keydown.esc="closeSearch"
          :icon="searchBarIcon"
          @click:icon="onSearchBarIconClick"
        />
      </template>
    </SfHeader>
    <SearchResults
      v-if="!isCheckoutPage"
      :visible="isSearchOpen"
      :result="result"
      :loading="loading"
      :search-input="term"
      @close="closeSearch"
    />
    <SfOverlay :visible="isSearchOpen" @click="closeSearch" />
  </div>
</template>

<script>
import {
  SfHeader,
  SfImage,
  SfIcon,
  SfButton,
  SfBadge,
  SfSearchBar,
  SfOverlay
} from '@storefront-ui/vue';
import { useUiState } from '~/composables';
import {
  computed,
  defineComponent,
  ref,
  watch,
  useRoute,
  useRouter,
  useContext
} from '@nuxtjs/composition-api';
import { useUiHelpers } from '~/composables';
import LocaleSelector from '~/components/LocaleSelector.vue';
import SearchResults from '~/components/SearchResults.vue';
import HeaderNavigation from '~/components/HeaderNavigation.vue';
import { clickOutside } from '@storefront-ui/vue/src/utilities/directives/click-outside/click-outside-directive.js';
import debounce from 'lodash.debounce';
import { useProduct } from '~/composables/useProduct';
import { getTotalItems as wishlistGetTotalItems } from '~/composables/useWishlist/helpers';
import { storeToRefs } from 'pinia';
import { useCustomerStore } from '~/stores/customer';
import { useWishlistStore } from '~/stores/wishlist';
import { useCartStore } from '~/stores/cart';
import { useCategory } from '~/composables/useCategory';
import { useCategoryTreeStore } from '~/stores/categoryTree';

export default defineComponent({
  components: {
    SfHeader,
    SfImage,
    LocaleSelector,
    SfIcon,
    SfButton,
    SfBadge,
    SfSearchBar,
    SearchResults,
    SfOverlay,
    HeaderNavigation
  },
  directives: { clickOutside },
  setup() {
    const { localePath } = useContext();
    const { search, loading } = useProduct();
    const router = useRouter();
    const route = useRoute();
    const routeName = computed(() => route.value.name);
    const {
      toggleCartSidebar,
      toggleWishlistSidebar,
      toggleLoginModal,
      isMobileMenuOpen
    } = useUiState();
    const { getFacetsFromURL } = useUiHelpers();
    const { getTotalItems: cartTotalItems } = storeToRefs(useCartStore());
    const { isAuthenticated } = storeToRefs(useCustomerStore());
    const { wishlist } = storeToRefs(useWishlistStore());
    const term = ref(getFacetsFromURL().term);
    const isSearchOpen = ref(false);
    const searchBarRef = ref(null);
    const result = ref({});

    const categoryTreeStore = useCategoryTreeStore();
    const { buildSearchCategories } = useCategory();
    const navigation = computed(() =>
      categoryTreeStore.listOfRootBranches?.map((rootLevel) => ({
        key: rootLevel.id,
        label: rootLevel.name,
        slug: rootLevel.url
      }))
    );

    const isCheckoutPage = computed(() => {
      return Boolean(routeName.value) && routeName.value.includes('checkout');
    });
    const wishlistTotalItems = computed(() =>
      wishlistGetTotalItems(wishlist.value)
    );

    const accountIcon = computed(() =>
      isAuthenticated.value ? 'profile_fill' : 'profile'
    );

    // TODO: https://github.com/vuestorefront/vue-storefront/issues/4927
    const handleAccountClick = async () => {
      if (isAuthenticated.value) {
        const localeAccountPath = localePath({ name: 'my-account' });
        return router.push(localeAccountPath);
      }

      toggleLoginModal();
    };

    const closeSearch = () => {
      if (!isSearchOpen.value) return;
      term.value = '';
      isSearchOpen.value = false;
    };

    const handleSearch = debounce(async (paramValue) => {
      if (!paramValue.target) {
        term.value = paramValue;
      } else {
        term.value = paramValue.target.value;
      }

      const products = await search({
        'keyword:like:': term.value.trim(),
        include: 'options,variants'
      });

      const categories = buildSearchCategories(products.data);

      result.value = { products: products.data, categories };
    }, 1000);

    const clearAndFocusSearchBar = () => {
      term.value = '';
      return searchBarRef.value.$el.children[0]?.children[0]?.focus();
    };

    const searchBarIcon = computed(() =>
      term.value
        ? { icon: 'cross', color: 'var(--c-text)', size: '18px' }
        : { icon: 'search', color: 'var(--c-text)', size: '20px' }
    );

    const onSearchBarIconClick = computed(() =>
      term.value
        ? clearAndFocusSearchBar
        : () => (isSearchOpen.value = !isSearchOpen.value)
    );
    watch(
      () => route.value.fullPath,
      () => {
        closeSearch();
      }
    );

    return {
      accountIcon,
      cartTotalItems,
      handleAccountClick,
      toggleCartSidebar,
      toggleWishlistSidebar,
      term,
      isSearchOpen,
      isCheckoutPage,
      closeSearch,
      handleSearch,
      navigation,
      loading,
      result,
      clearAndFocusSearchBar,
      searchBarRef,
      isMobileMenuOpen,
      wishlistTotalItems,
      searchBarIcon,
      onSearchBarIconClick
    };
  }
});
</script>

<style lang="scss" scoped>
.sf-header {
  --header-padding: var(--spacer-sm);
  @include for-desktop {
    --header-padding: 0;
  }
  &__logo-image {
    height: 100%;
  }
}
.header-on-top {
  z-index: 2;
}
.nav-item {
  --header-navigation-item-margin: 0 var(--spacer-base);
  .sf-header-navigation-item__item--mobile {
    display: none;
  }
}

.badge {
  position: absolute;
  bottom: 40%;
  left: 40%;
}

.search-hidden {
  display: none;
}

.sf-search-bar {
  flex-grow: 0;
}
</style>
