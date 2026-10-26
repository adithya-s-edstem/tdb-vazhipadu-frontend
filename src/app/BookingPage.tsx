import { useId } from "react";
import { CartPanel } from "../features/cart/CartPanel";
import { useCartStore } from "../features/cart/useCartStore";
import { OfferingsPage } from "../features/offerings/OfferingsPage";
import { DevoteeDetailsPanel } from "../features/order-form/DevoteeDetailsPanel";

export function BookingPage() {
  const offeringsHeadingId = useId();
  const hasCartLines = useCartStore((state) => state.lines.length > 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <section aria-labelledby={offeringsHeadingId}>
        <h2 id={offeringsHeadingId} className="mb-4 text-lg font-semibold">
          Offerings
        </h2>
        <OfferingsPage />
      </section>
      <div className="flex flex-col gap-6">
        <CartPanel />
        {hasCartLines && <DevoteeDetailsPanel />}
      </div>
    </div>
  );
}
