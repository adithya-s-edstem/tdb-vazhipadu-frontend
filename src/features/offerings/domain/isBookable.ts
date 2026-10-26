import type { Offering } from "../../../api/types";

export function isBookable(offering: Pick<Offering, "active">): boolean {
  return offering.active;
}
