import type { OrdersQuery } from "../../../api/types";

export const ALL_ORDERS_QUERY_KEY = ["orders"] as const;

export function ordersQueryKey(query: OrdersQuery) {
  return [...ALL_ORDERS_QUERY_KEY, query] as const;
}
