import { CartPanel } from "../cart/CartPanel";
import { useCartStore } from "../cart/useCartStore";
import { DevoteeDetailsPanel } from "./DevoteeDetailsPanel";
import { OrderConfirmation } from "./OrderConfirmation";
import { usePlaceOrder } from "./usePlaceOrder";

export function Checkout() {
  const hasCartLines = useCartStore((state) => state.lines.length > 0);
  const { placeOrder, isPlacing, hasFailed, placedOrder, startNewBooking } = usePlaceOrder();

  return (
    <div className="flex flex-col gap-6">
      {placedOrder && <OrderConfirmation order={placedOrder} onBookMore={startNewBooking} />}
      <CartPanel />
      {hasCartLines && <DevoteeDetailsPanel onPlaceOrder={placeOrder} isPlacing={isPlacing} hasFailed={hasFailed} />}
    </div>
  );
}
