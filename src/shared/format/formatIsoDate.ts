import { format, parseISO } from "date-fns";

export function formatIsoDate(isoDate: string): string {
  return format(parseISO(isoDate), "d MMM yyyy");
}
