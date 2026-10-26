export const MIN_QUANTITY_PER_LINE = 1;
export const MAX_QUANTITY_PER_LINE = 10;

export function limitQuantity(quantity: number): number {
  return Math.min(MAX_QUANTITY_PER_LINE, Math.max(MIN_QUANTITY_PER_LINE, quantity));
}
