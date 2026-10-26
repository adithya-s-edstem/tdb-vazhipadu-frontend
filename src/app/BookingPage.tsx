import { useId } from "react";
import { Checkout } from "../features/checkout/Checkout";
import { OfferingsPage } from "../features/offerings/OfferingsPage";

export function BookingPage() {
  const offeringsHeadingId = useId();

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <section aria-labelledby={offeringsHeadingId}>
        <h2 id={offeringsHeadingId} className="mb-4 text-lg font-semibold">
          Offerings
        </h2>
        <OfferingsPage />
      </section>
      <Checkout />
    </div>
  );
}
