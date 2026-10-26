import type { CartableOffering } from "./domain/addToCart";
import { canAddToCart } from "./domain/canAddToCart";
import { useCartStore } from "./useCartStore";

interface AddToCartButtonProps {
  offering: CartableOffering;
}

export function AddToCartButton({ offering }: AddToCartButtonProps) {
  const isAllowed = useCartStore(({ lines }) => canAddToCart(lines, offering.templeId));
  const add = useCartStore((state) => state.add);

  return (
    <button
      type="button"
      onClick={() => add(offering)}
      disabled={!isAllowed}
      aria-label={`Add ${offering.name} to cart`}
      className="rounded bg-amber-700 px-3 py-1.5 font-medium text-white disabled:opacity-50"
    >
      Add
    </button>
  );
}
