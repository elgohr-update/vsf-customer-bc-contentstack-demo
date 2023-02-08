<template>
  <div id="cart">
    <SfSidebar
      v-e2e="'sidebar-cart'"
      :visible="isCartSidebarOpen"
      title="My Cart"
      class="sf-sidebar--right"
      @close="toggleCartSidebar"
      position="right"
    >
      <template #content-top>
        <SfProperty
          v-if="totalItems"
          class="sf-property--large cart-summary desktop-only"
          name="Total items"
          :value="totalItems"
        />
      </template>
      <transition name="sf-fade" mode="out-in">
        <div v-if="totalItems" key="my-cart" class="my-cart">
          <div class="collected-product-list">
            <transition-group name="sf-fade" tag="div">
              <SfCollectedProduct
                v-for="product in products"
                v-e2e="'collected-product'"
                :key="getItemSku(product)"
                :image="getItemImage(product)"
                :title="getItemName(product)"
                :regular-price="$n(getItemPrice(product).regular, 'currency')"
                :has-more-actions="false"
                :special-price="
                  getItemPrice(product).special &&
                  $n(getItemPrice(product).special, 'currency')
                "
                :stock="99999"
                @click:remove="removeItem(product)"
                class="collected-product"
              >
                <template #configuration>
                  <div class="collected-product__properties">
                    <SfProperty
                      v-for="(attribute, key) in getItemAttributes(product)"
                      :key="key"
                      :name="key"
                      :value="attribute"
                    />
                  </div>
                </template>
                <template #input>
                  <div class="sf-collected-product__quantity-wrapper">
                    <SfQuantitySelector
                      :disabled="loading"
                      :qty="getItemQty(product)"
                      class="sf-collected-product__quantity-selector"
                      @input="
                        updateQuantity({ product, quantity: Number($event) })
                      "
                    />
                  </div>
                </template>
                <template #actions>
                  <div />
                </template>
                <template #more-actions>
                  <div />
                </template>
              </SfCollectedProduct>
            </transition-group>
          </div>
        </div>
        <div v-else key="empty-cart" class="empty-cart">
          <div class="empty-cart__banner">
            <SfImage
              alt="Empty bag"
              class="empty-cart__image"
              src="/icons/empty-cart.webp"
              :width="256"
              :height="173"
            />
            <SfHeading
              title="Your cart is empty"
              :level="2"
              class="empty-cart__heading"
              description="Looks like you haven’t added any items to the bag yet. Start
              shopping to fill it in."
            />
          </div>
        </div>
      </transition>
      <template #content-bottom>
        <transition name="sf-fade">
          <div v-if="totalItems">
            <SfProperty
              name="Subtotal price"
              class="sf-property--full-width sf-property--large my-cart__total-price"
            >
              <template #value>
                <SfPrice
                  :regular="$n(totals.subtotal, 'currency')"
                  :special="
                    totals.special !== totals.subtotal
                      ? $n(totals.special, 'currency')
                      : 0
                  "
                />
              </template>
            </SfProperty>
            <SfLink link="" @click.prevent="clearCart" class="my-cart__clear">
              {{ $t('Clear cart') }}
            </SfLink>
            <nuxt-link
              :to="
                localePath({
                  name: 'checkout',
                  query: { t: String(new Date().getTime()) }
                })
              "
            >
              <SfButton
                class="sf-button--full-width color-secondary"
                @click="toggleCartSidebar"
                data-e2e="go-to-checkout-btn"
              >
                {{ $t('Go to checkout') }}
              </SfButton>
            </nuxt-link>
          </div>
          <div v-else>
            <SfButton
              class="sf-button--full-width color-primary"
              @click="toggleCartSidebar"
              >{{ $t('Go back shopping') }}</SfButton
            >
          </div>
        </transition>
      </template>
    </SfSidebar>
  </div>
</template>
<script lang="ts">
import {
  SfSidebar,
  SfHeading,
  SfButton,
  SfProperty,
  SfPrice,
  SfLink,
  SfCollectedProduct,
  SfImage,
  SfQuantitySelector
} from '@storefront-ui/vue';
import { defineComponent } from '@nuxtjs/composition-api';
import { useUiState, useCart } from '~/composables';
import { useCartStore } from '~/stores/cart';
import { CartItem } from '~/composables/useCart/types';
import {
  getItemSku,
  getItemImage,
  getItemName,
  getItemPrice,
  getItemAttributes,
  getItemQty
} from '~/composables/useCart/helpers';
import debounce from 'lodash.debounce';
import { storeToRefs } from 'pinia';
import { useCustomerStore } from '../stores/customer';

export default defineComponent({
  name: 'Cart',
  components: {
    SfSidebar,
    SfButton,
    SfHeading,
    SfLink,
    SfProperty,
    SfPrice,
    SfCollectedProduct,
    SfImage,
    SfQuantitySelector
  },
  setup() {
    const { isCartSidebarOpen, toggleCartSidebar } = useUiState();
    const {
      cart,
      getTotals: totals,
      getTotalItems: totalItems,
      getItems: products
    } = storeToRefs(useCartStore());
    const { removeItem, updateItemQty, loading, clear: clearCart } = useCart();
    const { isAuthenticated } = storeToRefs(useCustomerStore());
    const DEBOUNCE_TIMEOUT = 500;

    const updateQuantity = debounce(
      async ({
        product,
        quantity
      }: {
        product: CartItem;
        quantity: number;
      }) => {
        await updateItemQty(product, quantity);
      },
      DEBOUNCE_TIMEOUT
    );

    return {
      updateQuantity,
      loading,
      isAuthenticated,
      products,
      removeItem,
      clearCart,
      isCartSidebarOpen,
      toggleCartSidebar,
      totals,
      totalItems,
      cart,
      getItemSku,
      getItemImage,
      getItemName,
      getItemPrice,
      getItemAttributes,
      getItemQty
    };
  }
});
</script>

<style lang="scss" scoped>
#cart {
  --sidebar-z-index: 3;
  --overlay-z-index: 3;
  @include for-desktop {
    & > * {
      --sidebar-bottom-padding: var(--spacer-base);
      --sidebar-content-padding: var(--spacer-base);
    }
  }
}
.cart-summary {
  margin-top: var(--spacer-xl);
}
.my-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    margin: 0;
  }
  &__total-price {
    --price-font-size: var(--font-size--xl);
    --price-font-weight: var(--font-weight--medium);
    margin: 0 0 var(--spacer-base) 0;
  }
  &__clear {
    display: block;
    margin: var(--spacer-base) 0;
    font-size: var(--font-size--xl);
    text-align: center;
  }
}
.empty-cart {
  --heading-description-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-color: var(--c-primary);
  --heading-title-font-weight: var(--font-weight--semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  &__banner {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
  &__heading {
    padding: 0 var(--spacer-base);
  }
  &__image {
    --image-width: 16rem;
    margin: 0 0 var(--spacer-2xl) 7.5rem;
  }
  @include for-desktop {
    --heading-title-font-size: var(--font-size--xl);
    --heading-title-margin: 0 0 var(--spacer-sm) 0;
  }
}
.collected-product-list {
  flex: 1;
}
.collected-product {
  margin: 0 0 var(--spacer-sm) 0;
  &__properties {
    margin: var(--spacer-xs) 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    flex: 2;
    &:first-child {
      margin-bottom: 8px;
    }
  }
  &__actions {
    transition: opacity 150ms ease-in-out;
  }
  &__save,
  &__compare {
    --button-padding: 0;
    &:focus {
      --cp-save-opacity: 1;
      --cp-compare-opacity: 1;
    }
  }
  &__save {
    opacity: var(--cp-save-opacity, 0);
  }
  &__compare {
    opacity: var(--cp-compare-opacity, 0);
  }
  &:hover {
    --cp-save-opacity: 1;
    --cp-compare-opacity: 1;
    @include for-desktop {
      .collected-product__properties {
        display: none;
      }
    }
  }
}
</style>
