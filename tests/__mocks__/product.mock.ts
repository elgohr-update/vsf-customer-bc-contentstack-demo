import {
  InventoryTrackingType,
  Product,
  ProductAvailability,
  ProductCondition,
  ProductGiftWrappingOptionType,
  ProductOpenGraphType,
  ProductOptionType,
  ProductType
} from '@vsf-enterprise/bigcommerce-api';

export const mockedFilterResponse = {
  meta: {
    totalItems: 1
  }
};

export const mockedProduct: Product = {
  availability: ProductAvailability.Available,
  availability_description: '',
  base_variant_id: null,
  bin_picking_number: '',
  brand_id: 0,
  calculated_price: 49,
  categories: [18, 23],
  condition: ProductCondition.New,
  cost_price: 0,
  custom_url: {
    is_customized: false,
    url: '/fog-linen-chambray-towel-beige-stripe/'
  },
  date_created: '2015-07-03T17:57:10+00:00',
  date_modified: '2021-10-20T14:37:28+00:00',
  depth: 0,
  description:
    '<p>The perfect beach towel: thin, lightweight and highly absorbent. Crafted by Fog Linen in Japan using soft Lithuanian linen, each towel rolls up for compact stowaway. Dry off after a refreshing dip in the ocean and stretch out on it for a sun bath. The thinness ensures a quick dry so you can have it rolled back up in your bag without soaking your belongings.</p>\n<p>Measures 75 x 145 cm/29.5 x 57 in</p>\n<p>100% Linen</p>',
  fixed_cost_shipping_price: 0,
  gift_wrapping_options_list: [],
  gift_wrapping_options_type: ProductGiftWrappingOptionType.Any,
  gtin: '',
  height: 0,
  id: 77,
  images: [
    {
      date_modified: '2021-10-06T05:48:09+00:00',
      description: '',
      id: 265,
      image_file: '%%SAMPLE%%/stencil/foglinenbeigestripetowel3b.jpg',
      is_thumbnail: false,
      product_id: 77,
      sort_order: 2,
      url_standard:
        'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/77/images/265/foglinenbeigestripetowel3b.1633499289.386.513.jpg?c=1',
      url_thumbnail:
        'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/77/images/265/foglinenbeigestripetowel3b.1633499289.220.290.jpg?c=1',
      url_tiny:
        'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/77/images/265/foglinenbeigestripetowel3b.1633499289.44.58.jpg?c=1',
      url_zoom:
        'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/77/images/265/foglinenbeigestripetowel3b.1633499289.1280.1280.jpg?c=1'
    },
    {
      date_modified: '2021-10-06T05:48:09+00:00',
      description: '',
      id: 267,
      image_file: '%%SAMPLE%%/stencil/foglinenbeigestripetowel2b.jpg',
      is_thumbnail: false,
      product_id: 77,
      sort_order: 1,
      url_standard:
        'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/77/images/267/foglinenbeigestripetowel2b.1633499289.386.513.jpg?c=1',
      url_thumbnail:
        'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/77/images/267/foglinenbeigestripetowel2b.1633499289.220.290.jpg?c=1',
      url_tiny:
        'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/77/images/267/foglinenbeigestripetowel2b.1633499289.44.58.jpg?c=1',
      url_zoom:
        'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/77/images/267/foglinenbeigestripetowel2b.1633499289.1280.1280.jpg?c=1'
    },
    {
      date_modified: '2021-10-06T05:48:09+00:00',
      description: '',
      id: 266,
      image_file: '%%SAMPLE%%/stencil/foglinenbeigestripetowel1b.jpg',
      is_thumbnail: true,
      product_id: 77,
      sort_order: 0,
      url_standard:
        'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/77/images/266/foglinenbeigestripetowel1b.1633499289.386.513.jpg?c=1',
      url_thumbnail:
        'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/77/images/266/foglinenbeigestripetowel1b.1633499289.220.290.jpg?c=1',
      url_tiny:
        'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/77/images/266/foglinenbeigestripetowel1b.1633499289.44.58.jpg?c=1',
      url_zoom:
        'https://cdn11.bigcommerce.com/s-moq5tdn0k6/products/77/images/266/foglinenbeigestripetowel1b.1633499289.1280.1280.jpg?c=1'
    }
  ],
  inventory_level: 5,
  inventory_tracking: InventoryTrackingType.none,
  inventory_warning_level: 3,
  is_condition_shown: false,
  is_featured: false,
  is_free_shipping: false,
  is_preorder_only: false,
  is_price_hidden: false,
  is_visible: true,
  layout_file: 'product.html',
  map_price: 0,
  meta_description: '',
  meta_keywords: [],
  mpn: '',
  name: '[Sample] Fog Linen Chambray Towel - Beige Stripe',
  open_graph_description: '',
  open_graph_title: '',
  open_graph_type: ProductOpenGraphType.Product,
  open_graph_use_image: true,
  open_graph_use_meta_description: true,
  open_graph_use_product_name: true,
  option_set_display: 'right',
  option_set_id: 14,
  options: [
    {
      config: [],
      display_name: 'Size',
      id: 108,
      name: 'Apparel sizes',
      option_values: [
        {
          id: 68,
          is_default: false,
          label: 'XS',
          sort_order: 0,
          value_data: null
        },
        {
          id: 69,
          is_default: false,
          label: 'S',
          sort_order: 1,
          value_data: null
        },
        {
          id: 70,
          is_default: true,
          label: 'M',
          sort_order: 2,
          value_data: null
        },
        {
          id: 71,
          is_default: false,
          label: 'L',
          sort_order: 3,
          value_data: null
        },
        {
          id: 72,
          is_default: false,
          label: 'XL',
          sort_order: 4,
          value_data: null
        }
      ],
      product_id: 77,
      sort_order: 0,
      type: ProductOptionType.Rectangles
    },
    {
      config: [],
      display_name: 'Color',
      id: 109,
      name: 'Colors',
      option_values: [
        {
          id: 7,
          is_default: false,
          label: 'Silver',
          sort_order: 1,
          value_data: {
            colors: ['#cccccc']
          }
        },
        {
          id: 8,
          is_default: false,
          label: 'Black',
          sort_order: 2,
          value_data: {
            colors: ['#000000']
          }
        },
        {
          id: 9,
          is_default: false,
          label: 'Purple',
          sort_order: 3,
          value_data: {
            colors: ['#700170']
          }
        },
        {
          id: 10,
          is_default: false,
          label: 'Blue',
          sort_order: 4,
          value_data: {
            colors: ['#123c91']
          }
        },
        {
          id: 11,
          is_default: false,
          label: 'Green',
          sort_order: 5,
          value_data: {
            colors: ['#0f961e']
          }
        },
        {
          id: 12,
          is_default: false,
          label: 'Yellow',
          sort_order: 6,
          value_data: {
            colors: ['#f0f005']
          }
        },
        {
          id: 13,
          is_default: false,
          label: 'Orange',
          sort_order: 7,
          value_data: {
            colors: ['#e35e20']
          }
        },
        {
          id: 39,
          is_default: false,
          label: 'Red',
          sort_order: 8,
          value_data: {
            colors: ['#e60c0c']
          }
        },
        {
          id: 14,
          is_default: false,
          label: 'Pink',
          sort_order: 9,
          value_data: {
            colors: ['#e841c1']
          }
        }
      ],
      product_id: 77,
      sort_order: 0,
      type: ProductOptionType.Swatch
    }
  ],
  order_quantity_maximum: 0,
  order_quantity_minimum: 0,
  page_title: '',
  preorder_message: '',
  preorder_release_date: null,
  price: 49,
  price_hidden_label: '',
  product_tax_code: '',
  related_products: [111],
  retail_price: 0,
  reviews_count: 0,
  reviews_rating_sum: 0,
  sale_price: 0,
  search_keywords: '',
  sku: 'SLCTBS',
  sort_order: 0,
  tax_class_id: 0,
  total_sold: 4,
  type: ProductType.Physical,
  upc: '',
  variants: [
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 1,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 68,
          label: 'XS',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 7,
          label: 'Silver',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-A9615491',
      sku_id: 70,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 2,
      image_url: '',
      inventory_level: 6,
      inventory_warning_level: 3,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 69,
          label: 'S',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 7,
          label: 'Silver',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-5596D19E',
      sku_id: 71,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 3,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 70,
          label: 'M',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 7,
          label: 'Silver',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-08950B35',
      sku_id: 72,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 4,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 71,
          label: 'L',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 7,
          label: 'Silver',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-7765C099',
      sku_id: 73,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 5,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 72,
          label: 'XL',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 7,
          label: 'Silver',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-FC402DAC',
      sku_id: 74,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 6,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 68,
          label: 'XS',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 8,
          label: 'Black',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-4404031B',
      sku_id: 75,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 7,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 69,
          label: 'S',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 8,
          label: 'Black',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-EBD25EBB',
      sku_id: 76,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 8,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 70,
          label: 'M',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 8,
          label: 'Black',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-6C6855B4',
      sku_id: 77,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 9,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 71,
          label: 'L',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 8,
          label: 'Black',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-2C8FBF3C',
      sku_id: 78,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 10,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 72,
          label: 'XL',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 8,
          label: 'Black',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-906CEB57',
      sku_id: 79,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 11,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 68,
          label: 'XS',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 9,
          label: 'Purple',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-B6062BD4',
      sku_id: 80,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 12,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 69,
          label: 'S',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 9,
          label: 'Purple',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-5819AF19',
      sku_id: 81,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 13,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 70,
          label: 'M',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 9,
          label: 'Purple',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-E4DD8E16',
      sku_id: 82,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 14,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 71,
          label: 'L',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 9,
          label: 'Purple',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-BC2B8DF2',
      sku_id: 83,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 15,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 72,
          label: 'XL',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 9,
          label: 'Purple',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-A588AB27',
      sku_id: 84,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 16,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 68,
          label: 'XS',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 10,
          label: 'Blue',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-CCAEAE80',
      sku_id: 85,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 17,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
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
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-AA87E3C9',
      sku_id: 86,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 18,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 70,
          label: 'M',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 10,
          label: 'Blue',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-7113955F',
      sku_id: 87,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 19,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 71,
          label: 'L',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 10,
          label: 'Blue',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-AF6BD618',
      sku_id: 88,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 20,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 72,
          label: 'XL',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 10,
          label: 'Blue',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-3E102384',
      sku_id: 89,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 21,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 68,
          label: 'XS',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 11,
          label: 'Green',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-9D20C568',
      sku_id: 90,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 22,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 69,
          label: 'S',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 11,
          label: 'Green',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-ADB96FB6',
      sku_id: 91,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 23,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 70,
          label: 'M',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 11,
          label: 'Green',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-DDB31DBA',
      sku_id: 92,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 24,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 71,
          label: 'L',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 11,
          label: 'Green',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-1FB01D8C',
      sku_id: 93,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 25,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 72,
          label: 'XL',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 11,
          label: 'Green',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-15688F0B',
      sku_id: 94,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 26,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 68,
          label: 'XS',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 12,
          label: 'Yellow',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-CB178380',
      sku_id: 95,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 27,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 69,
          label: 'S',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 12,
          label: 'Yellow',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-E8CD0FC8',
      sku_id: 96,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 28,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 70,
          label: 'M',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 12,
          label: 'Yellow',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-E0F9565B',
      sku_id: 97,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 29,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 71,
          label: 'L',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 12,
          label: 'Yellow',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-AC1B2718',
      sku_id: 98,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 30,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 72,
          label: 'XL',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 12,
          label: 'Yellow',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-65BF836D',
      sku_id: 99,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 31,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 68,
          label: 'XS',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 13,
          label: 'Orange',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-4B78DADB',
      sku_id: 100,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 32,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 69,
          label: 'S',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 13,
          label: 'Orange',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-4C827E7D',
      sku_id: 101,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 33,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 70,
          label: 'M',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 13,
          label: 'Orange',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-D5AC2CA3',
      sku_id: 102,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 34,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 71,
          label: 'L',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 13,
          label: 'Orange',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-3B1520F8',
      sku_id: 103,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 35,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 72,
          label: 'XL',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 13,
          label: 'Orange',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-99A2A51F',
      sku_id: 104,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 36,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 68,
          label: 'XS',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 39,
          label: 'Red',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-E90FEF02',
      sku_id: 105,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 37,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 69,
          label: 'S',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 39,
          label: 'Red',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-55462E47',
      sku_id: 106,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 38,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 70,
          label: 'M',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 39,
          label: 'Red',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-A818A1D5',
      sku_id: 107,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 39,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 71,
          label: 'L',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 39,
          label: 'Red',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-5A16741E',
      sku_id: 108,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 40,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 72,
          label: 'XL',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 39,
          label: 'Red',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-7A4493EA',
      sku_id: 109,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 41,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 68,
          label: 'XS',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 14,
          label: 'Pink',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-8E5DA4B2',
      sku_id: 110,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 42,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 69,
          label: 'S',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 14,
          label: 'Pink',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-440E68D3',
      sku_id: 111,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 43,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 70,
          label: 'M',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 14,
          label: 'Pink',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-2D8DC13D',
      sku_id: 112,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 44,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 71,
          label: 'L',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 14,
          label: 'Pink',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-70D1759E',
      sku_id: 113,
      upc: '',
      weight: null,
      width: null
    },
    {
      bin_picking_number: '0',
      calculated_price: 49,
      calculated_weight: 1,
      cost_price: 0,
      depth: null,
      fixed_cost_shipping_price: null,
      gtin: '',
      height: null,
      id: 45,
      image_url: '',
      inventory_level: 0,
      inventory_warning_level: 0,
      is_free_shipping: false,
      map_price: null,
      mpn: '',
      option_values: [
        {
          id: 72,
          label: 'XL',
          option_display_name: 'Size',
          option_id: 108
        },
        {
          id: 14,
          label: 'Pink',
          option_display_name: 'Color',
          option_id: 109
        }
      ],
      price: null,
      product_id: 77,
      purchasing_disabled: false,
      purchasing_disabled_message: '',
      retail_price: null,
      sale_price: null,
      sku: 'SLCTBS-C17A7D36',
      sku_id: 114,
      upc: '',
      weight: null,
      width: null
    }
  ],
  view_count: 63,
  warranty: '',
  weight: 1,
  width: 0
};

export const mockResultProducts = () => ({data: [{name: '[Sample] Smith Journal 14', type: 'Physical', sku: 'SM14', description: '<p>Volume 14 of Smith Journal is crammed with more than its fair share of sharp minds. Top of the list would have to be Solomon Shereshevsky, who remembered every single thing he&rsquo;d ever come across &ndash; a great skill to have when it came to party tricks, but enough to send him crackers. And then there&rsquo;s Delbert Trew who spends more time than you can imagine thinking about something very sharp indeed: barbed wire. You can&rsquo;t go past Samuel Morse, either, who was a famous portrait painter before he gave his name to the code he invented. What a genius! And we&rsquo;re pretty taken with Noel Turner, who was smart enough to get around some pretty weird New Zealand laws to invent a car that, for a while, was a huge success. As well, you&rsquo;ll find stories on a cross-dressing spy, a couple of Sydney nerds who revolutionised modern music, court illustration, big wheels, the dubious science of controlling the weather and a whole stack of other stuff.</p>\n<p>143 Pages</p>', weight: 1, price: 35, categories: [36], search_keywords: '', availability: 'undefined', condition: 'New', meta_keywords: [null], options: [], variants: [], option_set_id: 0, option_set_display: '', tax_class_id: 0, product_tax_code: '', inventory_tracking: 'none', fixed_cost_shipping_price: 0, is_free_shipping: false, bulk_pricing_rules: [{id: 0, quantity_min: 0, quantity_max: 0, type: '', amount: 0}], is_visible: false, is_featured: false, bin_picking_number: '', layout_file: '', sort_order: 0, is_condition_shown: false, view_count: 0, preorder_release_date: '', preorder_message: '', is_preorder_only: false, is_price_hidden: false, price_hidden_label: '', is_price_hidden_label: false, custom_url: {url: '', is_customized: false}, open_graph_type: 'product', open_graph_title: '', open_graph_description: '', open_graph_use_meta_description: false, open_graph_use_product_name: false, open_graph_use_image: false, total_sold: 0, videos: [], date_created: '', date_modified: '', modifiers: []}, {name: '[Sample] Smith Journal 13', type: 'Physical', sku: 'SM13', description: '<p>Volume 13 of Smith Journal is crammed with more than its fair share of sharp minds. Top of the list would have to be Solomon Shereshevsky, who remembered every single thing he&rsquo;d ever come across &ndash; a great skill to have when it came to party tricks, but enough to send him crackers. And then there&rsquo;s Delbert Trew who spends more time than you can imagine thinking about something very sharp indeed: barbed wire. You can&rsquo;t go past Samuel Morse, either, who was a famous portrait painter before he gave his name to the code he invented. What a genius! And we&rsquo;re pretty taken with Noel Turner, who was smart enough to get around some pretty weird New Zealand laws to invent a car that, for a while, was a huge success. As well, you&rsquo;ll find stories on a cross-dressing spy, a couple of Sydney nerds who revolutionised modern music, court illustration, big wheels, the dubious science of controlling the weather and a whole stack of other stuff.</p>\n<p>143 Pages</p>', weight: 1, price: 25, categories: [36], search_keywords: '', availability: 'undefined', condition: 'Used', meta_keywords: [null], options: [], variants: [], option_set_id: 0, option_set_display: '', tax_class_id: 0, product_tax_code: '', inventory_tracking: 'none', fixed_cost_shipping_price: 0, is_free_shipping: false, bulk_pricing_rules: [{id: 0, quantity_min: 0, quantity_max: 0, type: '', amount: 0}], is_visible: false, is_featured: false, bin_picking_number: '', layout_file: '', sort_order: 0, is_condition_shown: false, view_count: 0, preorder_release_date: '', preorder_message: '', is_preorder_only: false, is_price_hidden: false, price_hidden_label: '', is_price_hidden_label: false, custom_url: {url: '', is_customized: false}, open_graph_type: 'product', open_graph_title: '', open_graph_description: '', open_graph_use_meta_description: false, open_graph_use_product_name: false, open_graph_use_image: false, total_sold: 0, videos: [], date_created: '', date_modified: '', modifiers: []}], meta: {totalItems: 2}});

export const mockQueryProducts = () => ({
  site: {
    search: {
      searchProducts: {
        products: {
          collectionInfo: {
            totalItems: 2
          },
          edges: [
            {
              node: {
                name: '[Sample] Smith Journal 14',
                type: 'Physical',
                sku: 'SM14',
                description:
                  '<p>Volume 14 of Smith Journal is crammed with more than its fair share of sharp minds. Top of the list would have to be Solomon Shereshevsky, who remembered every single thing he&rsquo;d ever come across &ndash; a great skill to have when it came to party tricks, but enough to send him crackers. And then there&rsquo;s Delbert Trew who spends more time than you can imagine thinking about something very sharp indeed: barbed wire. You can&rsquo;t go past Samuel Morse, either, who was a famous portrait painter before he gave his name to the code he invented. What a genius! And we&rsquo;re pretty taken with Noel Turner, who was smart enough to get around some pretty weird New Zealand laws to invent a car that, for a while, was a huge success. As well, you&rsquo;ll find stories on a cross-dressing spy, a couple of Sydney nerds who revolutionised modern music, court illustration, big wheels, the dubious science of controlling the weather and a whole stack of other stuff.</p>\n<p>143 Pages</p>',
                weight: {
                  value: 1,
                  unit: 'kg'
                },
                width: null,
                condition: 'NEW',
                depth: null,
                height: null,
                prices: {
                  price: {
                    currencyCode: 'USD',
                    value: 35
                  },
                  retailPrice: null,
                  salePrice: null,
                  mapPrice: null
                },
                categories: {
                  edges: [
                    {
                      node: {
                        id: 'Q2F0ZWdvcnk6MzY=',
                        entityId: 36,
                        name: 'Magazines'
                      }
                    }
                  ]
                },
                brand: null,
                inventory: {
                  aggregated: null
                }
              }
            },
            {
              node: {
                name: '[Sample] Smith Journal 13',
                type: 'Physical',
                sku: 'SM13',
                description:
                  '<p>Volume 13 of Smith Journal is crammed with more than its fair share of sharp minds. Top of the list would have to be Solomon Shereshevsky, who remembered every single thing he&rsquo;d ever come across &ndash; a great skill to have when it came to party tricks, but enough to send him crackers. And then there&rsquo;s Delbert Trew who spends more time than you can imagine thinking about something very sharp indeed: barbed wire. You can&rsquo;t go past Samuel Morse, either, who was a famous portrait painter before he gave his name to the code he invented. What a genius! And we&rsquo;re pretty taken with Noel Turner, who was smart enough to get around some pretty weird New Zealand laws to invent a car that, for a while, was a huge success. As well, you&rsquo;ll find stories on a cross-dressing spy, a couple of Sydney nerds who revolutionised modern music, court illustration, big wheels, the dubious science of controlling the weather and a whole stack of other stuff.</p>\n<p>143 Pages</p>',
                weight: {
                  value: 1,
                  unit: 'kg'
                },
                width: null,
                depth: null,
                height: null,
                condition: 'USED',
                prices: {
                  price: {
                    currencyCode: 'USD',
                    value: 25
                  },
                  retailPrice: null,
                  salePrice: null,
                  mapPrice: null
                },
                categories: {
                  edges: [
                    {
                      node: {
                        id: 'Q2F0ZWdvcnk6MzY=',
                        entityId: 36,
                        name: 'Magazines'
                      }
                    }
                  ]
                },
                brand: null,
                inventory: {
                  aggregated: null
                }
              }
            }
          ]
        }
      }
    }
  }
});

