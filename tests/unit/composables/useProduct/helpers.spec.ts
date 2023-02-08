import { expect } from '@jest/globals';
import { InventoryTrackingType, Product } from '@vsf-enterprise/bigcommerce-api';
import { createPriceObject, getCoverImageUrl, canBeAddedToCart, getAverageRating, getRelatedProductsIds, getConfigurationOptions, getActiveVariant, createIntentoryObjectFromType } from '~/composables/useProduct/helpers';

import { mockedProduct } from '~/tests/__mocks__/product.mock';

describe('[bigcommerce-theme] useProduct utils', () => {
  describe('createPriceObject', () => {
    it('returns price object', async () => {
      const priceData = createPriceObject(mockedProduct as Product);

      expect(priceData.regular).toEqual(49);
      expect(priceData.special).toEqual(0);
    });

    it('returns 0 values when price is hidden', async () => {
      const priceData = createPriceObject({
        ...mockedProduct,
        is_price_hidden: true
      } as Product);

      expect(priceData.regular).toEqual(0);
      expect(priceData.special).toEqual(0);
    });
  });
  describe('getCoverImageUrl', () => {
    it('returns the url of the standard version of thumbnail image', async () => {
      expect(getCoverImageUrl(mockedProduct as Product)).toEqual(
        'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/77/images/265/foglinenbeigestripetowel3b.1633499289.220.290.jpg?c=1'
      );
    });
  });
  describe('getAverageRating', () => {
    it('returns the average rating of product review', async () => {
      expect(
        getAverageRating({
          ...mockedProduct,
          reviews_count: 3,
          reviews_rating_sum: 12
        } as Product)
      ).toEqual(4);
    });

    it('returns 0 when the product has no reviews', async () => {
      expect(getAverageRating(mockedProduct as Product)).toEqual(0);
    });
  });
  describe('getRelatedProductsIds', () => {
    it('returns the array of ids of related products', async () => {
      expect(getRelatedProductsIds(mockedProduct as Product)).toEqual(
        mockedProduct.related_products
      );
    });
  });
  describe('getConfigurationOptions', () => {
    it('returns the array of options configured on the product', async () => {
      expect(getConfigurationOptions(mockedProduct as Product)).toEqual(
        mockedProduct.options
      );
    });

    it('returns a subset of options configured on the product when the filter parameter is given', async () => {
      expect(getConfigurationOptions(mockedProduct as Product, ['Size'])).toEqual(
        mockedProduct.options.filter((option) => option.display_name === 'Size')
      );
    });
  });
  describe('getActiveVariant', () => {
    it('returns the variant which has the exact configuration defined by the second input parameter', async () => {
      expect(
        getActiveVariant(mockedProduct as Product, {
          Size: 'S',
          Color: 'Blue'
        }).option_values
      ).toEqual([
        {
          id: 69,
          label: 'S',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 10,
          label: 'Blue',
          option_display_name: 'Color',
          option_id: 109
        }
      ]);
    });
  });
  describe('createIntentoryObjectFromType', () => {
    it('returns enabled: false if the inventory_tracking is none', () => {
      expect(createIntentoryObjectFromType(mockedProduct as Product)).toEqual({
        enabled: false
      });
    });

    it('returns the stock data based on the product stock values if the inventory_tracking is product', () => {
      expect(
        createIntentoryObjectFromType({
          ...mockedProduct,
          inventory_tracking: 'product'
        } as Product)
      ).toEqual({
        enabled: true,
        current: mockedProduct.inventory_level,
        warningLevel: mockedProduct.inventory_warning_level
      });
    });

    it('returns the stock data based on the active variant if the inventory_tracking is variant', () => {
      expect(
        createIntentoryObjectFromType(
          {
            ...mockedProduct,
            inventory_tracking: 'variant'
          } as Product,
          mockedProduct.variants[2]
        )
      ).toEqual({
        enabled: true,
        current: mockedProduct.variants[2].inventory_level,
        warningLevel: mockedProduct.variants[2].inventory_warning_level
      });
    });

    describe('canBeAddedToCart', () => {
      it('returns true if inventory tracking is disabled', () => {
        const canBeAddedToCartResult = canBeAddedToCart(
          mockedProduct as Product
        );

        expect(canBeAddedToCartResult).toEqual(true);
      });

      it('returns true if inventory tracking is set to product and there is available stock', () => {
        const product = {
          ...mockedProduct,
          inventory_tracking: InventoryTrackingType.product,
          inventory_level: 10
        } as Product;

        const canBeAddedToCartResult = canBeAddedToCart(product);

        expect(canBeAddedToCartResult).toEqual(true);
      });

      it('returns false if inventory tracking is set to product and stock is empty', () => {
        const product = {
          ...mockedProduct,
          inventory_tracking: InventoryTrackingType.product,
          inventory_level: 0
        } as Product;

        const canBeAddedToCartResult = canBeAddedToCart(product);

        expect(canBeAddedToCartResult).toEqual(false);
      });

      it('returns true if inventory tracking is set to variant and there is available stock for the default variant', () => {
        const product = {
          ...mockedProduct,
          inventory_tracking: InventoryTrackingType.variant,
          variants: mockedProduct.variants.map((variant) => {
            if (variant.id === 3) {
              return { ...variant, inventory_level: 6 };
            }

            return variant;
          })
        } as Product;

        const canBeAddedToCartResult = canBeAddedToCart(product);

        expect(canBeAddedToCartResult).toEqual(true);
      });
      it('returns true if inventory tracking is set to variant and there is a non-default variant with stock', () => {
        const product = {
          ...mockedProduct,
          inventory_tracking: InventoryTrackingType.variant,
          variants: mockedProduct.variants.map((variant) => {
            if (variant.id === 2) {
              return { ...variant, inventory_level: 4 };
            }

            if (variant.id === 3) {
              return { ...variant, inventory_level: 0 };
            }

            return variant;
          })
        } as Product;

        const canBeAddedToCartResult = canBeAddedToCart(product);

        expect(canBeAddedToCartResult).toEqual(true);
      });

      it('returns false if inventory tracking is set to variant and there is no variant  with stock', () => {
        const product = {
          ...mockedProduct,
          inventory_tracking: InventoryTrackingType.variant,
          variants: mockedProduct.variants.map((variant) => {
            return { ...variant, inventory_level: 0 };
          })
        } as Product;

        const canBeAddedToCartResult = canBeAddedToCart(product);

        expect(canBeAddedToCartResult).toEqual(false);
      });
    });
  });
});
