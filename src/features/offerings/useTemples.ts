import { useQuery } from "@tanstack/react-query";
import { getTemples } from "../../api/client";

export function useTemples() {
  return useQuery({ queryKey: ["temples"], queryFn: getTemples });
}
