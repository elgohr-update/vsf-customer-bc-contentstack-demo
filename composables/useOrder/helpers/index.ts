import { Order, OrderByCartResponse, OrderItem } from '@vsf-enterprise/bigcommerce-api';
import { OrderSummary } from '../types';

export function parseOrderItemTotalPrice(order: Order): number | null {
  return order?.total_inc_tax ? parseFloat(order?.total_inc_tax) : null;
}

export function parseOrderItemPrice(item: OrderItem): number {
  return item?.price_inc_tax ? parseFloat(item.price_inc_tax) : 0;
}

export function getItemAttributes(item: OrderItem): Record<string, string> {
  return (
    item?.product_options?.reduce((acc, attribute) => {
      acc[attribute.display_name] = attribute.display_value;

      return acc;
    }, {} as Record<string, string>) ?? {}
  );
}

export function mapOrderSummary(order: OrderByCartResponse): OrderSummary {
  const shippingAddress = order.shipping_addresses?.length ? order.shipping_addresses[0] : undefined;

  return {
    firstName: order.billing_address?.first_name,
    lastName: order.billing_address?.last_name,
    email: order.billing_address?.email,
    subtotal: order.subtotal_inc_tax,
    total: order.total_inc_tax,
    shipping: {
      streetName: shippingAddress?.street_1,
      city: shippingAddress?.city,
      zipCode: shippingAddress?.zip,
      country: shippingAddress?.country,
      phoneNumber: shippingAddress?.phone,
      shippingMethod: {
        value: shippingAddress?.shipping_method
      },
      cost: order.shipping_cost_inc_tax

    },
    payment: {
      streetName: order.billing_address?.street_1,
      city: order.billing_address?.city,
      zipCode: order.billing_address?.zip?.toString(),
      country: order.billing_address?.country,
      phoneNumber: order.billing_address?.phone?.toString(),
      paymentMethod: order.payment_method,
      shippingMethod: shippingAddress?.shipping_method
    },
    products: order.products
  };
}
