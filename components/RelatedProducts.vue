<template>
  <SfSection :title-heading="title" class="section">
    <SfLoader :class="{ loading }" :loading="loading">
      <SfCarousel
        :settings="{ gap: 16, breakpoints: { 1023: { peek: 0, perView: 2 } } }"
        class="carousel"
      >
        <SfCarouselItem
          class="carousel__item"
          v-for="(product, i) in products"
          :key="i"
        >
          <SfProductCard
            :title="product.name"
            :image="getCoverImageUrl(product)"
            :regular-price="$n(createPriceObject(product).regular, 'currency')"
            :special-price="
              createPriceObject(product).special &&
              $n(createPriceObject(product).special, 'currency')
            "
            :isInWishlist="
              isInWishlist(
                product
              )
            "
            :show-add-to-cart-button="true"
            :addToCartDisabled="!canBeAddedToCart(product)"
            :isAddedToCart="isInCart(product)"
            :link="localePath(getNonLocalisedPath(product))"
            @click:wishlist="
              isInWishlist(
                product
              )
                ? removeItemFromWishlist(
                    wishlistGetItem(wishlist, {
                      productId: product.id,
                      variantId: getPurchasableDefaultVariant(product).id
                    })
                  )
                : addItemToWishlist(
                    product
                  )
            "
            @click:add-to-cart="addItemToCart(product)"
            imageTag="img"
            :imageWidth="216"
            :imageHeight="216"
          />
        </SfCarouselItem>
      </SfCarousel>
    </SfLoader>
  </SfSection>
</template>

<script lang="ts">
import {
  SfCarousel,
  SfProductCard,
  SfSection,
  SfLoader
} from '@storefront-ui/vue';
import { Product } from '@vsf-enterprise/bigcommerce-api';
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import {
  getNonLocalisedPath,
  getCoverImageUrl,
  createPriceObject,
  canBeAddedToCart,
  getPurchasableDefaultVariant
} from '~/composables/useProduct/helpers';
import { useWishlist, useCart } from '~/composables';
import { getItem as wishlistGetItem } from '~/composables/useWishlist/helpers';
import { storeToRefs } from 'pinia';
import { useWishlistStore } from '~/stores/wishlist';

export default defineComponent({
  name: 'RelatedProducts',
  components: {
    SfCarousel,
    SfProductCard,
    SfSection,
    SfLoader
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    products: {
      type: Array as PropType<Array<Product>>,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { addItem: addItemToCart, isInCart } = useCart();
    const { wishlist } = storeToRefs(useWishlistStore());
    const {
      addItem: addItemToWishlist,
      isInWishlist,
      removeItem: removeItemFromWishlist
    } = useWishlist();

    return {
      getCoverImageUrl,
      createPriceObject,
      canBeAddedToCart,
      wishlistGetItem,
      wishlist,
      isInWishlist,
      getNonLocalisedPath,
      addItemToWishlist,
      removeItemFromWishlist,
      isInCart,
      addItemToCart,
      getPurchasableDefaultVariant
    };
  }
});
</script>

<style lang="scss" scoped>
.section {
  margin-top: var(--spacer-base);
}

.carousel {
  margin: 0 calc(0 - var(--spacer-sm)) 0 0;
  @include for-desktop {
    margin: 0;
  }
  &__item {
    margin: 1.9375rem 0 2.4375rem 0;
  }

  ::v-deep .sf-product-card__image .sf-image {
    --image-width: 9.625rem;
    --image-height: 9.625rem;

    @include for-desktop {
      --image-width: 13.5rem;
      --image-height: 13.5rem;
    }
  }
}
</style>
