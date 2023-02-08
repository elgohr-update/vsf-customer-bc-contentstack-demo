<template>
  <div class="add_review">
    <div v-if="isThanksVisible">
      {{ $t('Thanks for adding review!') }}
    </div>

    <SfButton
      v-if="!isFormVisible"
      class="sf-button--text"
      @click="showForm"
    >
      {{ $t('Add review') }}
    </SfButton>

    <div v-if="isFormVisible" class="add_review--form">
      <form class="form" @submit="submit">
        <SfInput
          v-model="title"
          class="form__element"
          name="title"
          :label="$t('Review title')"
          :required="true"
          :valid="titleBlur || validText(title)"
          :error-message="
            $t(
              'Please type review title. It should have at least three characters.'
            )
          "
          @blur="titleBlur = false"
        />
        <SfRating :max="5" :score="Number(rating)" />
        <SfSelect
          class="form__element"
          :label="$t('Review rating')"
          :required="true"
          v-model="rating"
        >
          <SfSelectOption
            v-for="star in Array.from(Array(6).keys())"
            :key="star"
            class="form__element"
            :value="star"
            >{{ star }}</SfSelectOption
          >
        </SfSelect>
        <SfTextarea
          v-model="message"
          class="form__element"
          :label="$t('Review message')"
          name="message"
          :placeholder="$t('type review message')"
          cols="50"
          rows="5"
          :required="true"
          :valid="messageBlur || validText(message)"
          :error-message="
            $t(
              'Please type review message. It should have at least three characters.'
            )
          "
          @blur="messageBlur = false"
        />
        <SfButton type="submit">{{ $t('Submit') }}</SfButton>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { useReview } from '~/composables/useReview';
import {
  SfButton,
  SfInput,
  SfTextarea,
  SfRating,
  SfSelect
} from '@storefront-ui/vue';
import { CreateProductReviewProps, ReviewRating } from '@vsf-enterprise/bigcommerce-api';

export default defineComponent({
  name: 'AddReviewForm',

  components: {
    SfButton,
    SfInput,
    SfTextarea,
    SfRating,
    SfSelect
  },

  props: {
    productId: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const { add } = useReview();
    const isFormVisible = ref(false);
    const isThanksVisible = ref(false);
    const title = ref('');
    const rating = ref('');
    const message = ref('');
    const titleBlur = ref(true);
    const messageBlur = ref(true);

    const showForm = () => {
      isThanksVisible.value = false;
      isFormVisible.value = true;
    };

    const validText = (text) => {
      return text.length >= 3;
    };

    const submit = (e) => {
      e.preventDefault();

      if (!(validText(message.value) && validText(title.value))) {
        titleBlur.value = false;
        messageBlur.value = false;
        return;
      }

      const params: CreateProductReviewProps = {
        productId: props.productId,
        title: title.value,
        text: message.value,
        rating: Number(rating.value) as ReviewRating
      };

      add(params);

      titleBlur.value = true;
      messageBlur.value = true;
      title.value = '';
      message.value = '';
      rating.value = String(5);
      isFormVisible.value = false;
      isThanksVisible.value = true;
    };

    return {
      isFormVisible,
      isThanksVisible,
      title,
      rating,
      message,
      showForm,
      submit,
      titleBlur,
      messageBlur,
      validText
    };
  }
});
</script>

<style lang="scss" scoped>
@import '~@storefront-ui/vue/styles';
.form {
  .sf-rating {
    padding: 0 0 var(--spacer-sm) 0;
    &__icon {
      --icon-size: var(--font-size--lg) !important;
    }
  }
  padding: var(--spacer-sm) 0;
  &__group {
    display: flex;
    align-items: flex-start;
  }
  &__action-button {
    &:first-child {
      margin: var(--spacer-sm) 0 0 0;
    }
    &--secondary {
      margin: var(--spacer-sm) 0 var(--spacer-sm) var(--spacer-base);
    }
  }
  &__button {
    --button-width: 100%;
  }
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    margin: 0 var(--spacer-2xl) 0 0;
    &:last-of-type {
      margin: 0 calc(var(--spacer-2xl) - var(--spacer-sm)) 0 0;
    }
    &__element {
      margin: 0 0 var(--spacer-sm) 0;
      flex: 0 0 100%;
      &--half {
        flex: 1 1 50%;
        &-even {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
      &--range {
        margin: var(--spacer-xl) var(--spacer-base) var(--spacer-2xl);
      }
    }
    &__action {
      flex: 0 0 100%;
      display: flex;
    }
    &__button {
      --button-width: auto;
    }
  }
}
</style>
