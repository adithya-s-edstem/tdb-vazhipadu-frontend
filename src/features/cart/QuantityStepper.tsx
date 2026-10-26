import { MAX_QUANTITY_PER_LINE, MIN_QUANTITY_PER_LINE } from "./domain/quantityLimits";
import { useCartStore } from "./useCartStore";

interface QuantityStepperProps {
  offeringId: string;
  offeringName: string;
  quantity: number;
}

const STEP_BUTTON_CLASSES =
  "h-8 w-8 rounded border border-stone-300 bg-white font-semibold disabled:cursor-not-allowed disabled:opacity-40";

export function QuantityStepper({ offeringId, offeringName, quantity }: QuantityStepperProps) {
  const changeQuantity = useCartStore((state) => state.changeQuantity);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => changeQuantity({ offeringId, quantity: quantity - 1 })}
        disabled={quantity <= MIN_QUANTITY_PER_LINE}
        aria-label={`Decrease quantity of ${offeringName}`}
        className={STEP_BUTTON_CLASSES}
      >
        −
      </button>
      <output className="min-w-20 text-center text-sm">Quantity {quantity}</output>
      <button
        type="button"
        onClick={() => changeQuantity({ offeringId, quantity: quantity + 1 })}
        disabled={quantity >= MAX_QUANTITY_PER_LINE}
        aria-label={`Increase quantity of ${offeringName}`}
        className={STEP_BUTTON_CLASSES}
      >
        +
      </button>
    </div>
  );
}
