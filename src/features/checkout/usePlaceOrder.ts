import { useMutation } from "@tanstack/react-query";
import { createOrder } from "../../api/client";
import type { Order } from "../../api/types";
import { useCartStore } from "../cart/useCartStore";
import type { OrderDetails } from "../order-form/orderDetailsSchema";
import { toCreateOrderRequest } from "./domain/toCreateOrderRequest";
import { useIdempotencyKey } from "./useIdempotencyKey";

export interface PlaceOrder {
  placeOrder: (details: OrderDetails) => void;
  isPlacing: boolean;
  hasFailed: boolean;
  placedOrder: Order | undefined;
  startNewBooking: () => void;
}

export function usePlaceOrder(): PlaceOrder {
  const lines = useCartStore((state) => state.lines);
  const removeOrderedLines = useCartStore((state) => state.removeOrdered);
  const { keyFor, release } = useIdempotencyKey();
  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (_order, request) => {
      release();
      removeOrderedLines(request.lines);
    },
  });

  function placeOrder(details: OrderDetails): void {
    const idempotencyKey = keyFor({ lines, details });
    const request = toCreateOrderRequest({ lines, details, idempotencyKey });
    if (request) {
      mutation.mutate(request);
    }
  }

  return {
    placeOrder,
    isPlacing: mutation.isPending,
    hasFailed: mutation.isError,
    placedOrder: mutation.data,
    startNewBooking: mutation.reset,
  };
}
