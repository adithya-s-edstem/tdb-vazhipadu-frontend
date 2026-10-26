import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { createOrder } from "../../api/client";
import type { Order } from "../../api/types";
import { useCartStore } from "../cart/useCartStore";
import type { OrderDetails } from "../order-form/orderDetailsSchema";
import { toCreateOrderRequest } from "./domain/toCreateOrderRequest";

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
  const idempotencyKey = useRef<string | undefined>(undefined);
  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (_order, request) => {
      idempotencyKey.current = undefined;
      removeOrderedLines(request.lines);
    },
  });

  function placeOrder(details: OrderDetails): void {
    idempotencyKey.current ??= crypto.randomUUID();
    const request = toCreateOrderRequest({ lines, details, idempotencyKey: idempotencyKey.current });
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
