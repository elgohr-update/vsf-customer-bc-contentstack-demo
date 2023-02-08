<template>
  <div>
    <SfMegaMenu
      :visible="isSearchOpen"
      :title="$t('Search results')"
      class="search"
    >
      <transition name="sf-fade" mode="out-in">
        <SfLoader class="search__loader" :loading="loading">
          <div
            v-if="products && products.length > 0"
            class="search__wrapper-results"
            key="results"
          >
            <SfMegaMenuColumn
              :title="$t('Categories')"
              class="sf-mega-menu-column--pined-content-on-mobile search__categories"
            >
              <template #title="{ title, changeActive }">
                <SfMenuItem :label="title" @click="changeActive(title)">
                  <template #mobile-nav-icon> &#8203; </template>
                </SfMenuItem>
              </template>
              <SfList>
                <SfListItem v-for="(category, key) in categories" :key="key">
                  <SfMenuItem
                    :label="category.label"
                    :link="localePath(`/c${category.slug}`)"
                  >
                    <template #mobile-nav-icon> &#8203; </template>
                  </SfMenuItem>
                </SfListItem>
              </SfList>
            </SfMegaMenuColumn>
            <SfMegaMenuColumn
              :title="$t('Product suggestions')"
              class="sf-mega-menu-column--pined-content-on-mobile search__results"
            >
              <template #title="{ title }">
                <SfMenuItem
                  :label="title"
                  class="sf-mega-menu-column__header search__header"
                >
                  <template #mobile-nav-icon> &#8203; </template>
                </SfMenuItem>
              </template>
              <SfScrollable
                class="results--desktop desktop-only"
                show-text=""
                hide-text=""
              >
                <div class="results-listing">
                  <SfProductCard
                    v-for="product in products"
                    :key="product.id"
                    class="result-card"
                    :title="product.name"
                    :image="getCoverImageUrl(product)"
                    :regular-price="
                      $n(
                        createPriceObject(
                          product,
                          getPurchasableDefaultVariant(product)
                        ).regular,
                        'currency'
                      )
                    "
                    :special-price="
                      createPriceObject(
                        product,
                        getPurchasableDefaultVariant(product)
                      ).special &&
                      $n(
                        createPriceObject(
                          product,
                          getPurchasableDefaultVariant(product)
                        ).special,
                        'currency'
                      )
                    "
                    :max-rating="5"
                    :score-rating="getAverageRating(product)"
                    :show-add-to-cart-button="true"
                    wishlistIcon="heart"
                    isInWishlistIcon="heart_fill"
                    :isInWishlist="isInWishlist(product)"
                    :addToCartDisabled="!canBeAddedToCart(product)"
                    :isAddedToCart="isInCart(product)"
                    :link="localePath(getNonLocalisedPath(product))"
                    @click:wishlist="
                      isInWishlist(product)
                        ? removeItemFromWishlist(
                            wishlistGetItem(wishlist, {
                              productId: product.id,
                              variantId:
                                getPurchasableDefaultVariant(product).id
                            })
                          )
                        : addItemToWishlist(product)
                    "
                    @click:add-to-cart="addItemToCart(product)"
                    imageTag="img"
                    :imageWidth="216"
                    :imageHeight="216"
                  />
                </div>
              </SfScrollable>
              <div class="results--mobile smartphone-only">
                <SfProductCard
                  v-for="product in products"
                  :key="product.id"
                  class="result-card"
                  :title="product.name"
                  :image="getCoverImageUrl(product)"
                  :regular-price="
                    $n(
                      createPriceObject(
                        product,
                        getPurchasableDefaultVariant(product)
                      ).regular,
                      'currency'
                    )
                  "
                  :special-price="
                    createPriceObject(
                      product,
                      getPurchasableDefaultVariant(product)
                    ).special &&
                    $n(
                      createPriceObject(
                        product,
                        getPurchasableDefaultVariant(product)
                      ).special,
                      'currency'
                    )
                  "
                  :max-rating="5"
                  :score-rating="getAverageRating(product)"
                  :show-add-to-cart-button="true"
                  wishlistIcon="heart"
                  isInWishlistIcon="heart_fill"
                  :isInWishlist="isInWishlist(product)"
                  :addToCartDisabled="!canBeAddedToCart(product)"
                  :isAddedToCart="isInCart(product)"
                  :link="localePath(getNonLocalisedPath(product))"
                  @click:wishlist="
                    isInWishlist(product)
                      ? removeItemFromWishlist(
                          wishlistGetItem(wishlist, {
                            productId: product.id,
                            variantId: getPurchasableDefaultVariant(product).id
                          })
                        )
                      : addItemToWishlist(product)
                  "
                  @click:add-to-cart="addItemToCart(product)"
                  imageTag="img"
                  :imageWidth="128"
                  :imageHeight="128"
                />
              </div>
            </SfMegaMenuColumn>
            <div class="action-buttons smartphone-only">
              <SfButton
                class="action-buttons__button color-light"
                @click="$emit('close')"
                >{{ $t('Cancel') }}</SfButton
              >
            </div>
          </div>
          <div v-else key="no-results" class="before-results">
            <SfImage
              src="/error/error.svg"
              class="before-results__picture"
              alt="error"
              loading="lazy"
              :width="300"
              :height="300"
            />
            <div v-if="searchInput">
              <p class="before-results__paragraph">
                {{ $t('No products found matching your search criteria.') }}
              </p>
            </div>
            <div v-else>
              <p class="before-results__paragraph">
                {{ $t('You haven’t searched for items yet') }}
              </p>
              <p class="before-results__paragraph">
                {{ $t('Let’s start now – we’ll help you') }}
              </p>
            </div>
            <SfButton
              class="before-results__button color-secondary smartphone-only"
              @click="$emit('close')"
              >{{ $t('Go back') }}</SfButton
            >
          </div>
        </SfLoader>
      </transition>
    </SfMegaMenu>
  </div>
</template>

<script lang="ts">
import {
  SfMegaMenu,
  SfList,
  SfProductCard,
  SfScrollable,
  SfMenuItem,
  SfButton,
  SfImage,
  SfLoader
} from '@storefront-ui/vue';
import { computed, defineComponent, ref, watch } from '@nuxtjs/composition-api';
import { Product } from '@vsf-enterprise/bigcommerce-api';
import { SearchResultNavigationItem } from '~/composables/types';
import {
  getNonLocalisedPath,
  getCoverImageUrl,
  createPriceObject,
  getAverageRating,
  canBeAddedToCart,
  getPurchasableDefaultVariant
} from '~/composables/useProduct/helpers';
import { useWishlist, useCart } from '~/composables';
import { getItem as wishlistGetItem } from '~/composables/useWishlist/helpers';
import { storeToRefs } from 'pinia';
import { useWishlistStore } from '~/stores/wishlist';

export default defineComponent({
  name: 'SearchResults',
  components: {
    SfMegaMenu,
    SfList,
    SfProductCard,
    SfScrollable,
    SfMenuItem,
    SfButton,
    SfImage,
    SfLoader
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    result: {
      type: Object as () => {
        categories: SearchResultNavigationItem[];
        products: Product[];
      },
      default: () => ({
        categories: [],
        products: []
      })
    },
    loading: {
      type: Boolean,
      default: false
    },
    searchInput: {
      type: String,
      default: ''
    }
  },
  emits: ['close', 'removeSearchResults'],
  setup(props, { emit }) {
    const isSearchOpen = ref(props.visible);
    const products = computed(() => props.result?.products);
    const categories = computed(() => props.result?.categories);
    const { addItem: addItemToCart, isInCart } = useCart();
    const { wishlist } = storeToRefs(useWishlistStore());
    const {
      addItem: addItemToWishlist,
      isInWishlist,
      removeItem: removeItemFromWishlist
    } = useWishlist();

    watch(
      () => props.visible,
      (newVal) => {
        isSearchOpen.value = newVal;
        if (isSearchOpen.value) {
          document.body.classList.add('no-scroll');
        } else {
          document.body.classList.remove('no-scroll');
          emit('removeSearchResults');
        }
      }
    );

    return {
      addItemToCart,
      categories,
      isInCart,
      isInWishlist,
      isSearchOpen,
      getCoverImageUrl,
      createPriceObject,
      getAverageRating,
      canBeAddedToCart,
      products,
      getNonLocalisedPath,
      getPurchasableDefaultVariant,
      wishlist,
      wishlistGetItem,
      addItemToWishlist,
      removeItemFromWishlist
    };
  }
});
</script>

<style lang="scss" scoped>
.search {
  position: absolute;
  right: 0;
  left: 0;
  z-index: 3;
  --mega-menu-column-header-margin: var(--spacer-sm) 0 var(--spacer-xl);
  --mega-menu-content-padding: 0;
  --mega-menu-height: auto;
  @include for-desktop {
    --mega-menu-content-padding: var(--spacer-xl) 0;
  }
  &__wrapper-results {
    display: flex;
    flex-direction: column;
    @include for-desktop {
      flex-direction: row;
      flex: 1;
    }
  }
  &__categories {
    flex: 0 0 220px;
  }
  &__results {
    flex: 1;
  }
  &__header {
    margin-left: var(--spacer-sm);
  }
  &__loader {
    min-height: var(--spacer-2xl);
  }
  ::v-deep .sf-bar {
    display: none;
  }
  ::v-deep .sf-mega-menu-column__header {
    display: none;
    @include for-desktop {
      display: flex;
    }
  }
}
.results {
  &--desktop {
    --scrollable-max-height: 35vh;
  }
  &--mobile {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    background: var(--c-white);
    padding: var(--spacer-base) var(--spacer-sm);
    --product-card-max-width: 9rem;
  }
}
.see-all {
  padding: var(--spacer-xl) 0 0 var(--spacer-sm);
}
.action-buttons {
  padding: var(--spacer-xl) var(--spacer-sm) var(--spacer-3xl);
  background: var(--c-white);
  width: 100%;
  &__button {
    width: calc(100% - 32px);
  }
}
.results-listing {
  display: flex;
  flex-wrap: wrap;
  margin-left: var(--spacer-2xs);
}
.result-card {
  margin: var(--spacer-sm) 0;
  @include for-desktop {
    margin: var(--spacer-2xs) 0;
  }
}

.before-results {
  box-sizing: border-box;
  padding: var(--spacer-base) var(--spacer-sm) var(--spacer-2xl);
  width: 100%;
  text-align: center;
  @include for-desktop {
    padding: 0;
  }
  &__picture {
    --image-width: 230px;
    margin-top: var(--spacer-2xl);
    @include for-desktop {
      --image-width: 18.75rem;
      margin-top: var(--spacer-base);
    }
  }
  &__paragraph {
    font-family: var(--font-family--primary);
    font-weight: var(--font-weight--normal);
    font-size: var(--font-size--base);
    color: var(--c-text-muted);
    margin: 0;
    @include for-desktop {
      font-size: var(--font-size--lg);
    }
    &:first-of-type {
      margin: var(--spacer-xl) auto var(--spacer-xs);
    }
  }
  &__button {
    margin: var(--spacer-xl) auto;
    width: 100%;
  }
}
</style>
