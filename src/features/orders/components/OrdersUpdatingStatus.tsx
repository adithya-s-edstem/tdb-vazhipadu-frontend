interface OrdersUpdatingStatusProps {
  isUpdating: boolean;
}

export function OrdersUpdatingStatus({ isUpdating }: OrdersUpdatingStatusProps) {
  return (
    <p role="status" aria-live="polite" className="min-h-6 text-sm font-medium text-amber-800">
      {isUpdating ? "Updating orders…" : ""}
    </p>
  );
}
