import { ref, useContext } from '@nuxtjs/composition-api';
import {
  Cart,
  COOKIE_KEY_CART_ID,
  Product
} from '@vsf-enterprise/bigcommerce-api';
import { storeToRefs } from 'pinia';
import { useCartStore, useCustomerStore } from '~/stores';
import {
  UseCartInterface,
  CartItem,
  UseCartErrors
} from '~/composables/useCart/types';
import {
  getCartIncludeParamValue,
  areLineItemsEmpty,
  isGuestCart,
  trimObjectToLineItem
} from '~/composables/useCart/helpers';
import { useLogger } from '~/composables/useLogger';
import { getPurchasableDefaultVariant } from '~/composables/useProduct/helpers';
import { BIGCOMMERCE_USER_CART_KEY } from '~/composables/useUser/helpers';

/**
 * @public
 *
 * Allows loading and manipulating cart of the current user.
 *
 * See the {@link UseCartInterface} for a list of methods and values available in this composable.
 */
export function useCart(): UseCartInterface {
  const { $bigcommerce, $config } = useContext();
  const loading = ref(false);
  const { Logger } = useLogger();
  const cartStore = useCartStore();
  const customerStore = useCustomerStore();
  const { cart: currentCart } = storeToRefs(cartStore);
  const { currentCustomer, isAuthenticated } = storeToRefs(customerStore);
  const error = ref<UseCartErrors>({
    addItem: null,
    removeItem: null,
    updateItemQty: null,
    load: null,
    loadCustomerCart: null,
    clear: null
  });

  const cookies = $bigcommerce.config.app.$cookies;
  const userCartKey: string =
    $config.theme?.userCartKey || BIGCOMMERCE_USER_CART_KEY;

  const setCart = (cart: Cart) => {
    cookies.set(COOKIE_KEY_CART_ID, cart.id, {
      path: '/',
      maxAge: $config.theme.bigcommerceCookieMaxAge
    });

    currentCart.value = cart;
  };

  const getCart = async (cartId: string): Promise<Cart> => {
    const { data } = await $bigcommerce.api.getCart({
      id: cartId,
      include: getCartIncludeParamValue()
    });

    return data;
  };

  const createCart = async (): Promise<Cart> => {
    const { data } = await $bigcommerce.api.createCart({
      data: {
        line_items: []
      },
      include: getCartIncludeParamValue()
    });

    return data;
  };

  const getCustomerCart = async (): Promise<Cart | null> => {
    const customerCartField = currentCustomer.value.form_fields?.find(
      (formField) => formField.name === userCartKey
    );

    if (!customerCartField) {
      return null;
    }

    cookies.remove(COOKIE_KEY_CART_ID);

    return await getCart(String(customerCartField.value));
  };

  const setAndAssignCartToCustomer = async (cartId: string) => {
    const [newCart] = await Promise.all([
      $bigcommerce.api.updateCart({
        id: cartId,
        include: getCartIncludeParamValue()
      }),
      $bigcommerce.api.updateCustomerFormFields({
        data: [
          {
            name: userCartKey,
            value: cartId
          }
        ]
      })
    ]);

    setCart(newCart.data);
  };

  const loadCustomerCart = async () => {
    try {
      loading.value = true;
      error.value.loadCustomerCart = null;

      try {
        const userCart = await getCustomerCart();

        if (!userCart) {
          return await setAndAssignCartToCustomer(currentCart.value.id);
        }

        if (
          !isGuestCart(currentCart.value) ||
          areLineItemsEmpty(currentCart.value.line_items)
        ) {
          setCart(userCart);
          return;
        }

        const cartToOperateOn = userCart || currentCart.value;

        const { data: mergedCart } = await $bigcommerce.api.addCartItems({
          cartId: cartToOperateOn.id,
          include: getCartIncludeParamValue(),
          data: {
            line_items: [
              ...currentCart.value.line_items.digital_items,
              ...currentCart.value.line_items.physical_items.map((item) =>
                trimObjectToLineItem(item)
              )
            ]
          }
        });

        await setAndAssignCartToCustomer(mergedCart.id);
      } catch (_) {
        const newCart = await createCart();
        await setAndAssignCartToCustomer(newCart.id);
      }
    } catch (err) {
      Logger.error('useCart/loadCustomerCart', err);
      error.value.loadCustomerCart = err;
    } finally {
      loading.value = false;
    }
  };

  const load = async (forceNew?: boolean) => {
    try {
      loading.value = true;
      error.value.load = null;

      const cartIdToLoad = cookies.get(COOKIE_KEY_CART_ID);

      if (!cartIdToLoad || forceNew) {
        const cart = await createCart();

        if (isAuthenticated.value) {
          return setAndAssignCartToCustomer(cart.id);
        }

        return setCart(cart);
      }

      try {
        const cart = await getCart(cartIdToLoad);
        setCart(cart);
      } catch (_) {
        const cart = await createCart();
        setCart(cart);
      }
    } catch (err) {
      Logger.error('useCart/load', err);
      error.value.load = err;
    } finally {
      loading.value = false;
    }
  };

  const addItem = async (
    product: Product,
    quantity = 1,
    variantId?: number
  ) => {
    try {
      loading.value = true;
      error.value.addItem = null;

      if (!currentCart.value?.id) {
        throw new Error('There is no cart to add the item to.');
      }

      let variantIdToCart = variantId || undefined;

      if (product.variants?.length && !variantId) {
        variantIdToCart = getPurchasableDefaultVariant(product)?.id;
      }

      const { data: cart } = await $bigcommerce.api.addCartItems({
        cartId: currentCart.value.id,
        include: getCartIncludeParamValue(),
        data: {
          line_items: [
            {
              product_id: product.id,
              quantity,
              variant_id: variantIdToCart
            }
          ]
        }
      });

      setCart(cart);
    } catch (err) {
      Logger.error('useCart/addItem', err);
      error.value.addItem = err;
    } finally {
      loading.value = false;
    }
  };

  const removeItem = async (cartItem: CartItem) => {
    try {
      loading.value = true;
      error.value.removeItem = null;

      if (!currentCart.value?.id) {
        throw new Error('There is no cart to remove the item from.');
      }

      const { data: cart } = await $bigcommerce.api.removeCartItem({
        cartId: currentCart.value.id,
        itemId: String(cartItem.id),
        include: getCartIncludeParamValue()
      });

      if (!cart) {
        // no item remained in the cart, so it is deleted automatically and have to create a new cart
        cookies.remove(COOKIE_KEY_CART_ID);
        return await load(true);
      }

      setCart(cart);
    } catch (err) {
      Logger.error('useCart/removeItem', err);
      error.value.removeItem = err;
    } finally {
      loading.value = false;
    }
  };

  const updateItemQty = async (cartItem: CartItem, quantity: number) => {
    try {
      loading.value = true;
      error.value.updateItemQty = null;

      if (!currentCart.value?.id) {
        throw new Error('There is no cart to update product quantity in.');
      }

      const { data: cart } = await $bigcommerce.api.updateCartItem({
        cartId: currentCart.value.id,
        itemId: String(cartItem.id),
        include: getCartIncludeParamValue(),
        data: {
          line_item: {
            quantity,
            product_id: Number(cartItem.product_id)
          }
        }
      });

      setCart(cart);
    } catch (err) {
      Logger.error('useCart/updateItemQty', err);
      error.value.updateItemQty = err;
    } finally {
      loading.value = false;
    }
  };

  const clear = async () => {
    try {
      loading.value = true;
      error.value.clear = null;

      if (!currentCart.value?.id) {
        throw new Error('There is no cart to clear.');
      }

      await $bigcommerce.api.deleteCart({
        id: currentCart.value.id
      });

      cookies.remove(COOKIE_KEY_CART_ID);

      await load(true);
    } catch (err) {
      Logger.error('useCart/clear', err);
      error.value.clear = err;
    } finally {
      loading.value = false;
    }
  };

  const isInCart = (product: Product) => {
    let variantId = 0;

    if (!currentCart.value) return false;

    if (product.variants?.length) {
      variantId = getPurchasableDefaultVariant(product)?.id ?? 0;
    }

    return [
      ...cartStore.cart.line_items.digital_items,
      ...cartStore.cart.line_items.physical_items
    ].some(
      (item) =>
        item.product_id === product.id &&
        (!variantId || item.variant_id === variantId)
    );
  };

  return {
    load,
    loadCustomerCart,
    addItem,
    removeItem,
    updateItemQty,
    clear,
    isInCart,
    loading,
    error
  };
}
