import { canAddToCart } from "./domain/canAddToCart";
import { useCartStore } from "./useCartStore";

interface OtherTempleCartNoticeProps {
  templeId: string;
}

export function OtherTempleCartNotice({ templeId }: OtherTempleCartNoticeProps) {
  const isAllowed = useCartStore(({ lines }) => canAddToCart(lines, templeId));

  if (isAllowed) {
    return null;
  }
  return (
    <p className="rounded border border-amber-300 bg-amber-100 p-3 text-amber-900">
      Your cart has offerings from another temple. Remove them to book offerings at this temple.
    </p>
  );
}
