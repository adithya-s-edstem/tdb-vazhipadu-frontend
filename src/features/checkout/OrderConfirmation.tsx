import { useEffect, useId, useRef } from "react";
import type { Order } from "../../api/types";
import { formatRupees } from "../../shared/format/formatRupees";

interface OrderConfirmationProps {
  order: Pick<Order, "id" | "total">;
  onBookMore: () => void;
}

export function OrderConfirmation({ order, onBookMore }: OrderConfirmationProps) {
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section aria-labelledby={headingId} className="rounded border border-green-300 bg-green-50 p-4 shadow-sm">
      <h2 id={headingId} ref={headingRef} tabIndex={-1} className="mb-2 text-lg font-semibold text-green-900">
        Order placed
      </h2>
      <p>
        Order number <strong>{order.id}</strong>
      </p>
      <p className="mb-3">
        Total <strong>{formatRupees(order.total)}</strong>
      </p>
      <button
        type="button"
        onClick={onBookMore}
        className="rounded border border-green-700 px-4 py-2 font-medium text-green-900"
      >
        Book more offerings
      </button>
    </section>
  );
}
