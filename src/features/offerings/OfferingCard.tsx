import { useId } from "react";
import { formatRupees } from "../../shared/format/formatRupees";

interface OfferingCardProps {
  name: string;
  price: number;
}

export function OfferingCard({ name, price }: OfferingCardProps) {
  const nameId = useId();

  return (
    <li
      aria-labelledby={nameId}
      className="flex items-center justify-between rounded border border-amber-200 bg-white px-4 py-3 shadow-sm"
    >
      <h3 id={nameId} className="font-medium">
        {name}
      </h3>
      <p className="font-semibold text-amber-800">{formatRupees(price)}</p>
    </li>
  );
}
