<template>
  <nav class="sf-pagination">
    <slot name="prev" v-bind="{ isDisabled: !canGoPrev, go, prev: getPrev }">
      <div
        :class="{ 'display-none': !hasArrows }"
        class="sf-pagination__item prev"
      >
        <SfButton
          :class="{
            'sf-arrow--transparent': !canGoPrev
          }"
          class="sf-button--pure"
          :disabled="!canGoPrev ? true : false"
          aria-label="Go to previous page"
          data-testid="pagination-button-prev"
          @click="!canGoPrev ? null : go(getPrev)"
        >
          <SfIcon icon="arrow_left" size="1.125rem" />
        </SfButton>
      </div>
    </slot>
    <template>
      <slot name="number" v-bind="{ page: 1 }">
        <SfButton
          class="sf-pagination__item"
          :class="{
            'sf-button--pure': !canGoPrev,
            'display-none': !showFirst
          }"
          @click="canGoPrev ? null : go(1)"
        >
          1
        </SfButton>
      </slot>
      <slot name="points">
        <div
          :class="{ 'display-none': firstVisiblePageNumber <= 2 }"
          class="sf-pagination__item"
        >
          ...
        </div>
      </slot>
    </template>
    <template v-for="page in limitedPageNumbers">
      <slot name="number" v-bind="{ page, currentPage }">
        <component
          :is="currentPage === page ? 'span' : 'SfButton'"
          :key="page"
          class="sf-pagination__item"
          :class="{
            'sf-button--pure': currentPage !== page,
            current: currentPage === page
          }"
          @click="currentPage !== page ? go(page) : null"
        >
          {{ page }}
        </component>
      </slot>
    </template>
    <template v-if="showLast">
      <slot name="points">
        <div
          :class="{
            'display-none': lastVisiblePageNumber >= total - 1
          }"
          class="sf-pagination__item"
        >
          ...
        </div>
      </slot>
      <slot name="number" v-bind="{ page: total }">
        <SfButton
          class="sf-pagination__item sf-button--pure"
          @click="go(total)"
        >
          {{ total }}
        </SfButton>
      </slot>
    </template>
    <slot name="next" v-bind="{ isDisabled: !canGoNext, go, next: getNext }">
      <div
        :class="{ 'display-none': !hasArrows }"
        class="sf-pagination__item next"
      >
        <SfButton
          class="sf-button--pure"
          :class="{
            'sf-arrow--transparent': !canGoNext
          }"
          :disabled="!canGoNext ? true : false"
          aria-label="Go to previous next"
          data-testid="pagination-button-next"
          @click="!canGoNext ? null : go(getNext)"
        >
          <SfIcon icon="arrow_right" size="1.125rem" />
        </SfButton>
      </div>
    </slot>
  </nav>
</template>
<script>
import { SfLink, SfIcon, SfButton } from '@storefront-ui/vue';
export default {
  name: 'InternalPagination',
  components: {
    SfIcon,
    SfLink,
    SfButton
  },
  props: {
    total: {
      type: Number,
      default: 0
    },
    navigate: {
      type: Function,
      required: true
    },
    visible: {
      type: Number,
      default: 5
    },
    hasArrows: {
      type: Boolean,
      default: true
    },
    current: {
      type: Number,
      default: 1
    },
    pageParamName: {
      type: String,
      default: 'page'
    }
  },
  computed: {
    currentPage() {
      return this.current || 1;
    },
    getPrev() {
      return this.currentPage === this.firstVisiblePageNumber
        ? this.currentPage
        : this.currentPage - 1;
    },
    canGoPrev() {
      return this.currentPage !== this.firstVisiblePageNumber;
    },
    getNext() {
      return this.currentPage === this.lastVisiblePageNumber
        ? this.currentPage
        : this.currentPage + 1;
    },
    canGoNext() {
      return this.currentPage !== this.lastVisiblePageNumber;
    },
    showFirst() {
      return this.firstVisiblePageNumber > 1;
    },
    showLast() {
      return this.lastVisiblePageNumber < this.total;
    },
    listOfPageNumbers() {
      return Array.from(Array(this.total), (_, i) => i + 1);
    },
    limitedPageNumbers() {
      if (this.total <= this.visible) {
        return this.listOfPageNumbers;
      }

      if (this.currentPage < this.visible - Math.floor(this.visible / 2) + 1) {
        return this.listOfPageNumbers.slice(0, this.visible);
      }

      if (
        this.total - this.currentPage <
        this.visible - Math.ceil(this.visible / 2) + 1
      ) {
        return this.listOfPageNumbers.slice(this.total - this.visible);
      }

      return this.listOfPageNumbers.slice(
        this.currentPage - Math.ceil(this.visible / 2),
        this.currentPage + Math.floor(this.visible / 2)
      );
    },
    firstVisiblePageNumber() {
      return this.limitedPageNumbers[0];
    },
    lastVisiblePageNumber() {
      return this.limitedPageNumbers[this.limitedPageNumbers.length - 1];
    }
  },
  methods: {
    go(page) {
      this.navigate(page);
    },
    getLinkTo(page) {
      return page.toString();
    }
  }
};
</script>
