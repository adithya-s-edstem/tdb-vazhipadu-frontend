import { useId } from "react";
import { formatRupees } from "../../shared/format/formatRupees";
import { EmptyState } from "../../shared/ui/EmptyState";
import { CartLineItem } from "./CartLineItem";
import { cartTotal } from "./domain/cartTotal";
import { useCartStore } from "./useCartStore";

export function CartPanel() {
  const headingId = useId();
  const totalLabelId = useId();
  const lines = useCartStore((state) => state.lines);

  return (
    <section aria-labelledby={headingId} className="rounded border border-amber-200 bg-white p-4 shadow-sm">
      <h2 id={headingId} className="mb-2 text-lg font-semibold">
        Your cart
      </h2>
      {lines.length === 0 ? (
        <EmptyState message="Your cart is empty." />
      ) : (
        <>
          <ul aria-label="Cart lines">
            {lines.map((line) => (
              <CartLineItem key={line.offeringId} line={line} />
            ))}
          </ul>
          <p className="mt-3 flex justify-between border-t border-amber-200 pt-3 text-lg font-semibold">
            <span id={totalLabelId}>Total</span>
            <output aria-labelledby={totalLabelId}>{formatRupees(cartTotal(lines))}</output>
          </p>
        </>
      )}
    </section>
  );
}
