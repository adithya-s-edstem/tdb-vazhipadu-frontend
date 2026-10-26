import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useCancelOrder } from "../hooks/useCancelOrder";

interface CancelOrderButtonProps {
  orderId: string;
}

const OUTLINE_BUTTON_CLASSES = "rounded border border-stone-400 px-3 py-1";
const DANGER_BUTTON_CLASSES = "rounded bg-red-700 px-3 py-1 font-semibold text-white disabled:opacity-60";
const DIALOG_CLASSES =
  "fixed top-1/2 left-1/2 w-[min(28rem,calc(100vw-2rem))] -translate-1/2 space-y-4 rounded bg-white p-5 shadow-lg";

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const cancellation = useCancelOrder();

  return (
    <div className="space-y-1">
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <button
            type="button"
            aria-label={`Cancel order ${orderId}`}
            className={DANGER_BUTTON_CLASSES}
            disabled={cancellation.isPending}
          >
            {cancellation.isPending ? "Cancelling…" : "Cancel"}
          </button>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-stone-900/50" />
          <AlertDialog.Content className={DIALOG_CLASSES}>
            <AlertDialog.Title className="text-lg font-semibold">Cancel order {orderId}?</AlertDialog.Title>
            <AlertDialog.Description>
              The offering will not be performed. This cannot be undone.
            </AlertDialog.Description>
            <div className="flex justify-end gap-2">
              <AlertDialog.Cancel className={OUTLINE_BUTTON_CLASSES}>Keep order</AlertDialog.Cancel>
              <AlertDialog.Action className={DANGER_BUTTON_CLASSES} onClick={() => cancellation.mutate(orderId)}>
                Cancel order
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
      {cancellation.error && (
        <p role="alert" className="text-red-700">
          {cancellation.error.message}
        </p>
      )}
    </div>
  );
}
