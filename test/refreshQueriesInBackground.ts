import type { QueryClient } from "@tanstack/react-query";
import { act } from "@testing-library/react";

const NEXT_TICK_MS = 0;

export async function refreshQueriesInBackground(queryClient: QueryClient): Promise<void> {
  await act(async () => {
    await queryClient.refetchQueries();
    await new Promise((resolve) => setTimeout(resolve, NEXT_TICK_MS));
  });
}
