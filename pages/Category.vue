<template>
  <div id="category">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <div class="navbar section">
      <div class="navbar__aside desktop-only">
        <LazyHydrate never>
          <SfHeading
            :level="3"
            :title="$t('Categories')"
            class="navbar__title"
          />
        </LazyHydrate>
      </div>
      <CategoryPageHeader :pagination="pagination" />
    </div>

    <div class="main section">
      <div class="sidebar">
        <CategoryTree
          :root-category="rootCategory"
          :categories-loading="categoriesLoading"
        />
      </div>
      <div class="products">
        <SfLoader
          v-if="
            Array.isArray(products) && !products.length && isProductsLoading
          "
          :class="{ loading: isProductsLoading }"
          :loading="isProductsLoading"
        >
        </SfLoader>
        <div
          v-if="
            Array.isArray(products) && !products.length && !isProductsLoading
          "
          class="no-products-message"
        >
          {{
            $t('We have no available products matching your search criteria.')
          }}
        </div>
        <transition-group
          v-if="isCategoryGridView"
          appear
          name="products__slide"
          tag="div"
          class="products__grid"
        >
          <SfProductCard
            v-e2e="'category-product-card'"
            v-for="(product, i) in products"
            :key="product.id"
            :style="{ '--index': i }"
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
              createPriceObject(product, getPurchasableDefaultVariant(product))
                .special &&
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
            class="products__product-card"
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
            :imageWidth="216"
            :imageHeight="216"
          />
        </transition-group>
        <transition-group
          v-else
          appear
          name="products__slide"
          tag="div"
          class="products__list"
        >
          <SfProductCardHorizontal
            v-e2e="'category-product-card'"
            v-for="(product, i) in products"
            :key="product.id"
            :style="{ '--index': i }"
            :title="product.name"
            :description="product.description"
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
              createPriceObject(product, getPurchasableDefaultVariant(product))
                .special &&
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
            :isInWishlist="isInWishlist(product)"
            class="products__product-card-horizontal"
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
            :link="localePath(getNonLocalisedPath(product))"
            imageTag="img"
            :imageWidth="140"
            :imageHeight="200"
          >
            <template #description>
              <div v-html="product.description"></div>
            </template>
            <template #actions>
              <SfButton
                class="sf-button--text desktop-only"
                style="margin: 0 0 1rem auto; display: block"
                @click="
                  isInWishlist(product)
                    ? removeItemFromWishlist(
                        wishlistGetItem(wishlist, {
                          productId: product.id,
                          variantId: getPurchasableDefaultVariant(product).id
                        })
                      )
                    : addItemToWishlist(product)
                "
              >
                {{
                  !isInWishlist(product)
                    ? $t('Add to Wishlist')
                    : $t('Remove from Wishlist')
                }}
              </SfButton>
            </template>
            <template #add-to-cart>
              <SfAddToCart
                v-model="productsQuantity[product.id]"
                :disabled="!canBeAddedToCart(product)"
                class="sf-product-card-horizontal__add-to-cart desktop-only"
                @click="
                  addItemToCart(
                    product,
                    Number(productsQuantity[product.id] || 1)
                  )
                "
              />
            </template>
          </SfProductCardHorizontal>
        </transition-group>

        <LazyHydrate on-interaction>
          <div class="products__show-more">
            <SfButton
              v-if="canShowMore"
              :disabled="isProductsLoading"
              type="button"
              @click="showMore"
            >
              {{ $t('Show more') }}
            </SfButton>
          </div>
        </LazyHydrate>
        <div class="products__show-on-page">
          <span class="products__show-on-page__label">
            {{ $t('Show on page') }}
          </span>
          <LazyHydrate on-interaction>
            <SfSelect
              :value="
                pagination && pagination.itemsPerPage
                  ? pagination.itemsPerPage.toString()
                  : ''
              "
              class="products__items-per-page"
              @input="changeItemsPerPage"
            >
              <SfSelectOption
                v-for="option in pagination.pageOptions"
                :key="option"
                :value="option"
                class="products__items-per-page__option"
                >{{ option }}</SfSelectOption
              >
            </SfSelect>
          </LazyHydrate>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  SfButton,
  SfList,
  SfHeading,
  SfMenuItem,
  SfProductCard,
  SfProductCardHorizontal,
  SfPagination,
  SfAccordion,
  SfSelect,
  SfBreadcrumbs,
  SfLoader,
  SfAddToCart
} from '@storefront-ui/vue';
import {
  computed,
  defineComponent,
  ref,
  ssrRef,
  useAsync,
  useFetch,
  useMeta,
  useRoute
} from '@nuxtjs/composition-api';
import LazyHydrate from 'vue-lazy-hydration';
import {
  useUiHelpers,
  useUiState,
  useProduct,
  useCategory,
  useCart,
  useWishlist,
  usePagination
} from '~/composables';
import CategoryPageHeader from '~/components/CategoryPageHeader.vue';
import CategoryTree from '~/components/CategoryTree.vue';
import {
  getNonLocalisedPath,
  getCoverImageUrl,
  createPriceObject,
  getActiveVariant,
  canBeAddedToCart,
  getAverageRating,
  getPurchasableDefaultVariant
} from '~/composables/useProduct/helpers';
import { storeToRefs } from 'pinia';
import { getItem as wishlistGetItem } from '~/composables/useWishlist/helpers';
import { useCategoryTreeStore } from '~/stores/categoryTree';
import { useWishlistStore } from '~/stores/wishlist';

export default defineComponent({
  components: {
    CategoryPageHeader,
    SfButton,
    SfList,
    SfProductCard,
    SfProductCardHorizontal,
    SfPagination,
    SfMenuItem,
    SfAccordion,
    SfSelect,
    SfBreadcrumbs,
    SfLoader,
    SfHeading,
    LazyHydrate,
    SfAddToCart,
    CategoryTree
  },
  transition: 'fade',
  setup() {
    const route = useRoute();
    const { categorySlug, getFacetsFromURL, changeItemsPerPage } = useUiHelpers();
    const {
      itemsPerPage,
      filters: filtersFromURL,
      sort
    } = getFacetsFromURL();
    const { isCategoryGridView } = useUiState();

    // Category
    const categoryTreeStore = useCategoryTreeStore();
    const {
      fetchCategory,
      buildBreadcrumbs,
      loading: categoriesLoading
    } = useCategory();

    const activeCategory = computed(() =>
      categoryTreeStore.flattenList.find((level) => level.url === categorySlug.value)
    );

    const rootCategory = computed(() => {
      const rootCategoryId = activeCategory.value?.path?.[0];

      return rootCategoryId in categoryTreeStore.dictionary
        ? categoryTreeStore.dictionary[rootCategoryId]
        : activeCategory.value;
    });

    const fetchCategoryResponse = useAsync(async () => {
      return await fetchCategory({
        categoryId: activeCategory.value?.id
      });
    });

    const categoryDetails = computed(() => fetchCategoryResponse.value?.data);

    const breadcrumbs = computed(() =>
      buildBreadcrumbs(activeCategory.value?.id)
    );

    // Cart
    const { addItem: addItemToCart, isInCart } = useCart();

    // Wishlist
    const { wishlist } = storeToRefs(useWishlistStore());
    const {
      addItem: addItemToWishlist,
      isInWishlist,
      removeItem: removeItemFromWishlist
    } = useWishlist();

    // Products
    const { filter, loading: isProductsLoading } = useProduct();
    const productsQuantity = ref({});

    function prepareFilters() {
      const filterColor = filtersFromURL.color;
      const filterSize = filtersFromURL.size;

      const productAttributes = [];

      if (filterColor) {
        productAttributes.push({
          attribute: 'Color',
          values: filterColor
        });
      }

      if (filterSize) {
        productAttributes.push({
          attribute: 'Size',
          values: filterSize
        });
      }

      return {
        categoryEntityId: activeCategory.value?.id,
        productAttributes
      };
    }

    const searchProductsResponse = ssrRef({}, route.value.fullPath);
    const products = ref([]);
    const after = ref('');
    const { fetch: refetchProducts } = useFetch(async () => {
      const filters = prepareFilters();
      const res = await filter({
        filters,
        after: after.value,
        first: itemsPerPage,
        sort
      });
      products.value = products.value.length
        ? [...products.value, ...res.data]
        : res.data;
      searchProductsResponse.value = res;
    });

    // Pagination
    const { pagination, pageInfo } = usePagination(searchProductsResponse);

    const showMore = () => {
      if (pageInfo.value?.hasNextPage) {
        after.value = pageInfo.value.endCursor;
        refetchProducts();
      }
    };

    // Meta data
    const metaTags = computed(() => ({
      title: categoryDetails.value?.page_title || categoryDetails.value?.name,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: categoryDetails.value?.meta_description || ''
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: categoryDetails.value?.meta_keywords || ''
        }
      ]
    }));
    useMeta(() => metaTags.value);

    return {
      isCategoryGridView,
      changeItemsPerPage,
      categoriesLoading,
      products,
      categoryTree: categoryTreeStore.listOfRootBranches,
      rootCategory,
      categoryDetails,
      isProductsLoading,
      pagination,
      getNonLocalisedPath,
      breadcrumbs,
      wishlist,
      addItemToWishlist,
      removeItemFromWishlist,
      isInWishlist,
      wishlistGetItem,
      addItemToCart,
      isInCart,
      productsQuantity,
      getCoverImageUrl,
      createPriceObject,
      getActiveVariant,
      canBeAddedToCart,
      getAverageRating,
      getPurchasableDefaultVariant,
      showMore,
      canShowMore: computed(() => pageInfo.value?.hasNextPage || false)
    };
  },
  head: {}
});
</script>

<style lang="scss" scoped>
#category {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.main {
  &.section {
    padding: var(--spacer-xs);
    @include for-desktop {
      padding: 0;
    }
  }
}
.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}
.navbar {
  position: relative;
  display: flex;
  border: 1px solid var(--c-light);
  border-width: 0 0 1px 0;
  @include for-desktop {
    border-width: 1px 0 1px 0;
  }
  &.section {
    padding: var(--spacer-sm);
    @include for-desktop {
      padding: 0;
    }
  }
  &__aside {
    display: flex;
    align-items: center;
    padding: var(--spacer-sm) 0;
  }
  &__aside {
    flex: 0 0 15%;
    padding: var(--spacer-sm) var(--spacer-sm);
    border: 1px solid var(--c-light);
    border-width: 0 1px 0 0;
  }
  &__title {
    --heading-title-font-weight: var(--font-weight--semibold);
    --heading-title-font-size: var(--font-size--xl);
  }
}
.main {
  display: flex;
}
.list {
  --menu-item-font-size: var(--font-size--sm);
  &__item {
    &:not(:last-of-type) {
      --list-item-margin: 0 0 var(--spacer-sm) 0;
    }
    .nuxt-link-exact-active {
      text-decoration: underline;
    }
  }
}
.products {
  box-sizing: border-box;
  flex: 1;
  margin: 0;
  &__grid {
    justify-content: center;
    @include for-desktop {
      justify-content: flex-start;
    }
  }
  &__grid,
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
  &__product-card {
    --product-card-title-margin: var(--spacer-base) 0 0 0;
    --product-card-title-font-weight: var(--font-weight--medium);
    --product-card-title-margin: var(--spacer-xs) 0 0 0;
    flex: 1 1 50%;
    @include for-desktop {
      --product-card-title-font-weight: var(--font-weight--normal);
      --product-card-add-button-bottom: var(--spacer-base);
      --product-card-title-margin: var(--spacer-sm) 0 0 0;
    }
    ::v-deep .sf-image {
      --image-width: 9.375rem;
      --image-height: 9.375rem;
      @include for-desktop {
        --image-width: 13.5rem;
        --image-height: 13.5rem;
      }
    }
  }
  &__product-card-horizontal {
    flex: 0 0 100%;
    ::v-deep .sf-image {
      --image-width: 5.3125rem;
      --image-height: 7.0625rem;

      @include for-desktop {
        --image-width: 8.75rem;
        --image-height: 12.5rem;
      }
    }
  }
  &__slide-enter {
    opacity: 0;
    transform: scale(0.5);
  }
  &__slide-enter-active {
    transition: all 0.2s ease;
    transition-delay: calc(0.1s * var(--index));
  }
  &__pagination {
    margin: var(--spacer-lg) 0 0 0;
    justify-content: center;
  }

  @include for-desktop {
    &__grid {
      margin: var(--spacer-sm) 0 0 var(--spacer-sm);
    }
    &__pagination {
      display: flex;
      justify-content: flex-start;
      margin: var(--spacer-xl) 0 0 0;
    }
    &__product-card-horizontal {
      margin: var(--spacer-lg) 0;
    }
    &__product-card {
      flex: 1 1 25%;
    }
    &__list {
      margin: 0 0 0 var(--spacer-sm);
    }
  }
  &__show-on-page {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    &__label {
      font-family: var(--font-family--secondary);
      font-size: var(--font-size--sm);
    }
  }
  &__show-more {
    padding: 1rem;
    display: flex;
    justify-content: center;
  }
}
.sidebar {
  ::v-deep .sf-loader {
    height: initial;
    margin-top: var(--spacer-sm);
  }
  flex: 0 0 0%;
  @include for-desktop {
    flex: 0 0 15%;
    padding: var(--spacer-sm);
    border: 1px solid var(--c-light);
    border-width: 0 1px 0 0;
  }
}
.loading {
  margin: var(--spacer-3xl) auto;
  @include for-desktop {
    margin-top: 6.25rem;
  }
  &--filters {
    @include for-desktop {
      margin-top: 3.75rem;
    }
  }
}
.no-products-message {
  padding: 2rem;
  font-family: var(--font-family--secondary);
  font-size: var(--font-size--md);
}
.sf-menu-item {
  text-align: left;
}
</style>
