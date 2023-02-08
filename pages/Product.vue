<template>
  <SfLoader class="product__loader" :loading="isProductFetchingInProgress">
    <div id="product">
      <SfBreadcrumbs
        class="breadcrumbs desktop-only"
        :breadcrumbs="breadcrumbs"
      />
      <div class="product" v-if="product">
        <LazyHydrate when-idle>
          <SfGallery
            :key="productGallery.length"
            v-if="productGallery.length"
            :images="productGallery"
            class="product__gallery"
            :imageWidth="422"
            :imageHeight="644"
            :thumbWidth="160"
            :thumbHeight="160"
          />
        </LazyHydrate>

        <div class="product__info">
          <div class="product__header">
            <SfHeading
              :title="product.name"
              :level="3"
              class="sf-heading--no-underline sf-heading--left"
            />
            <SfIcon
              icon="drag"
              size="xxl"
              color="var(--c-text-disabled)"
              class="product__drag-icon smartphone-only"
            />
          </div>
          <div class="product__price-and-rating">
            <SfPrice
              :regular="
                $n(
                  createPriceObject(product, activeVariant).regular,
                  'currency'
                )
              "
              :special="
                createPriceObject(product, activeVariant).special &&
                $n(
                  createPriceObject(product, activeVariant).special,
                  'currency'
                )
              "
            />
            <div>
              <div class="product__wishlist">
                <SfButton
                  v-if="!isInWishlist(product)"
                  class="sf-button--text"
                  @click="addItemToWishlist(product)"
                  >{{ $t('Add to wishlist') }}</SfButton
                >
                <SfButton
                  v-else
                  class="sf-button--text"
                  @click="
                    removeItemFromWishlist(
                      wishlistGetItem(wishlist, {
                        productId: product.id,
                        variantId: getPurchasableDefaultVariant(product).id
                      })
                    )
                  "
                  >{{ $t('Remove from wishlist') }}</SfButton
                >
              </div>
              <div class="product__rating">
                <SfRating :score="averageRating" :max="5" />
                <span
                  v-if="!!totalReviews"
                  class="product__count reviews-count"
                  @click="showReviews"
                >
                  ({{ totalReviews }})
                </span>
              </div>
              <SfButton class="sf-button--text" @click="showReviews">{{
                $t('Read all reviews')
              }}</SfButton>
            </div>
          </div>
          <div v-if="options">
            <SfButton class="sf-button--text desktop-only product__guide">
              {{ $t('Size guide') }}
            </SfButton>

            <template v-for="option in options">
              <SfSelect
                :key="`dropdown_${option.id}`"
                v-e2e="'size-select'"
                v-if="option.type === 'dropdown'"
                :value="
                  configuration
                    ? configuration[option.display_name]
                    : option.option_values[0].label
                "
                @input="
                  (value) => updateFilter({ [option.display_name]: value })
                "
                :label="option.display_name"
                class="sf-select--underlined product__select-size"
                :required="true"
              >
                <SfSelectOption
                  v-for="optionValue in option.option_values"
                  :key="optionValue.id"
                  :value="optionValue.label"
                >
                  {{ optionValue.label }}
                </SfSelectOption>
              </SfSelect>
              <div
                :key="`swatch_${option.id}`"
                v-else-if="option.type === 'swatch'"
                class="product__colors"
              >
                <p class="product__color-label">{{ option.display_name }}:</p>
                <SfColor
                  v-for="(color, index) in option.option_values"
                  :key="color.id"
                  :color="color.value_data.colors[0]"
                  :selected="
                    configuration[option.display_name]
                      ? color.label === configuration[option.display_name]
                      : index == 0
                  "
                  class="product__color"
                  @click="updateFilter({ [option.display_name]: color.label })"
                />
              </div>
            </template>

            <SfAddToCart
              v-if="!activeVariant || !activeVariant.purchasing_disabled"
              v-e2e="'product_add-to-cart'"
              v-model="qty"
              :disabled="loading || (stock.enabled && stock.current <= 0)"
              class="product__add-to-cart"
            >
              <template #add-to-cart-btn>
                <SfButton
                  class="sf-add-to-cart__button"
                  :disabled="
                    loading ||
                    (stock.enabled &&
                      (stock.current <= 0 || stock.current < qty))
                  "
                  @click="
                    addItem(product, qty, activeVariant && activeVariant.id)
                  "
                >
                  {{ $t('Add to cart') }}
                </SfButton>
              </template>
            </SfAddToCart>

            <SfAlert
              v-else
              :message="
                activeVariant.purchasing_disabled_message ||
                $t('Currently unavailable')
              "
              type="warning"
            />

            <SfAlert
              v-if="stock.enabled && stock.current <= 0"
              :message="$t('Out of stock')"
              type="danger"
            />

            <SfAlert
              v-if="stock.enabled && qty > 1 && stock.current < qty"
              :message="$t('The selected quantity exceeds available stock.')"
              type="warning"
            />
          </div>

          <LazyHydrate when-idle>
            <SfTabs
              ref="tabsRef"
              :open-tab="openTab"
              class="product__tabs"
              @click:tab="(tab) => (openTab = tab)"
            >
              <SfTab title="Description">
                <div
                  class="product__description"
                  v-html="product.description"
                />
              </SfTab>
              <SfTab title="Read reviews">
                <SfReview
                  v-for="review in reviews"
                  :key="review.id"
                  :author="getReviewTitle(review)"
                  :date="formatDateString(review.date_reviewed, 'long')"
                  :message="review.text"
                  :max-rating="5"
                  :rating="review.rating"
                  :char-limit="250"
                  read-more-text="Read more"
                  hide-full-text="Read less"
                  class="product__review"
                />
                <AddReview :product-id="product.id" />
                <InternalPagination
                  v-show="reviewsPagination.totalPages > 1"
                  :current="reviewsPagination.currentPage"
                  :total="reviewsPagination.totalPages"
                  :navigate="reviewsPageNavigation"
                  :visible="5"
                />
              </SfTab>
              <SfTab
                title="Additional Information"
                class="product__additional-info"
              >
                <div class="product__additional-info">
                  <p class="product__additional-info__title">
                    {{ $t('Instruction1') }}
                  </p>
                  <p class="product__additional-info__paragraph">
                    {{ $t('Instruction2') }}
                  </p>
                  <p class="product__additional-info__paragraph">
                    {{ $t('Instruction3') }}
                  </p>
                </div>
              </SfTab>
            </SfTabs>
          </LazyHydrate>
        </div>
      </div>

      <LazyHydrate when-visible>
        <RelatedProducts
          v-if="relatedProducts && relatedProducts.data"
          :products="relatedProducts.data"
          :loading="isRelatedProductsFetchingInProgress"
          :title="$t('Recommended products')"
        />
      </LazyHydrate>
    </div>
  </SfLoader>
</template>

<script lang="ts">
import {
  ref,
  ssrRef,
  computed,
  defineComponent,
  useContext,
  useRouter,
  useRoute,
  useMeta,
  onMounted,
  useAsync
} from '@nuxtjs/composition-api';
import {
  SfHeading,
  SfPrice,
  SfRating,
  SfSelect,
  SfAddToCart,
  SfTabs,
  SfGallery,
  SfIcon,
  SfAlert,
  SfReview,
  SfBreadcrumbs,
  SfButton,
  SfColor,
  SfLoader
} from '@storefront-ui/vue';
import RelatedProducts from '~/components/RelatedProducts.vue';
import AddReview from '~/components/AddReview.vue';
import InternalPagination from '~/components/InternalPagination.vue';
import LazyHydrate from 'vue-lazy-hydration';
import {
  useReview,
  useUiHelpers,
  useProduct,
  useCategory,
  useCart,
  usePagination,
  useWishlist
} from '~/composables';
import {
  getCoverImageUrl,
  createPriceObject,
  getConfigurationOptions,
  getActiveVariant,
  createIntentoryObjectFromType,
  getRelatedProductsIds,
  getAverageRating,
  getPurchasableDefaultVariant
} from '~/composables/useProduct/helpers';
import { getReviewTitle } from '~/composables/useReview/helpers';
import { getItem as wishlistGetItem } from '~/composables/useWishlist/helpers';
import { storeToRefs } from 'pinia';
import { useWishlistStore } from '~/stores/wishlist';

export default defineComponent({
  name: 'Product',
  components: {
    SfAlert,
    SfColor,
    SfHeading,
    SfPrice,
    SfRating,
    SfSelect,
    SfAddToCart,
    SfTabs,
    SfGallery,
    SfIcon,
    SfReview,
    SfBreadcrumbs,
    SfButton,
    SfLoader,
    RelatedProducts,
    InternalPagination,
    LazyHydrate,
    AddReview
  },
  transition: 'fade',
  setup() {
    const { formatDateString } = useUiHelpers();
    const { error } = useContext();
    const router = useRouter();
    const route = useRoute();
    const id = computed(() => route.value.params.id);
    const qty = ref(1);
    const { query } = route.value;
    const configuration = ssrRef(query);

    // Wishlist
    const { wishlist } = storeToRefs(useWishlistStore());
    const {
      addItem: addItemToWishlist,
      isInWishlist,
      removeItem: removeItemFromWishlist
    } = useWishlist();

    // Product
    const {
      search: mainProductSearch,
      loading: isProductFetchingInProgress,
      error: productFetchingError
    } = useProduct();
    const {
      search: relatedProductsSearch,
      loading: isRelatedProductsFetchingInProgress
    } = useProduct();

    const searchResponse = useAsync(async () => {
      const productResponse = await mainProductSearch({
        id: Number(id.value),
        include: 'options,variants'
      });
      const foundProducts = productResponse?.data;

      if (!foundProducts?.length || productFetchingError.value.search) {
        error({ statusCode: 404 });
        return { productResponse: null, relatedProductResponse: null };
      }

      const foundProduct = foundProducts?.[0];

      const relatedProductIds = getRelatedProductsIds(foundProduct);
      return {
        productResponse,
        relatedProductResponse: relatedProductIds.length
          ? await relatedProductsSearch({
            'id:in': relatedProductIds,
            include: 'options,variants',
            limit: 8
          })
          : null
      };
    }, route.value.fullPath);

    const product = computed(
      () => searchResponse.value?.productResponse?.data?.[0]
    );
    const options = computed(() => getConfigurationOptions(product.value));
    const activeVariant = computed(() =>
      getActiveVariant(product.value, configuration.value)
    );
    const stock = computed(() =>
      createIntentoryObjectFromType(product.value, activeVariant.value)
    );
    const productGallery = computed(() => {
      if (!product.value) return;
      const variantImage = activeVariant.value?.image_url;
      const mainProductImages = product.value.images
        .sort((first, second) => first.sort_order - second.sort_order)
        .map((image) => ({
          mobile: { url: image.url_thumbnail },
          desktop: { url: image.url_standard },
          big: { url: image.url_standard },
          alt: product.value.name
        }));
      const imageConfiguration = {
        mobile: { url: variantImage },
        desktop: { url: variantImage },
        big: { url: variantImage },
        alt: product.value.name
      };
      const variantImages = activeVariant.value?.image_url
        ? [imageConfiguration]
        : [];
      return [...variantImages, ...mainProductImages];
    });

    const updateFilter = (filter) => {
      router.push({
        path: route.value.path,
        query: {
          ...configuration.value,
          ...filter
        }
      });
    };

    // Cart
    const { addItem, loading } = useCart();

    // Category
    const { buildBreadcrumbs } = useCategory();
    const productCategories = computed(() => product.value?.categories);
    const breadcrumbs = computed(() => {
      const breadcrumbs = buildBreadcrumbs(productCategories.value?.[0]);
      breadcrumbs.push({ text: product.value?.name, link: '#' });
      return breadcrumbs;
    });

    // Reviews with Pagination
    const reviews = ref(null);
    const { pagination: reviewsPagination } = usePagination(reviews);
    const reviewsTab = 2;
    const { search: searchReviews, loading: loadingReviews } = useReview();
    const tabsRef = ref(null);
    const openTab = ref(1);

    const showReviews = () => {
      openTab.value = reviewsTab;
      const tabsElement = tabsRef.value?.$el;
      if (tabsElement) window?.scrollTo(0, tabsElement.offsetTop);
    };

    const reviewsPageNavigation = async (pageNum) => {
      reviews.value = await searchReviews({
        productId: Number(id?.value),
        query: { status: 1, limit: 5, page: pageNum }
      });
    };

    // Nuxt lifecycle methods
    onMounted(async () => {
      reviews.value = await searchReviews({
        productId: Number(id?.value),
        query: { status: 1, limit: 5 }
      });
    });

    // Meta tags
    const metaTags = computed(() => ({
      title: product.value?.page_title || product.value?.name,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: product.value?.open_graph_use_product_name
            ? product.value?.name
            : product.value?.open_graph_title
        },
        {
          hid: 'description',
          name: 'description',
          content: product.value?.meta_description
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: product.value?.open_graph_use_meta_description
            ? product.value?.meta_description
            : product.value?.open_graph_description
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: product.value?.open_graph_use_image
            ? getCoverImageUrl(product.value)
            : ''
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: product.value?.open_graph_type
        }
      ]
    }));
    useMeta(() => metaTags.value);

    return {
      activeVariant,
      updateFilter,
      configuration,
      openTab,
      product,
      breadcrumbs,
      reviewsPagination,
      loadingReviews,
      reviewsPageNavigation,
      reviews: computed(() => reviews.value?.data ?? []),
      averageRating: computed(() => getAverageRating(product.value)),
      createPriceObject,
      totalReviews: computed(() => product.value?.reviews_count ?? 0),
      relatedProducts: searchResponse.value?.relatedProductResponse,
      isRelatedProductsFetchingInProgress,
      isProductFetchingInProgress,
      options,
      qty,
      addItem,
      loading,
      productGallery,
      stock,
      formatDateString,
      getReviewTitle,
      showReviews,
      tabsRef,
      wishlist,
      addItemToWishlist,
      removeItemFromWishlist,
      isInWishlist,
      wishlistGetItem,
      getPurchasableDefaultVariant
    };
  },
  head: {}
});
</script>

<style lang="scss">
.product {
  .sf-select__label {
    padding-left: 0;
  }
}
</style>
<style lang="scss" scoped>
.sf-select.is-selected {
  --select-label-font-size: var(--font-size--lg);
}
#product {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
  }
}
.product {
  @include for-desktop {
    display: flex;
  }
  &__loader {
    min-height: var(--spacer-2xl);
  }
  &__info {
    margin: var(--spacer-sm) auto;
    @include for-desktop {
      max-width: 32.625rem;
      margin: 0 0 0 7.5rem;
    }
  }
  &__wishlist {
    text-align: right;
  }
  &__header {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--bold);
    --heading-padding: 0;
    margin: 0 var(--spacer-sm);
    display: flex;
    justify-content: space-between;
    @include for-desktop {
      --heading-title-font-weight: var(--font-weight--semibold);
      margin: 0 auto;
    }
  }
  &__drag-icon {
    animation: moveicon 1s ease-in-out infinite;
  }
  &__price-and-rating {
    text-align: right;
    margin: 0 var(--spacer-sm) var(--spacer-base);
    align-items: center;
    @include for-desktop {
      display: flex;
      justify-content: space-between;
      margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
    }
  }
  &__rating {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: var(--spacer-xs) 0 var(--spacer-xs);

    .reviews-count {
      cursor: pointer;
    }
  }
  &__count {
    @include font(
      --count-font,
      var(--font-weight--normal),
      var(--font-size--sm),
      1.4,
      var(--font-family--secondary)
    );
    color: var(--c-text);
    text-decoration: none;
    margin: 0 0 0 var(--spacer-xs);
  }
  &__description {
    @include font(
      --product-description-font,
      var(--font-weight--light),
      var(--font-size--base),
      1.6,
      var(--font-family--primary)
    );
  }
  &__select-size {
    margin: 0 var(--spacer-sm);
    @include for-desktop {
      margin: 0;
    }
  }
  &__colors {
    @include font(
      --product-color-font,
      var(--font-weight--normal),
      var(--font-size--lg),
      1.6,
      var(--font-family--secondary)
    );
    display: flex;
    align-items: center;
    margin: var(--spacer-sm);
    @include for-desktop {
      margin: var(--spacer-xl) 0 var(--spacer-sm);
    }
  }
  &__color-label {
    margin: 0 var(--spacer-lg) 0 0;
  }
  &__color {
    margin: 0 var(--spacer-2xs);
  }
  &__add-to-cart {
    margin: var(--spacer-base) var(--spacer-sm) var(--spacer-xs);
    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }
  &__guide,
  &__compare,
  &__save {
    display: block;
    margin: var(--spacer-xl) 0 var(--spacer-base) auto;
  }
  &__compare {
    margin-top: 0;
  }
  &__tabs {
    --tabs-title-z-index: 0;
    margin: var(--spacer-lg) auto var(--spacer-2xl);
    --tabs-title-font-size: var(--font-size--lg);
    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }
  &__property {
    margin: var(--spacer-base) 0;
    &__button {
      --button-font-size: var(--font-size--base);
    }
  }
  &__review {
    padding-bottom: 24px;
    border-bottom: var(--c-light) solid 1px;
    margin-bottom: var(--spacer-base);
  }
  &__additional-info {
    color: var(--c-link);
    @include font(
      --additional-info-font,
      var(--font-weight--light),
      var(--font-size--sm),
      1.6,
      var(--font-family--primary)
    );
    &__title {
      font-weight: var(--font-weight--normal);
      font-size: var(--font-size--base);
      margin: 0 0 var(--spacer-sm);
      &:not(:first-child) {
        margin-top: 3.5rem;
      }
    }
    &__paragraph {
      margin: 0;
    }
  }
  &__gallery {
    flex: 1;
  }
}
.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}
@keyframes moveicon {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 30%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>
