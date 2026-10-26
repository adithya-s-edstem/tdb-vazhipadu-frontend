import type { Offering } from "../../api/types";
import { OfferingCard } from "./OfferingCard";

interface OfferingListProps {
  offerings: Pick<Offering, "id" | "templeId" | "name" | "price">[];
}

export function OfferingList({ offerings }: OfferingListProps) {
  return (
    <ul aria-label="Offerings" className="grid gap-3 sm:grid-cols-2">
      {offerings.map((offering) => (
        <OfferingCard key={offering.id} offering={offering} />
      ))}
    </ul>
  );
}
