<template>
  <div class="container">
    <SfButton
      class="container__lang container__lang--selected"
      @click="isLangModalOpen = !isLangModalOpen"
    >
      <SfImage
        :src="addBasePath(`/icons/langs/${locale}.svg`)"
        :width="20"
        :height="20"
        alt="Flag"
      />
    </SfButton>
    <SfBottomModal
      :is-open="isLangModalOpen"
      title="Choose language"
      @click:close="isLangModalOpen = !isLangModalOpen"
    >
      <SfList>
        <SfListItem v-for="lang in availableLocales" :key="lang.code">
          <nuxt-link :to="switchLocalePath(lang.code)">
            <SfCharacteristic class="language">
              <template #title>
                <span>{{ lang.label }}</span>
              </template>
              <template #icon>
                <SfImage
                  :src="addBasePath(`/icons/langs/${lang.code}.svg`)"
                  :width="20"
                  :height="20"
                  alt="Flag"
                  class="language__flag"
                />
              </template>
            </SfCharacteristic>
          </nuxt-link>
        </SfListItem>
      </SfList>
    </SfBottomModal>
  </div>
</template>

<script lang="ts">
import {
  SfImage,
  SfButton,
  SfList,
  SfBottomModal,
  SfCharacteristic
} from '@storefront-ui/vue';
import {
  ref,
  computed,
  useContext,
  defineComponent
} from '@nuxtjs/composition-api';
import { addBasePath } from '~/helpers/addBasePath';
import { LocaleObject } from 'nuxt-i18n';

export default defineComponent({
  components: {
    SfImage,
    SfButton,
    SfList,
    SfBottomModal,
    SfCharacteristic
  },
  setup() {
    const { i18n } = useContext();
    const { locales, locale } = i18n;
    const isLangModalOpen = ref(false);
    const availableLocales = computed(() =>
      (locales as LocaleObject[]).filter((i) => i.code !== locale)
    );
    return {
      availableLocales,
      locale,
      isLangModalOpen,
      addBasePath
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
  margin: 0 -5px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
  .sf-bottom-modal {
    z-index: 2;
    left: 0;
    @include for-desktop {
      --bottom-modal-height: 100vh;
    }
  }
  .sf-bottom-modal::v-deep .sf-bottom-modal__close {
    position: var(--circle-icon-position, absolute);
    top: var(--spacer-xs);
    right: var(--spacer-xs);
  }
  .sf-list {
    .language {
      padding: var(--spacer-sm);
      &__flag {
        margin-right: var(--spacer-sm);
      }
    }
    @include for-desktop {
      display: flex;
    }
  }
  &__lang {
    width: 20px;
    --button-box-shadow: none;
    background: none;
    padding: 0 5px;
    display: flex;
    align-items: center;
    opacity: 0.5;
    border: none;
    &:hover,
    &--selected {
      opacity: 1;
    }
  }
}
</style>
