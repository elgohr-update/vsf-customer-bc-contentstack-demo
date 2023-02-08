import {
  InventoryTrackingType,
  Product,
  ProductVariant,
  ProductOption
} from '@vsf-enterprise/bigcommerce-api';
import { Price } from '~/composables/types';
import { InventoryValue } from '../types';

const isInInventory = (product: Product, variant?: ProductVariant): boolean => {
  switch (product.inventory_tracking) {
    case InventoryTrackingType.none:
      return true;
    case InventoryTrackingType.product:
      return product.inventory_level >= 1;
    case InventoryTrackingType.variant:
      return variant && variant.inventory_level >= 1;
    default:
      return false;
  }
};

export const getNonLocalisedPath = (
  product: Product
): `/p/${number}/${string}` => {
  const matchSpecialCaseAndSpaces = /([~!@#$%^&*()_+=`{}[\]|\\:;'<>,./? ])+/g;
  const slug =
    product?.name
      .replace(matchSpecialCaseAndSpaces, '-')
      .replace(/^-+/, '')
      .replace(/-+/g, '-') ?? '';

  // By default it casts the type to string so it has to be coerced
  return `/p/${product.id}/${slug}` as `/p/${number}/${string}`;
};

export const getCoverImageUrl = (product: Product): string => {
  const thumbnailUrl = product.images.find(
    (image) => Boolean(image.url_thumbnail)
  )?.url_thumbnail;
  return thumbnailUrl ?? product.images[0]?.image_url ?? '';
};

export const getAverageRating = (product: Product): number => {
  return product?.reviews_rating_sum && product?.reviews_count
    ? product.reviews_rating_sum / product.reviews_count
    : 0;
};

export const getActiveVariant = (
  product: Product,
  configuration: Record<string, any>
): ProductVariant => {
  if (!product || !configuration) return null;
  return product.variants.find((variant) => {
    return Object.entries(configuration).every(([optionKey, optionValue]) => {
      return variant.option_values.some(
        (variantOption) =>
          variantOption.option_display_name === optionKey &&
          variantOption.label === optionValue
      );
    });
  });
};

export const getRelatedProductsIds = (product: Product): number[] => {
  const hasRelatedProducts = product.related_products?.[0] !== -1;
  return hasRelatedProducts ? product.related_products : [];
};

export const getConfigurationOptions = (
  product: Product,
  filterByOptionName?: string[]
): ProductOption[] => {
  if (!filterByOptionName || !filterByOptionName.length)
    return product.options ?? [];
  return (
    product.options?.filter((option) =>
      filterByOptionName.includes(option.display_name)
    ) || []
  );
};

export const getVariantById = (
  product: Product,
  variantId: number
): ProductVariant => {
  return product.variants?.find((variant) => variant.id === variantId);
};

export const createPriceObject = (
  product?: Product,
  activeVariant?: ProductVariant
): Price => {
  if (product?.is_price_hidden) {
    return {
      regular: 0,
      special: 0
    };
  }

  return {
    regular: activeVariant?.price ?? product.price ?? 0,
    special: activeVariant?.sale_price ?? product.sale_price ?? 0
  };
};

export const createIntentoryObjectFromType = (
  product: Product,
  activeVariant?: ProductVariant
): InventoryValue => {
  const InventoryTrackingTypeToInventoryObjectMap = {
    [InventoryTrackingType.none]: {
      enabled: false
    },
    [InventoryTrackingType.product]: {
      enabled: true,
      current: product.inventory_level,
      warningLevel: product.inventory_warning_level
    },
    [InventoryTrackingType.variant]: {
      enabled: true,
      current: activeVariant?.inventory_level,
      warningLevel: activeVariant?.inventory_warning_level
    }
  };
  return (
    InventoryTrackingTypeToInventoryObjectMap[product.inventory_tracking] || {
      enabled: false
    }
  );
};

const getDefaultVariant = (product: Product): ProductVariant | undefined => {
  const defaultOptions = product.options.reduce((optionsDictionary, option) => {
    const defaultOption = option.option_values.find(
      (optionValue) => optionValue.is_default
    );
    const defaultOptionLabel =
      defaultOption?.label ?? option.option_values[0].label;
    optionsDictionary[option.display_name] = defaultOptionLabel;
    return optionsDictionary;
  }, {});

  return getActiveVariant(product, defaultOptions);
};

export const getPurchasableDefaultVariant = (
  product: Product
): ProductVariant | null => {
  const defaultVariant = getDefaultVariant(product);
  if (defaultVariant && !defaultVariant.purchasing_disabled) {
    switch (product?.inventory_tracking) {
      case InventoryTrackingType.none:
        return defaultVariant;
      case InventoryTrackingType.product:
        if (product.inventory_level >= 1) {
          return defaultVariant;
        }

        break;
      case InventoryTrackingType.variant:
        if (defaultVariant.inventory_level >= 1) {
          return defaultVariant;
        }

        break;
      default:
        return defaultVariant;
    }
  }

  const purchasableVariant = product.variants.find((variant) => {
    if (variant.purchasing_disabled) return false;
    return isInInventory(product, variant);
  });
  return purchasableVariant ?? null;
};

export const canBeAddedToCart = (product: Product): boolean => {
  if (!product) {
    return false;
  }

  const hasVariants = Boolean(product.variants.length);
  if (hasVariants) return Boolean(getPurchasableDefaultVariant(product));
  if (product.inventory_tracking === InventoryTrackingType.variant)
    return false;
  return isInInventory(product);
};
