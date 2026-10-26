import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../../../api/client";
import type { OrdersQuery } from "../../../api/types";
import { ordersQueryKey } from "./ordersQueryKey";

export function useOrders(query: OrdersQuery) {
  return useQuery({
    queryKey: ordersQueryKey(query),
    queryFn: () => getOrders(query),
    placeholderData: keepPreviousData,
  });
}
