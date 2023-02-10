<template>
  <div v-if="content" class="dynamic-page">
    <render-content :content="content" />
  </div>
</template>

<script>
import Vue from 'vue'
import { useContent } from "@vsf-enterprise/contentstack"
import { onSSR } from '@vue-storefront/core'
import { useRoute } from '@nuxtjs/composition-api'
/*
 * This page is prepared for CMS dynamic content rendering.
 */
export default Vue.extend({
  name: 'CMSDynamicPage',
  setup(_props) {
    const route = useRoute();
    const { path } = route.value
    const { search, content } = useContent(path)
    onSSR(async () => {
      await search({
        url: path,
        locale: 'en',
      })
    })
    return {
      content,
    }
  },
})
</script>

<style lang="scss">
.dynamic-page .render-content {
  width: 100%;
  margin: 0 auto;
  margin-bottom: var(--spacer-xl);
}
</style>
