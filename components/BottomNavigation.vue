<template>
  <SfBottomNavigation class="navigation-bottom smartphone-only">
    <SfBottomNavigationItem
      :class="route.path == '/' ? 'sf-bottom-navigation__item--active' : ''"
      icon="home"
      size="20px"
      label="Home"
      @click="handleHomeClick"
    />
    <SfBottomNavigationItem
      icon="menu"
      size="20px"
      label="Menu"
      @click="toggleMobileMenu"
    />
    <SfBottomNavigationItem
      icon="heart"
      size="20px"
      label="Wishlist"
      @click="toggleWishlistSidebar"
      v-if="!isCheckoutPage"
    />
    <SfBottomNavigationItem
      icon="profile"
      size="20px"
      label="Account"
      @click="handleAccountClick"
    />
    <SfBottomNavigationItem
      label="Basket"
      icon="add_to_cart"
      @click="toggleCartSidebar"
      v-if="!isCheckoutPage"
    >
      <template #icon>
        <SfCircleIcon
          class="cart-button"
          aria-label="Add to cart"
          v-if="!isCheckoutPage"
        >
          <SfIcon
            icon="add_to_cart"
            color="white"
            size="25px"
            :style="{ margin: '0 0 0 -2px' }"
          />
          <SfBadge v-if="cartTotalItems" class="sf-badge--number cart-badge">{{
            cartTotalItems
          }}</SfBadge>
        </SfCircleIcon>
      </template>
    </SfBottomNavigationItem>
  </SfBottomNavigation>
</template>

<script>
import {
  SfBottomNavigation,
  SfIcon,
  SfCircleIcon,
  SfBadge
} from '@storefront-ui/vue';
import {
  computed,
  defineComponent,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api';
import { storeToRefs } from 'pinia';
import { useUiState } from '~/composables';
import { useCustomerStore, useCartStore } from '~/stores';

export default defineComponent({
  components: {
    SfBottomNavigation,
    SfIcon,
    SfCircleIcon,
    SfBadge
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const routeName = computed(() => route.value.name);
    const {
      toggleCartSidebar,
      toggleWishlistSidebar,
      toggleLoginModal,
      toggleMobileMenu,
      isMobileMenuOpen
    } = useUiState();
    const { isAuthenticated } = storeToRefs(useCustomerStore());

    const { getTotalItems: cartTotalItems } = storeToRefs(useCartStore());
    const isCheckoutPage = computed(() => {
      return Boolean(routeName.value) && routeName.value.includes('checkout');
    });
    const handleAccountClick = async () => {
      if (isAuthenticated.value) {
        return router.push('/my-account');
      }

      toggleLoginModal();
    };

    const handleHomeClick = () => {
      isMobileMenuOpen.value && toggleMobileMenu();
      router.push('/');
    };

    return {
      route,
      isMobileMenuOpen,
      toggleWishlistSidebar,
      toggleCartSidebar,
      toggleMobileMenu,
      cartTotalItems,
      handleAccountClick,
      handleHomeClick,
      isCheckoutPage
    };
  }
});
</script>

<style lang="scss" scoped>
.navigation-bottom {
  --bottom-navigation-z-index: 3;
}
.cart-button {
  position: relative;
}
.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
