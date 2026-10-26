const FIRST_ORDER_NUMBER = 1001;

export function orderIdFor(sequence: number): string {
  return `VZ-${FIRST_ORDER_NUMBER + sequence}`;
}
