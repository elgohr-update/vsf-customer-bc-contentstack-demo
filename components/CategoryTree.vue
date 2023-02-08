<template>
  <div class="desktop-only">
    <SfLoader
      :class="{ loading: categoriesLoading }"
      :loading="categoriesLoading"
    >
      <SfAccordion
        v-if="rootCategory"
        v-e2e="'categories-accordion'"
        :open="rootCategory.name"
        :show-chevron="true"
      >
        <SfAccordionItem
          v-for="categoryTreeBranch in categoryTree"
          :key="categoryTreeBranch.id"
          :header="categoryTreeBranch.name"
        >
          <SfList class="list">
            <SfListItem class="list__item">
              <SfMenuItem :label="categoryTreeBranch.name">
                <template #label>
                  <nuxt-link :to="localePath(`/c${categoryTreeBranch.url}`)">
                    All
                  </nuxt-link>
                </template>
              </SfMenuItem>
            </SfListItem>
            <SfListItem
              class="list__item"
              v-for="categoryTreeLevel in categoryTreeBranch.children"
              :key="categoryTreeLevel.id"
            >
              <SfMenuItem :label="categoryTreeLevel.name">
                <template #label="{ label }">
                  <nuxt-link :to="localePath(`/c${categoryTreeLevel.url}`)">
                    {{ label }}
                  </nuxt-link>
                </template>
              </SfMenuItem>
            </SfListItem>
          </SfList>
        </SfAccordionItem>
      </SfAccordion>
    </SfLoader>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import { CategoryTree } from '@vsf-enterprise/bigcommerce-api';
import {
  SfAccordion,
  SfMenuItem,
  SfList,
  SfLoader,
  SfSidebar,
  SfButton
} from '@storefront-ui/vue';
import { useCategoryTreeStore } from '~/stores';
import LazyHydrate from 'vue-lazy-hydration';

export default defineComponent({
  props: {
    rootCategory: {
      required: true,
      type: Object as PropType<CategoryTree>
    },
    categoriesLoading: {
      type: Boolean
    }
  },
  components: {
    LazyHydrate,
    SfAccordion,
    SfList,
    SfMenuItem,
    SfLoader,
    SfSidebar,
    SfButton
  },
  setup() {
    const categoryTreeStore = useCategoryTreeStore();

    return {
      categoryTree: categoryTreeStore.listOfRootBranches
    };
  }
});
</script>
