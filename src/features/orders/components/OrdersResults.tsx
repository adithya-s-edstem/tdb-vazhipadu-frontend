import type { NavigateOptions } from "react-router";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { LoadingStatus } from "../../../shared/ui/LoadingStatus";
import { RetryableError } from "../../../shared/ui/RetryableError";
import type { OrdersFilters } from "../domain/ordersFiltersSearchParams";
import { useOrders } from "../hooks/useOrders";
import { useStayWithinLastPage } from "../hooks/useStayWithinLastPage";
import { OrdersPagination } from "./OrdersPagination";
import { OrdersTable } from "./OrdersTable";

interface OrdersResultsProps {
  filters: OrdersFilters;
  onPageChange: (page: number, options?: NavigateOptions) => void;
}

export function OrdersResults({ filters, onPageChange }: OrdersResultsProps) {
  const orders = useOrders(filters);
  useStayWithinLastPage(orders.isPlaceholderData ? undefined : orders.data, onPageChange);

  if (orders.isPending) {
    return <LoadingStatus message="Loading orders…" />;
  }
  if (orders.isLoadingError) {
    return (
      <RetryableError
        message="Could not load orders."
        isRetrying={orders.isFetching}
        onRetry={() => void orders.refetch()}
      />
    );
  }
  if (orders.data.total === 0) {
    return <EmptyState message="No orders match these filters." />;
  }
  return (
    <div aria-busy={orders.isFetching} className="space-y-3">
      <OrdersTable orders={orders.data.orders} />
      <OrdersPagination ordersPage={orders.data} onPageChange={onPageChange} />
    </div>
  );
}
