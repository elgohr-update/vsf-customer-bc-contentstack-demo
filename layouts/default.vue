<template>
  <div>
    <LazyHydrate when-visible>
      <TopBar class="desktop-only" />
    </LazyHydrate>
    <LazyHydrate when-idle>
      <AppHeader />
    </LazyHydrate>

    <div id="layout">
      <nuxt :key="route.fullPath" />
      <LazyHydrate when-visible>
        <BottomNavigation />
      </LazyHydrate>
      <FilterSidebar />
      <CartSidebar />
      <WishlistSidebar />
      <LoginModal />
      <Notification />
    </div>
    <LazyHydrate when-visible>
      <AppFooter />
    </LazyHydrate>
    <div id="root-modal"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  useAsync,
  useRoute,
  watch,
  toRefs
} from '@nuxtjs/composition-api';
import { SfOverlay } from '@storefront-ui/vue';
import AppHeader from '~/components/AppHeader.vue';
import BottomNavigation from '~/components/BottomNavigation.vue';
import AppFooter from '~/components/AppFooter.vue';
import TopBar from '~/components/TopBar.vue';
import CartSidebar from '~/components/CartSidebar.vue';
import FilterSidebar from '~/components/FilterSidebar.vue';
import WishlistSidebar from '~/components/WishlistSidebar.vue';
import LoginModal from '~/components/LoginModal.vue';
import LazyHydrate from 'vue-lazy-hydration';
import Notification from '~/components/Notification.vue';
import { useCustomerStore } from '~/stores/customer';
import {
  useWishlist,
  useCategory,
  useChannel,
  useCart,
  useUser
} from '~/composables';

export default defineComponent({
  name: 'DefaultLayout',

  components: {
    LazyHydrate,
    TopBar,
    AppHeader,
    BottomNavigation,
    AppFooter,
    CartSidebar,
    WishlistSidebar,
    LoginModal,
    Notification,
    SfOverlay,
    FilterSidebar
  },

  setup() {
    const route = useRoute();
    const { isAuthenticated } = toRefs(useCustomerStore());
    const { load: loadCart } = useCart();
    const { load: loadWishlist } = useWishlist();
    const { loadCategoryTreeList } = useCategory();
    const { load: loadChannel } = useChannel();
    const { load: loadUser } = useUser();

    useAsync(() => Promise.all([loadChannel(), loadCategoryTreeList()]));

    onMounted(async () => {
      await loadUser();
      await loadCart();
      await loadWishlist();
    });

    watch(isAuthenticated, () => {
      loadWishlist();
    });

    return {
      route
    };
  },
  head: {
    link: [
      { rel: 'preload', href: '/fonts/fonts.css', as: 'style' },
      { rel: 'stylesheet', href: '/fonts/fonts.css' }
    ]
  }
});
</script>

<style lang="scss">
@import '~@storefront-ui/vue/styles';

#layout {
  box-sizing: border-box;
  min-height: 100vh;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
  > .sf-loader {
    min-height: 100vh;
  }
}

.no-scroll {
  overflow: hidden;
  height: 100vh;
}

// Reset CSS
html {
  width: auto;
  @include for-mobile {
    overflow-x: hidden;
  }
}
body {
  overflow-x: hidden;
  color: var(--c-text);
  font-size: var(--font-size--base);
  font-family: var(--font-family--primary);
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
  color: var(--c-link);
  &:hover {
    color: var(--c-link-hover);
  }
}
h1 {
  font-family: var(--font-family--secondary);
  font-size: var(--h1-font-size);
  line-height: 1.6;
  margin: 0;
}
h2 {
  font-family: var(--font-family--secondary);
  font-size: var(--h2-font-size);
  line-height: 1.6;
  margin: 0;
}
h3 {
  font-family: var(--font-family--secondary);
  font-size: var(--h3-font-size);
  line-height: 1.6;
  margin: 0;
}
h4 {
  font-family: var(--font-family--secondary);
  font-size: var(--h4-font-size);
  line-height: 1.6;
  margin: 0;
}
.sf-content-pages__section.is-active .sf-component-select__dropdown,
.sf-content-pages__section.is-active .sf-overlay,
.sf-content-pages__section.is-active .sf-modal__container {
  @include for-mobile {
    transform: translate3d(100%, 0, 0);
  }
}
.sf-component-select__cancel {
  @include for-mobile {
    display: none;
  }
}
.sf-button .sf-tabs__chevron {
  display: var(--tabs-chevron-display);
}
</style>
