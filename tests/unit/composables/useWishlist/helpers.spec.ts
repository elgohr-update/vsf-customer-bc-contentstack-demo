import { expect } from '@jest/globals';
import { Wishlist } from '~/composables/useWishlist/types';
import { InventoryTrackingType, Product } from '@vsf-enterprise/bigcommerce-api';
import { wishlistMock } from '~/tests/__mocks__/wishlist.mock';
import { mockedProduct } from '~/tests/__mocks__/product.mock';
import {
  getItems,
  getTotals,
  getItemName,
  getItemImage,
  getItemPrice,
  getItemSku,
  getShippingPrice,
  getTotalItems,
  getItemQty,
  isItemPurchasable
} from '~/composables/useWishlist/helpers';
import { themeConfigMock } from '~/tests/__mocks__/themeConfig.mock';

jest.mock('@nuxtjs/composition-api', () => ({
  useContext: () => ({
    $config: {
      theme: themeConfigMock
    }
  })
}));

describe('[bigcommerce-theme] useWishlist helpers', () => {
  const wishlistItem = { id: '77_1', product_id: 77, variant_id: 1 };

  describe('[bigcommerce-theme] useWishlist helpers: getItems', () => {
    it('should return array of items', () => {
      expect(getItems(wishlistMock as Wishlist)).toStrictEqual(
        wishlistMock.items
      );
    });
  });

  describe('[bigcommerce-theme] useWishlist helpers: getTotals', () => {
    it('should return totals', () => {
      const expectedTotals = { subtotal: 49, total: 49 };
      expect(getTotals(wishlistMock as Wishlist)).toStrictEqual(
        expectedTotals
      );
    });
  });

  describe('[bigcommerce-theme] useWishlist helpers: getItemName', () => {
    it('should return product name', () => {
      expect(
        getItemName(wishlistMock as Wishlist, wishlistItem)
      ).toBe(mockedProduct.name);
    });
  });

  describe('[bigcommerce-theme] useWishlist helpers: getItemImage', () => {
    it('should return product cover image', () => {
      const expectedImage =
        'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/77/images/265/foglinenbeigestripetowel3b.1633499289.220.290.jpg?c=1';
      expect(
        getItemImage(wishlistMock as Wishlist, wishlistItem)
      ).toBe(expectedImage);
    });
  });

  describe('[bigcommerce-theme] useWishlist helpers: getItemPrice', () => {
    it('should return product price', () => {
      const expectedPrice = { regular: 49, special: 0 };
      expect(
        getItemPrice(wishlistMock as Wishlist, wishlistItem)
      ).toStrictEqual(expectedPrice);
    });
  });

  describe('[bigcommerce-theme] useWishlist helpers: getItemSku', () => {
    it('should return product sku', () => {
      expect(
        getItemSku(wishlistMock as Wishlist, wishlistItem)
      ).toBe(mockedProduct.sku);
    });
  });

  describe('[bigcommerce-theme] useWishlist helpers: getShippingPrice', () => {
    it('should return shipping price for the wishlist', () => {
      expect(getShippingPrice(wishlistMock as Wishlist)).toBe(0);
    });
  });

  describe('[bigcommerce-theme] useWishlist helpers: getTotalItems', () => {
    it('should return total amount of the items', () => {
      expect(getTotalItems(wishlistMock as Wishlist)).toBe(
        wishlistMock.items.length
      );
    });
  });

  describe('[bigcommerce-theme] useWishlist helpers: getItemQty', () => {
    it('should return item qty', () => {
      const expectedQty = 5;
      expect(
        getItemQty(wishlistMock as Wishlist, wishlistItem)
      ).toBe(expectedQty);
    });
  });

  describe('[bigcommerce-theme] useWishlist helpers: isItemPurchasable', () => {
    it('isItemPurchasable should return true if inventory tracking is disabled', () => {
      const result = isItemPurchasable(
        wishlistMock as Wishlist,
        wishlistItem
      );

      expect(result).toEqual(true);
    });

    it('isItemPurchasable should return true if inventory tracking is set to product and there is available stock', () => {
      const wishlist = {
        ...wishlistMock,
        wishlist_product_data: {
          data: [
            {
              ...mockedProduct,
              inventory_tracking: InventoryTrackingType.product
            } as Product
          ],
          meta: {}
        }
      };

      const result = isItemPurchasable(
        wishlist,
        wishlistItem
      );

      expect(result).toEqual(true);
    });

    it('isItemPurchasable should return false if inventory tracking is set to product and stock is empty', () => {
      const wishlist = {
        ...wishlistMock,
        wishlist_product_data: {
          data: [
            {
              ...mockedProduct,
              inventory_tracking: InventoryTrackingType.product,
              inventory_level: 0
            } as Product
          ],
          meta: {}
        }
      };

      const result = isItemPurchasable(
        wishlist,
        wishlistItem
      );

      expect(result).toEqual(false);
    });

    it('isItemPurchasable should return true if inventory tracking is set to variant and there is available stock for the default variant', () => {
      const wishlist = {
        ...wishlistMock,
        wishlist_product_data: {
          data: [
            {
              ...mockedProduct,
              inventory_tracking: InventoryTrackingType.variant,
              variants: mockedProduct.variants.map((variant) => {
                if (variant.id === 1) {
                  return { ...variant, inventory_level: 3 };
                }

                return variant;
              })
            } as Product
          ],
          meta: {}
        }
      };

      const result = isItemPurchasable(
        wishlist,
        wishlistItem
      );

      expect(result).toEqual(true);
    });

    it('isItemPurchasable should return false if inventory tracking is set to variant and there is no available stock for the variant', () => {
      const wishlist = {
        ...wishlistMock,
        wishlist_product_data: {
          data: [
            {
              ...mockedProduct,
              inventory_tracking: InventoryTrackingType.variant
            } as Product
          ],
          meta: {}
        }
      };

      const result = isItemPurchasable(
        wishlist,
        wishlistItem
      );

      expect(result).toEqual(false);
    });
  });
});
