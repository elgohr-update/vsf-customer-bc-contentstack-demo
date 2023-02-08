<template>
  <LazyHydrate when-idle>
    <SfSidebar
      :visible="isFilterSidebarOpen"
      class="sidebar-filters"
      data-testid="mobile-sidebar"
      @close="toggleFilterSidebar"
    >
      <span v-if="filtersLoading" class="filters__loading-title">
        {{ $t('Loading filters') }}...
      </span>
      <template v-else-if="areFiltersAvailable && !filtersLoading">
        <SfAccordion class="filters-accordion smartphone-only">
          <SfAccordionItem
            key="filter-title-colors"
            header="Color"
            class="filters-accordion-item filters-accordion-item__colors"
            v-if="colors.length > 0"
          >
            <SfColor
              v-for="color of colors"
              :key="color.value"
              :color="color.value"
              :selected="filters.color === color.value"
              class="filters-item__colors"
              @click="setSelectedColor(color.value)"
            />
          </SfAccordionItem>
          <SfAccordionItem
            key="filter-title-sizes"
            header="Size"
            class="filters-accordion-item"
            v-if="sizes.length > 0"
          >
            <SfFilter
              v-for="size in sizes"
              :key="size.value"
              :label="size.value"
              :count="size.productCount"
              :selected="filters.size === size.value"
              class="filters-item__sizes"
              @change="setSelectedSize(size.value)"
            />
          </SfAccordionItem>
        </SfAccordion>

        <div v-if="colors.length > 0" class="filters-container desktop-only">
          <SfHeading
            :level="4"
            :title="$t('Color')"
            class="filters-title__colors"
          />
          <div class="filters-content__colors filters-content">
            <SfColor
              v-for="color of colors"
              :key="color.value"
              :color="color.value"
              :selected="filters.color.includes(color.value)"
              class="filters-item__colors"
              @click="setSelectedColor(color.value)"
            />
          </div>
        </div>

        <div v-if="sizes.length > 0" class="filters-container desktop-only">
          <SfHeading
            :level="4"
            :title="$t('Size')"
            class="filters-title__sizes"
          />
          <div class="filters-content__sizes filters-content">
            <SfFilter
              v-for="size in sizes"
              :key="size.value"
              :label="size.value"
              :count="size.productCount"
              :selected="filters.size.includes(size.value)"
              class="filters-item__sizes"
              @change="setSelectedSize(size.value)"
            />
          </div>
        </div>
      </template>
      <span v-else class="filters__empty-title">
        {{ $t('No filters are available now.') }}
      </span>
      <template #content-bottom>
        <div class="filters__buttons">
          <SfButton
            class="sf-button--full-width"
            :aria-label="$t('Apply filters')"
            @click="applyFilter"
          >
            {{ $t('Done') }}
          </SfButton>
          <SfButton
            class="sf-button--full-width filters__button-clear"
            :aria-label="$t('Clear filters')"
            @click="resetFilter"
          >
            {{ $t('Clear All') }}
          </SfButton>
        </div>
      </template>
    </SfSidebar>
  </LazyHydrate>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch
} from '@nuxtjs/composition-api';
import LazyHydrate from 'vue-lazy-hydration';
import {
  SfAccordion,
  SfMenuItem,
  SfList,
  SfLoader,
  SfHeading,
  SfColor,
  SfSidebar,
  SfFilter,
  SfButton
} from '@storefront-ui/vue';
import { GraphQL } from '@vsf-enterprise/bigcommerce-api';
import { useUiHelpers, useUiState, useFilters } from '~/composables';
import { useCategoryTreeStore } from '~/stores';

export default defineComponent({
  components: {
    LazyHydrate,
    SfAccordion,
    SfFilter,
    SfList,
    SfHeading,
    SfMenuItem,
    SfLoader,
    SfColor,
    SfSidebar,
    SfButton
  },
  transition: 'fade',
  setup() {
    const { load, loading: filtersLoading } = useFilters();
    const {
      categorySlug,
      changeFilters,
      getFacetsFromURL,
      getFilterFromUrlAsArray
    } = useUiHelpers();
    const { isFilterSidebarOpen, toggleFilterSidebar } = useUiState();
    const categoryTreeStore = useCategoryTreeStore();
    const { filters: filtersFromUrl } = getFacetsFromURL();

    const filters = reactive<{
      color: string[];
      size: string[];
    }>({
      color: getFilterFromUrlAsArray(filtersFromUrl.color),
      size: getFilterFromUrlAsArray(filtersFromUrl.size)
    });
    const categorizedFilters = ref({});
    const categoryId = computed(() => {
      const category = categoryTreeStore.listOfRootBranches?.find((item) =>
        item.url.includes(categorySlug.value)
      );

      if (!category) return null;

      return category.id;
    });

    async function fetchAvailableFilters() {
      if (!categoryId.value || categorizedFilters.value[categoryId.value]) {
        return;
      }

      const raw = await load({
        filters: {
          categoryEntityId: categoryId.value
        }
      });

      categorizedFilters.value = {
        ...categorizedFilters.value,
        [categoryId.value]: raw.edges.map((item) => item.node)
      };
    }

    onMounted(() => fetchAvailableFilters());

    watch(categorySlug, () => {
      fetchAvailableFilters();
    });

    const currentFilters = computed(() => {
      const currentCategoryFilters = categorizedFilters.value[categoryId.value];

      if (!currentCategoryFilters) {
        return { color: [], size: [] };
      }

      const allAttributesFilters: GraphQL.ProductAttributeSearchFilter[] =
        currentCategoryFilters.filter((item) => Boolean(item.attributes));

      return allAttributesFilters.reduce(
        (obj, item) => {
          obj[item.name.toLowerCase()] =
            item.attributes.edges.map((item) => item.node) ?? [];

          return obj;
        },
        { color: [], size: [] }
      );
    });

    const areFiltersAvailable = computed(
      () =>
        currentFilters.value.color.length > 0 ||
        currentFilters.value.size.length > 0
    );

    function resetFilter() {
      filters.color = [];
      filters.size = [];
      changeFilters();

      toggleFilterSidebar();
    }

    function applyFilter() {
      if (areFiltersAvailable.value) {
        changeFilters({ color: filters.color, size: filters.size });
      }

      toggleFilterSidebar();
    }

    function setSelectedColor(color: string) {
      if (filters.color.includes(color)) {
        filters.color = filters.color.filter((item) => color !== item);
      } else {
        filters.color.push(color);
      }
    }

    function setSelectedSize(size: string) {
      if (filters.size.includes(size)) {
        filters.size = filters.size.filter((item) => size !== item);
      } else {
        filters.size.push(size);
      }
    }

    return {
      filtersLoading,
      colors: computed(() => currentFilters.value.color),
      sizes: computed(() => currentFilters.value.size),
      filters,
      isFilterSidebarOpen,
      areFiltersAvailable,
      toggleFilterSidebar,
      applyFilter,
      resetFilter,
      setSelectedColor,
      setSelectedSize
    };
  }
});
</script>

<style lang="scss" scoped>
.sf-heading__title {
  text-align: left;
  display: block;
}

.list {
  &__item {
    .nuxt-link-exact-active {
      text-decoration: underline;
    }
  }
}

.filters {
  &__buttons {
    margin: var(--spacer-sm) 0;
  }
  &__button-clear {
    --button-background: var(--c-light);
    --button-color: var(--c-dark-variant);
    margin: var(--spacer-xs) 0 0 0;
  }
}

.filters-container {
  &:not(:first-of-type) {
    margin-top: var(--spacer-lg);
  }
}

.filters-content {
  margin-top: var(--spacer-sm);

  &__colors {
    display: flex;
  }
}

.filters-item {
  &__colors {
    margin: var(--spacer-xs);
    margin-top: 0;
  }
}

.filters-accordion-item {
  &__colors {
    ::v-deep .sf-accordion-item__content {
      display: flex;
    }
  }
}

::v-deep .sf-sidebar {
  &__aside {
    z-index: 3;
  }
}
</style>
