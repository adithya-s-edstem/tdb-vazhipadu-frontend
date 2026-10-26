import { z } from "zod";
import type { CartLine } from "./domain/CartLine";
import { MAX_QUANTITY_PER_LINE, MIN_QUANTITY_PER_LINE } from "./domain/quantityLimits";

const cartLineSchema: z.ZodType<CartLine> = z.object({
  offeringId: z.string().min(1),
  templeId: z.string().min(1),
  name: z.string().min(1),
  unitPrice: z.number().int().nonnegative(),
  quantity: z.number().int().min(MIN_QUANTITY_PER_LINE).max(MAX_QUANTITY_PER_LINE),
});

const persistedCartSchema = z.object({ lines: z.array(z.unknown()) });

export function restoreCartLines(persistedCart: unknown): CartLine[] {
  const parsedCart = persistedCartSchema.safeParse(persistedCart);
  if (!parsedCart.success) {
    return [];
  }
  return parsedCart.data.lines.flatMap((line) => {
    const parsedLine = cartLineSchema.safeParse(line);
    return parsedLine.success ? [parsedLine.data] : [];
  });
}
