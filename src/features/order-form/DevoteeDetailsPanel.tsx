import { useId, useState } from "react";
import { OrderForm } from "./OrderForm";

export function DevoteeDetailsPanel() {
  const headingId = useId();
  const [areDetailsChecked, setAreDetailsChecked] = useState(false);

  return (
    <section aria-labelledby={headingId} className="rounded border border-amber-200 bg-white p-4 shadow-sm">
      <h2 id={headingId} className="mb-3 text-lg font-semibold">
        Devotee details
      </h2>
      <OrderForm onSubmit={() => setAreDetailsChecked(true)} />
      <p role="status" className="mt-3 text-green-800">
        {areDetailsChecked ? "Details look good." : ""}
      </p>
    </section>
  );
}
