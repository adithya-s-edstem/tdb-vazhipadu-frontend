import { z } from "zod";
import { NAKSHATRAS } from "../../api/types";
import { isAllowedOfferingDate } from "./domain/isAllowedOfferingDate";
import { toIndianMobile } from "./domain/toIndianMobile";

export const MAX_NAME_LENGTH = 100;

const INVALID_PHONE_MESSAGE = "Enter a 10-digit Indian mobile number, optionally starting with +91.";

export const orderDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter the devotee's name.")
    .max(MAX_NAME_LENGTH, `Use at most ${MAX_NAME_LENGTH} characters.`),
  phone: z.string().trim().min(1, "Enter a phone number.").transform(toMobileOrReportIssue),
  nakshatra: z.enum(NAKSHATRAS, { error: "Choose a nakshatra." }),
  offeringDate: z
    .string()
    .min(1, "Choose the offering date.")
    .refine((offeringDate) => isAllowedOfferingDate(offeringDate, new Date()), {
      error: "The offering date cannot be in the past.",
    }),
});

export type OrderDetailsInput = z.input<typeof orderDetailsSchema>;
export type OrderDetails = z.output<typeof orderDetailsSchema>;

function toMobileOrReportIssue(phone: string, context: z.RefinementCtx<string>): string {
  const mobile = toIndianMobile(phone);
  if (mobile === undefined) {
    context.addIssue(INVALID_PHONE_MESSAGE);
    return z.NEVER;
  }
  return mobile;
}
