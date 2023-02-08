<template>
  <div id='home'>
    <LazyHydrate when-idle>
      <SfHero class='hero'>
        <SfHeroItem
          v-for='(hero, i) in heroes'
          :key='i'
          :background='hero.background'
          :class='hero.className'
          :image='hero.image'
          :subtitle='hero.subtitle'
          :title='hero.title'
        />
      </SfHero>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <SfBannerGrid :banner-grid='1' class='banner-grid'>
        <template v-for='item in banners' #[item.slot]>
          <SfBanner
            :key='item.slot'
            :button-text='item.buttonText'
            :class='item.class'
            :description='item.description'
            :image='item.image'
            :link='localePath(item.link)'
            :subtitle='item.subtitle'
            :title='item.title'
          />
        </template>
      </SfBannerGrid>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <RelatedProducts
        v-if='products && products.length'
        :loading='loading'
        :products='products'
        :title="$t('Discover our new products')"
      />
    </LazyHydrate>

    <LazyHydrate when-visible>
      <SfCallToAction
        :button-text="$t('Subscribe')"
        :description="
          $t(
            'Be aware of upcoming sales and events. Receive gifts and special offers!'
          )
        "
        :image="{
          mobile: '/homepage/newsletter_mobile.webp',
          desktop: '/homepage/newsletter.webp'
        }"
        :title="$t('Subscribe to Newsletters')"
        class='call-to-action'
      >
        <template #button>
          <SfButton
            class='sf-call-to-action__button'
            data-testid='cta-button'
            @click='toggleNewsletterModal'
          >{{ $t('Subscribe') }}
          </SfButton
          >
        </template>
      </SfCallToAction>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <NewsletterModal @email-submitted='onSubscribe' />
    </LazyHydrate>
  </div>
</template>

<script>
import {
  SfHero,
  SfBanner,
  SfCallToAction,
  SfCarousel,
  SfProductCard,
  SfBannerGrid,
  SfHeading,
  SfArrow,
  SfButton
} from '@storefront-ui/vue';
import {
  defineComponent,
  useContext,
  useFetch,
  useMeta,
  ref
} from '@nuxtjs/composition-api';
import NewsletterModal from '~/components/NewsletterModal.vue';
import LazyHydrate from 'vue-lazy-hydration';
import { useUiState } from '~/composables';
import { useProduct } from '~/composables/useProduct';
import { useChannelStore } from '~/stores/channel';
import RelatedProducts from '~/components/RelatedProducts.vue';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'Home',
  components: {
    SfHero,
    SfBanner,
    SfCallToAction,
    SfCarousel,
    SfProductCard,
    SfBannerGrid,
    SfHeading,
    SfArrow,
    SfButton,
    NewsletterModal,
    LazyHydrate,
    RelatedProducts
  },
  setup() {
    const { localePath, i18n } = useContext();
    const { toggleNewsletterModal } = useUiState();
    const { seoMeta } = storeToRefs(useChannelStore());
    const products = ref([]);
    const { search, loading } = useProduct();
    useFetch(async () => {
      const productsResponse = await search({
        limit: 5,
        include: 'options,variants'
      });
      products.value = productsResponse.data;
    });

    const heroes = [
      {
        title: i18n.t('A good vibe starts at home.'),
        subtitle: '#lifestyle',
        background: '#eceff1',
        image: {
          mobile: '/homepage/bannerA_mobile.webp',
          desktop: '/homepage/bannerA.webp'
        },
        className:
          'sf-hero-item--position-bg-top-left sf-hero-item--align-right'
      },
      {
        title: i18n.t('Inspire yourself.'),
        subtitle: '#inspire',
        background: '#efebe9',
        image: {
          mobile: '/homepage/bannerB_mobile.webp',
          desktop: '/homepage/bannerB.webp'
        },
        className: ''
      },
      {
        title: i18n.t('Modern design in your home.'),
        subtitle: '#design',
        background: '#fce4ec',
        image: {
          mobile: '/homepage/bannerC_mobile.webp',
          desktop: '/homepage/bannerC.webp'
        },
        className:
          'sf-hero-item--position-bg-top-left sf-hero-item--align-right'
      }
    ];

    const banners = [
      {
        slot: 'banner-A',
        subtitle: i18n.t('Household items'),
        title: i18n.t('Decorate your home with carefully crafted accessories'),
        description: i18n.t(
          'As spring arrives, choose beautiful ornaments made of more sustainable materials that reduce our environmental impact.'
        ),
        buttonText: i18n.t('Shop now'),
        image: {
          mobile: '/homepage/banner_slim_mobile.webp',
          desktop: '/homepage/banner_slim.webp'
        },
        class: 'sf-banner--slim',
        link: localePath('/c/household-items')
      },
      {
        slot: 'banner-B',
        subtitle: i18n.t('Household items'),
        title: i18n.t('Invite joyful design into your home'),
        description: i18n.t(
          'The arrival of spring is the perfect opportunity to refresh your home decor with beautiful accessories and interesting designs.'
        ),
        buttonText: i18n.t('Shop now'),
        image: {
          mobile: '/homepage/banner_center_mobile.webp',
          desktop: '/homepage/banner_center.webp'
        },
        class: 'sf-banner--slim banner-central',
        link: localePath('/c/household-items')
      },
      {
        slot: 'banner-C',
        subtitle: i18n.t('Utility'),
        title: i18n.t('Simple changes for more sustainable living'),
        image: '/homepage/banner_simple.webp',
        class: 'sf-banner--slim banner__tshirt',
        link: localePath('/c/utility')
      },
      {
        slot: 'banner-D',
        subtitle: i18n.t('Utility'),
        title: i18n.t('Outstanding simplicity'),
        image: '/homepage/banner_outstanding.webp',
        class: 'sf-banner--slim',
        link: localePath('/c/utility')
      }
    ];

    const onSubscribe = (emailAddress) => {
      console.log(`Email ${emailAddress} was added to newsletter.`);
      toggleNewsletterModal();
    };

    useMeta({
      title: seoMeta.value?.page_title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: seoMeta.value?.page_title
        },
        {
          hid: 'description',
          name: 'description',
          content: seoMeta.value?.meta_description
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: seoMeta.value?.meta_description
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content:
            'https://res.cloudinary.com/vue-storefront/image/upload/v1649844828/Home%20page/opengraph_homepage.png'
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://demo.vuestorefront.io/'
        },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'twitter:card', property: 'twitter:card', content: 'summary' }
      ]
    });

    return {
      toggleNewsletterModal,
      onSubscribe,
      banners,
      heroes,
      products,
      loading,
      seoMeta
    };
  },
  head: {}
});
</script>

<style lang='scss' scoped>
#home {
  box-sizing: border-box;
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    max-width: 1240px;
    padding: 0;
    margin: 0 auto;
  }
}

.hero {
  margin: var(--spacer-xl) auto var(--spacer-lg);
  --hero-item-background-position: center;
  @include for-desktop {
    margin: var(--spacer-xl) auto var(--spacer-2xl);
  }

  .sf-hero-item {
    /*
     * Fix to the bug: https://github.com/vuestorefront/storefront-ui/issues/2365.
     * Bug is realted to @storefront-ui/core v0.13.0.
     * Images are passed by props to SfHero component where they are assigned to scss vars, but in the wrong way.
     * This fix sets up mobile image for mobile devices and desktop image for desktop devices.
     */
    background-image: var(
        --hero-item-background-image-mobile,
        --hero-item-background-image
    );
    @include for-desktop {
      background-image: var(--hero-item-background-image);
    }

    &:nth-child(even) {
      --hero-item-background-position: left;
      @include for-mobile {
        --hero-item-background-position: 30%;
        ::v-deep .sf-hero-item__subtitle,
        ::v-deep .sf-hero-item__title {
          text-align: right;
          width: 100%;
          padding-left: var(--spacer-sm);
        }
      }
    }
  }

  ::v-deep .sf-hero__control {
    &--right,
    &--left {
      display: none;
    }
  }
}

.banner-grid {
  --banner-container-width: 50%;
  margin: var(--spacer-xl) 0;

  ::v-deep .sf-link:hover {
    color: var(--c-white);
  }

  @include for-desktop {
    margin: var(--spacer-2xl) 0;
    ::v-deep .sf-link {
      --button-width: auto;
      text-decoration: none;
    }
  }
}

.banner {
  &__tshirt {
    background-position: left;
  }

  &-central {
    @include for-desktop {
      --banner-container-flex: 0 0 70%;
    }
  }
}

.similar-products {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacer-2xs);
  --heading-padding: 0;
  border-bottom: 1px var(--c-light) solid;
  @include for-desktop {
    border-bottom: 0;
    justify-content: center;
    padding-bottom: 0;
  }
}

.call-to-action {
  background-position: right;
  margin: var(--spacer-xs) 0;
  @include for-desktop {
    margin: var(--spacer-xl) 0 var(--spacer-2xl) 0;
  }
}

/*
 * Fix to the bug: https://github.com/vuestorefront/storefront-ui/issues/2366.
 * Bug is realted to @storefront-ui/core v0.13.0.
 * Images are passed by props to SfCalToAction component where they are assigned to scss vars, but in the wrong way.
 * This fix sets up mobile image for mobile devices and desktop image for desktop devices.
 */
.sf-call-to-action {
  background-image: var(--_call-to-action-background-image);
  @include for-desktop {
    background-image: var(
        --_call-to-action-background-desktop-image,
        --_call-to-action-background-image
    );
  }
}

.carousel {
  margin: 0 calc(0 - var(--spacer-sm)) 0 0;
  @include for-desktop {
    margin: 0;
  }

  &__item {
    margin: 1.375rem 0 2.5rem 0;
    @include for-desktop {
      margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
    }

    &__product {
      --product-card-add-button-transform: translate3d(0, 30%, 0);
    }
  }

  ::v-deep .sf-arrow--long .sf-arrow--right {
    --arrow-icon-transform: rotate(180deg);
    -webkit-transform-origin: center;
    transform-origin: center;
  }
}
</style>
