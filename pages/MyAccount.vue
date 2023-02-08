<template>
  <div id="my-account">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <SfContentPages
      v-e2e="'my-account-content-pages'"
      title="My Account"
      :active="activePage"
      class="my-account"
      @click:change="changeActivePage"
    >
      <SfContentCategory title="Personal Details">
        <SfContentPage title="My profile">
          <MyProfile />
        </SfContentPage>

        <SfContentPage title="Shipping details">
          <ShippingDetails />
        </SfContentPage>

        <SfContentPage title="My newsletter">
          <MyNewsletter />
        </SfContentPage>
      </SfContentCategory>

      <SfContentCategory title="Order details">
        <SfContentPage title="Order history">
          <OrderHistory />
        </SfContentPage>
      </SfContentCategory>

      <SfContentPage title="Log out" />
    </SfContentPages>
  </div>
</template>

<script>
import { SfBreadcrumbs, SfContentPages } from '@storefront-ui/vue';
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api';
import MyProfile from './MyAccount/MyProfile';
import ShippingDetails from './MyAccount/ShippingDetails';
import MyNewsletter from './MyAccount/MyNewsletter';
import OrderHistory from './MyAccount/OrderHistory';
import { useUser } from '../composables/useUser';
export default defineComponent({
  name: 'MyAccount',
  components: {
    SfBreadcrumbs,
    SfContentPages,
    MyProfile,
    ShippingDetails,
    MyNewsletter,
    OrderHistory
  },
  middleware: ['is-authenticated'],
  setup() {
    const { i18n, localePath } = useContext();
    const route = useRoute();
    const router = useRouter();
    const { logout } = useUser();
    const activePage = computed(() => {
      const pageName = computed(() => route.value.params.pageName);

      if (pageName.value) {
        return (
          pageName.value.charAt(0).toUpperCase() + pageName.value.slice(1)
        ).replace('-', ' ');
      }

      return 'My profile';

    });
    const breadcrumbs = ref([
      {
        text: i18n.t('Home'),
        link: localePath({ name: 'home' })
      },
      {
        text: i18n.t('My Account'),
        link: localePath({ name: 'my-account' })
      },
      { text: i18n.t(activePage.value), link: '#' }
    ]);

    const changeActivePage = async (title) => {
      if (title === 'Log out') {
        await logout();
        router.push(localePath({ name: 'home' }));
        return;
      }

      const slugifiedTitle = (title || '').toLowerCase().replace(' ', '-');
      const transformedPath = `/my-account/${slugifiedTitle}`;
      const localeTransformedPath = localePath(transformedPath);

      router.push(localeTransformedPath);
    };

    return { changeActivePage, activePage, breadcrumbs };
  }
});
</script>

<style lang="scss" scoped>
#my-account {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.my-account {
  @include for-mobile {
    --content-pages-sidebar-category-title-font-weight: var(
      --font-weight--normal
    );
    --content-pages-sidebar-category-title-margin: var(--spacer-sm)
      var(--spacer-sm) var(--spacer-sm) var(--spacer-base);
  }
  @include for-desktop {
    --content-pages-sidebar-category-title-margin: var(--spacer-xl) 0 0 0;
  }
}
.breadcrumbs {
  margin: var(--spacer-base) 0 var(--spacer-lg);
}
</style>
