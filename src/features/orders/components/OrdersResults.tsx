import type { NavigateOptions } from "react-router";
import type { OrdersPage } from "../../../api/types";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { LoadingStatus } from "../../../shared/ui/LoadingStatus";
import { RetryableError } from "../../../shared/ui/RetryableError";
import type { OrdersFilters } from "../domain/ordersFiltersSearchParams";
import { useOrders } from "../hooks/useOrders";
import { useStayWithinLastPage } from "../hooks/useStayWithinLastPage";
import { OrdersPagination } from "./OrdersPagination";
import { OrdersTable } from "./OrdersTable";
import { OrdersUpdatingStatus } from "./OrdersUpdatingStatus";

interface OrdersResultsProps {
  filters: OrdersFilters;
  onPageChange: (page: number, options?: NavigateOptions) => void;
}

export function OrdersResults({ filters, onPageChange }: OrdersResultsProps) {
  const orders = useOrders(filters);
  const isUpdating = orders.isPlaceholderData;
  useStayWithinLastPage(isUpdating ? undefined : orders.data, onPageChange);

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
  return (
    <section aria-label="Order results" aria-busy={orders.isFetching} className="space-y-3">
      <OrdersUpdatingStatus isUpdating={isUpdating} />
      <OrdersPageContent ordersPage={orders.data} isUpdating={isUpdating} onPageChange={onPageChange} />
    </section>
  );
}

interface OrdersPageContentProps {
  ordersPage: OrdersPage;
  isUpdating: boolean;
  onPageChange: (page: number) => void;
}

function OrdersPageContent({ ordersPage, isUpdating, onPageChange }: OrdersPageContentProps) {
  if (ordersPage.total > 0) {
    return (
      <>
        <OrdersTable orders={ordersPage.orders} isStale={isUpdating} />
        <OrdersPagination ordersPage={ordersPage} isDisabled={isUpdating} onPageChange={onPageChange} />
      </>
    );
  }
  if (isUpdating) {
    return null;
  }
  return <EmptyState message="No orders match these filters." />;
}
