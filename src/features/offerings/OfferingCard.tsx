import { useId } from "react";
import type { Offering } from "../../api/types";
import { formatRupees } from "../../shared/format/formatRupees";
import { AddToCartButton } from "../cart/AddToCartButton";

interface OfferingCardProps {
  offering: Pick<Offering, "id" | "templeId" | "name" | "price">;
}

export function OfferingCard({ offering }: OfferingCardProps) {
  const nameId = useId();

  return (
    <li
      aria-labelledby={nameId}
      className="flex items-center justify-between gap-3 rounded border border-amber-200 bg-white px-4 py-3 shadow-sm"
    >
      <div>
        <h3 id={nameId} className="font-medium">
          {offering.name}
        </h3>
        <p className="font-semibold text-amber-800">{formatRupees(offering.price)}</p>
      </div>
      <AddToCartButton offering={offering} />
    </li>
  );
}
