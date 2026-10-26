import { useQuery } from "@tanstack/react-query";
import { getOfferings } from "../../api/client";

export function useOfferings(templeId: string) {
  return useQuery({ queryKey: ["offerings", templeId], queryFn: () => getOfferings(templeId) });
}
