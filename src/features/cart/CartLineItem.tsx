import { useId } from "react";
import { formatRupees } from "../../shared/format/formatRupees";
import type { CartLine } from "./domain/CartLine";
import { lineTotal } from "./domain/lineTotal";
import { QuantityStepper } from "./QuantityStepper";
import { useCartStore } from "./useCartStore";

interface CartLineItemProps {
  line: CartLine;
}

export function CartLineItem({ line }: CartLineItemProps) {
  const nameId = useId();
  const remove = useCartStore((state) => state.remove);

  return (
    <li aria-labelledby={nameId} className="flex flex-col gap-2 border-b border-amber-100 py-3 last:border-b-0">
      <div className="flex items-baseline justify-between gap-2">
        <h3 id={nameId} className="font-medium">
          {line.name}
        </h3>
        <p className="font-semibold">{formatRupees(lineTotal(line))}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-stone-600">{formatRupees(line.unitPrice)} each</p>
        <QuantityStepper offeringId={line.offeringId} offeringName={line.name} quantity={line.quantity} />
        <button
          type="button"
          onClick={() => remove(line.offeringId)}
          aria-label={`Remove ${line.name}`}
          className="text-sm font-medium text-red-800 underline"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
