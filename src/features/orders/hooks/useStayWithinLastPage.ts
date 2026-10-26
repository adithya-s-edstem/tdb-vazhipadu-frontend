import { useEffect } from "react";
import type { NavigateOptions } from "react-router";
import type { OrdersPage } from "../../../api/types";
import { lastPageNumber } from "../domain/lastPageNumber";

export function useStayWithinLastPage(
  settledPage: OrdersPage | undefined,
  goToPage: (page: number, options?: NavigateOptions) => void,
): void {
  useEffect(() => {
    if (!settledPage || settledPage.page <= lastPageNumber(settledPage)) {
      return;
    }
    goToPage(lastPageNumber(settledPage), { replace: true });
  }, [settledPage, goToPage]);
}
