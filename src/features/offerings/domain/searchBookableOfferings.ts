import type { Offering } from "../../../api/types";
import { isBookable } from "./isBookable";

export function searchBookableOfferings(offerings: Offering[], searchTerm: string): Offering[] {
  const normalizedTerm = normalize(searchTerm);
  return offerings.filter((offering) => isBookable(offering) && normalize(offering.name).includes(normalizedTerm));
}

function normalize(text: string): string {
  return text.trim().toLocaleLowerCase();
}
