import type { Order, OrdersPage } from "../../../api/types";

export function withUpdatedOrder(page: OrdersPage, updatedOrder: Order): OrdersPage {
  return {
    ...page,
    orders: page.orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)),
  };
}
