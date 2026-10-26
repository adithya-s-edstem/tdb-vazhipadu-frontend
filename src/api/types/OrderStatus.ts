export const ORDER_STATUSES = ["confirmed", "completed", "cancelled"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
