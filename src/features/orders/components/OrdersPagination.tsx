import type { ReactNode } from "react";
import type { OrdersPage } from "../../../api/types";
import { lastPageNumber } from "../domain/lastPageNumber";
import { FIRST_PAGE } from "../domain/ordersFiltersSearchParams";

interface OrdersPaginationProps {
  ordersPage: Pick<OrdersPage, "page" | "pageSize" | "total">;
  isDisabled: boolean;
  onPageChange: (page: number) => void;
}

const BUTTON_CLASSES =
  "rounded border border-amber-700 px-3 py-1 disabled:opacity-40 aria-disabled:cursor-wait aria-disabled:opacity-40";

export function OrdersPagination({ ordersPage, isDisabled, onPageChange }: OrdersPaginationProps) {
  const { page } = ordersPage;
  const lastPage = lastPageNumber(ordersPage);

  return (
    <nav aria-label="Pages" className="flex items-center justify-between gap-3">
      <PageButton isAtBoundary={page <= FIRST_PAGE} isBusy={isDisabled} onClick={() => onPageChange(page - 1)}>
        Previous
      </PageButton>
      <p>
        Page {page} of {lastPage} · {ordersPage.total} orders
      </p>
      <PageButton isAtBoundary={page >= lastPage} isBusy={isDisabled} onClick={() => onPageChange(page + 1)}>
        Next
      </PageButton>
    </nav>
  );
}

interface PageButtonProps {
  isAtBoundary: boolean;
  isBusy: boolean;
  onClick: () => void;
  children: ReactNode;
}

function PageButton({ isAtBoundary, isBusy, onClick, children }: PageButtonProps) {
  return (
    <button
      type="button"
      className={BUTTON_CLASSES}
      disabled={isAtBoundary}
      aria-disabled={isBusy || undefined}
      onClick={isBusy ? undefined : onClick}
    >
      {children}
    </button>
  );
}
