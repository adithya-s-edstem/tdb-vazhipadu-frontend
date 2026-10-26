import { isBefore, isValid, parseISO, startOfDay } from "date-fns";

export function isAllowedOfferingDate(isoDate: string, now: Date): boolean {
  const offeringDate = parseISO(isoDate);
  return isValid(offeringDate) && !isBefore(offeringDate, startOfDay(now));
}
