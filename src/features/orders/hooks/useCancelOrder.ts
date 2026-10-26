import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "../../../api/client";
import type { Order, OrdersPage } from "../../../api/types";
import { withUpdatedOrder } from "../domain/withUpdatedOrder";
import { ALL_ORDERS_QUERY_KEY } from "./ordersQueryKey";

export function useCancelOrder() {
  const queryClient = useQueryClient();

  function showCancelledOrder(cancelledOrder: Order): void {
    queryClient.setQueriesData<OrdersPage>({ queryKey: ALL_ORDERS_QUERY_KEY }, (page) =>
      page ? withUpdatedOrder(page, cancelledOrder) : page,
    );
  }

  function refreshOrders(): Promise<void> {
    return queryClient.invalidateQueries({ queryKey: ALL_ORDERS_QUERY_KEY });
  }

  return useMutation({ mutationFn: cancelOrder, onSuccess: showCancelledOrder, onSettled: refreshOrders });
}
