import { useId } from "react";
import { OrderForm } from "../order-form/OrderForm";
import type { OrderDetails } from "../order-form/orderDetailsSchema";

interface DevoteeDetailsPanelProps {
  onPlaceOrder: (details: OrderDetails) => void;
  isPlacing: boolean;
  hasFailed: boolean;
}

export function DevoteeDetailsPanel({ onPlaceOrder, isPlacing, hasFailed }: DevoteeDetailsPanelProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="rounded border border-amber-200 bg-white p-4 shadow-sm">
      <h2 id={headingId} className="mb-3 text-lg font-semibold">
        Devotee details
      </h2>
      <OrderForm onSubmit={onPlaceOrder} isSubmitting={isPlacing} />
      <div role="alert" className="mt-3 text-red-800">
        {hasFailed && !isPlacing && "Your order was not placed. Your cart and details are kept, so you can try again."}
      </div>
    </section>
  );
}
