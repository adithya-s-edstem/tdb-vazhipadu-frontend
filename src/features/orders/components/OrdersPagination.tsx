import type { OrdersPage } from "../../../api/types";
import { lastPageNumber } from "../domain/lastPageNumber";
import { FIRST_PAGE } from "../domain/ordersFiltersSearchParams";

interface OrdersPaginationProps {
  ordersPage: Pick<OrdersPage, "page" | "pageSize" | "total">;
  isDisabled: boolean;
  onPageChange: (page: number) => void;
}

const BUTTON_CLASSES = "rounded border border-amber-700 px-3 py-1 disabled:opacity-40";

export function OrdersPagination({ ordersPage, isDisabled, onPageChange }: OrdersPaginationProps) {
  const { page } = ordersPage;
  const lastPage = lastPageNumber(ordersPage);

  return (
    <nav aria-label="Pages" className="flex items-center justify-between gap-3">
      <button
        type="button"
        className={BUTTON_CLASSES}
        disabled={isDisabled || page <= FIRST_PAGE}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <p>
        Page {page} of {lastPage} · {ordersPage.total} orders
      </p>
      <button
        type="button"
        className={BUTTON_CLASSES}
        disabled={isDisabled || page >= lastPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
