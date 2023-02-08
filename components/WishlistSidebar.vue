<template>
  <div id="wishlist">
    <SfSidebar
      :visible="isWishlistSidebarOpen"
      :button="false"
      title="My Wishlist"
      @close="toggleWishlistSidebar"
      class="sidebar sf-sidebar--right"
      position="right"
    >
      <template #title>
        <div class="heading__wrapper">
          <SfHeading :level="3" title="My wishlist" class="sf-heading--left" />
          <SfButton
            class="heading__close-button sf-button--pure"
            aria-label="Wishlist sidebar close button"
            @click="toggleWishlistSidebar"
          >
            <SfIcon icon="cross" size="14px" color="gray-primary" />
          </SfButton>
        </div>
      </template>
      <transition name="fade" mode="out-in">
        <div v-if="totalItems" class="my-wishlist" key="my-wishlist">
          <div class="my-wishlist__total-items">
            Total items: <strong>{{ totalItems }}</strong>
          </div>
          <div class="collected-product-list">
            <transition-group name="fade" tag="div">
              <SfCollectedProduct
                v-for="wishlistItem in wishlistItems"
                :key="wishlistGetItemSku(wishlist, wishlistItem)"
                :image="wishlistGetItemImage(wishlist, wishlistItem)"
                :title="wishlistGetItemName(wishlist, wishlistItem)"
                :regular-price="
                  $n(
                    wishListGetItemPrice(wishlist, wishlistItem).regular,
                    'currency'
                  )
                "
                :special-price="
                  wishListGetItemPrice(wishlist, wishlistItem).special &&
                  $n(
                    wishListGetItemPrice(wishlist, wishlistItem).special,
                    'currency'
                  )
                "
                :stock="wishlistGetItemQty(wishlist, wishlistItem)"
                :image-width="180"
                :image-height="200"
                @click:remove="removeItem(wishlistItem)"
                class="collected-product"
              >
                <template #configuration>
                  <div class="collected-product__properties">
                    <SfProperty
                      v-for="(attribute, key) in wishlistGetItemOptions(
                        wishlist,
                        wishlistItem,
                        ['color', 'size']
                      )"
                      :key="key"
                      :name="key"
                      :value="attribute"
                    />
                  </div>
                </template>
                <template #input="{}">&nbsp;</template>
                <template #actions>
                  <SfButton
                    :disabled="
                      cartLoading ||
                      !wishlistIsItemPurchasable(wishlist, wishlistItem)
                    "
                    class="sf-button--text desktop-only"
                    @click="moveToCart(wishlistItem)"
                  >
                    {{ $t('Add to cart') }}
                  </SfButton>
                </template>
                <template #more-actions>
                  <div></div>
                </template>
              </SfCollectedProduct>
            </transition-group>
          </div>
          <div class="sidebar-bottom">
            <SfProperty
              class="sf-property--full-width my-wishlist__total-price"
            >
              <template #name>
                <span class="my-wishlist__total-price-label">Total price:</span>
              </template>
              <template #value>
                <SfPrice :regular="$n(totals.subtotal, 'currency')" />
              </template>
            </SfProperty>
          </div>
        </div>
        <div v-else class="empty-wishlist" key="empty-wishlist">
          <div class="empty-wishlist__banner">
            <SfImage
              src="/icons/empty-cart.webp"
              alt="Empty bag"
              class="empty-wishlist__icon"
              :width="256"
              :height="173"
            />
            <SfHeading
              title="Your bag is empty"
              description="Looks like you haven’t added any items to the bag yet. Start
              shopping to fill it in."
              class="empty-wishlist__label"
            />
          </div>
        </div>
      </transition>
      <template #content-bottom>
        <SfLink
          link=""
          @click.prevent="clear"
          class="my-wishlist__clear"
          v-if="totalItems"
        >
          {{ $t('Clear wishlist') }}
        </SfLink>
        <SfButton
          class="sf-button--full-width color-secondary"
          @click="toggleWishlistSidebar"
        >
          {{ $t('Start shopping') }}
        </SfButton>
      </template>
    </SfSidebar>
  </div>
</template>
<script lang="ts">
import {
  SfSidebar,
  SfHeading,
  SfButton,
  SfIcon,
  SfProperty,
  SfPrice,
  SfCollectedProduct,
  SfImage,
  SfLink
} from '@storefront-ui/vue';
import { computed, defineComponent } from '@nuxtjs/composition-api';
import { useUiState, useCart, useWishlist } from '~/composables';
import {
  getItems as wishlistGetItems,
  getItemSku as wishlistGetItemSku,
  getTotals as wishlistGetTotals,
  getTotalItems as wishlistGetTotalItems,
  getProduct as wishlistGetProduct,
  getItemImage as wishlistGetItemImage,
  getItemName as wishlistGetItemName,
  getItemPrice as wishListGetItemPrice,
  getItemQty as wishlistGetItemQty,
  getItemOptions as wishlistGetItemOptions,
  isItemPurchasable as wishlistIsItemPurchasable
} from '~/composables/useWishlist/helpers';
import { storeToRefs } from 'pinia';
import { useWishlistStore } from '~/stores';

export default defineComponent({
  name: 'Wishlist',
  components: {
    SfSidebar,
    SfButton,
    SfHeading,
    SfIcon,
    SfProperty,
    SfPrice,
    SfCollectedProduct,
    SfImage,
    SfLink
  },
  setup() {
    const { addItem: addToCart, loading: cartLoading } = useCart();
    const { isWishlistSidebarOpen, toggleWishlistSidebar } = useUiState();
    const { wishlist } = storeToRefs(useWishlistStore());
    const { removeItem, clear } = useWishlist();
    const wishlistItems = computed(() => wishlistGetItems(wishlist.value));
    const totals = computed(() => wishlistGetTotals(wishlist.value));
    const totalItems = computed(() => wishlistGetTotalItems(wishlist.value));

    const moveToCart = async (wishlistItem) => {
      await addToCart(
        wishlistGetProduct(wishlist.value, wishlistItem),
        1,
        parseInt(wishlistItem.variant_id)
      );
    };

    return {
      wishlist,
      wishlistGetItemSku,
      wishlistGetItemImage,
      wishlistGetItemName,
      wishListGetItemPrice,
      wishlistGetItemQty,
      wishlistGetItemOptions,
      wishlistIsItemPurchasable,
      wishlistItems,
      removeItem,
      clear,
      isWishlistSidebarOpen,
      toggleWishlistSidebar,
      totals,
      totalItems,
      cartLoading,
      moveToCart
    };
  }
});
</script>

<style lang="scss" scoped>
.sidebar {
  --sidebar-z-index: 3;
  --overlay-z-index: 3;
  --sidebar-top-padding: var(--spacer-lg) var(--spacer-base) 0
    var(--spacer-base);
  --sidebar-content-padding: var(--spacer-lg) var(--spacer-base);
}

.my-wishlist {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    font: var(--font-weight--normal) var(--font-size--lg) / 1.6
      var(--font-family--secondary);
    color: var(--c-link);
    margin: 0;
  }
  &__total-price {
    --property-name-font-size: var(--font-size--xl);
    --price-font-size: var(--font-size--xl);
    margin: 0 0 var(--spacer-xl) 0;
    &-label {
      font: var(--font-weight--normal) var(--font-size--2xl) / 1.6
        var(--font-family--secondary);
      color: var(--c-link);
    }
  }
  &__clear {
    display: block;
    margin: var(--spacer-base) 0;
    font-size: var(--font-size--xl);
    text-align: center;
  }
}
.empty-wishlist {
  display: flex;
  flex: 1;
  flex-direction: column;
  &__banner {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  &__label,
  &__description {
    text-align: center;
  }
  &__label {
    --heading-description-margin: 0 0 var(--spacer-xl) 0;
    --heading-title-margin: 0 0 var(--spacer-xl) 0;
    --heading-title-color: var(--c-primary);
    --heading-title-font-weight: var(--font-weight--semibold);
    @include for-desktop {
      --heading-title-font-size: var(--font-size--xl);
      --heading-title-margin: 0 0 var(--spacer-sm) 0;
    }
  }
  &__icon {
    --image-width: 16rem;
    margin: 0 0 var(--spacer-2xl) 7.5rem;
  }
}
.heading {
  &__wrapper {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--semibold);
    display: flex;
    justify-content: space-between;
  }
}

.sidebar-bottom {
  margin: auto 0 0 0;
}

.collected-product {
  margin: var(--spacer-base) 0;
  &__properties {
    margin: var(--spacer-sm) 0 0 0;
  }
}
</style>
