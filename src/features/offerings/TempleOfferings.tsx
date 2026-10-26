import { useState } from "react";
import type { Temple } from "../../api/types";
import { OfferingResults } from "./OfferingResults";
import { OfferingSearch } from "./OfferingSearch";
import { TemplePicker } from "./TemplePicker";

interface TempleOfferingsProps {
  temples: Temple[];
  defaultTempleId: string;
}

export function TempleOfferings({ temples, defaultTempleId }: TempleOfferingsProps) {
  const [templeId, setTempleId] = useState(defaultTempleId);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <TemplePicker temples={temples} selectedTempleId={templeId} onSelect={setTempleId} />
        <OfferingSearch searchTerm={searchTerm} onSearch={setSearchTerm} />
      </div>
      <OfferingResults templeId={templeId} searchTerm={searchTerm} />
    </section>
  );
}
