import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { configureMockApi, getOrders } from "../../../api/client";
import { renderRoute } from "../../../../test/renderRoute";
import { useInstantMockApi } from "../../../../test/useInstantMockApi";

async function openFirstCancellableOrder() {
  const view = renderRoute("/orders");
  const [cancelButton] = await screen.findAllByRole("button", { name: /^Cancel order / });
  const row = cancelButton?.closest("tr");
  if (!cancelButton || !row) {
    throw new Error("No cancellable order on the first page");
  }
  const orderId = within(row).getByRole("rowheader").textContent ?? "";
  return { ...view, cancelButton, row, orderId };
}

describe("CancelOrderButton", () => {
  useInstantMockApi();

  it("asks for confirmation before cancelling", async () => {
    const { user, cancelButton, row, orderId } = await openFirstCancellableOrder();

    await user.click(cancelButton);

    expect(screen.getByRole("alertdialog", { name: `Cancel order ${orderId}?` })).toBeInTheDocument();
    expect(row).toHaveTextContent("Confirmed");
  });

  it("keeps the order when the cancellation is not confirmed", async () => {
    const { user, cancelButton, row, orderId } = await openFirstCancellableOrder();
    await user.click(cancelButton);

    await user.click(screen.getByRole("button", { name: "Keep order" }));

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(row).toHaveTextContent("Confirmed");
    const { orders } = await getOrders({ status: "cancelled", pageSize: 50 });
    expect(orders.map((order) => order.id)).not.toContain(orderId);
  });

  it("shows a cancelled order as cancelled without reloading the page", async () => {
    const { user, cancelButton, orderId } = await openFirstCancellableOrder();
    await user.click(cancelButton);

    await user.click(screen.getByRole("button", { name: "Cancel order" }));

    const row = await screen.findByRole("row", { name: new RegExp(`${orderId}.*Cancelled`) });
    expect(within(row).queryByRole("button", { name: `Cancel order ${orderId}` })).not.toBeInTheDocument();
  });

  it("keeps the order and explains why when cancelling fails", async () => {
    const { user, cancelButton, row } = await openFirstCancellableOrder();
    configureMockApi({ failureRate: 1 });
    await user.click(cancelButton);

    await user.click(screen.getByRole("button", { name: "Cancel order" }));

    expect(await within(row).findByRole("alert")).toHaveTextContent("The request failed. Please try again.");
    expect(row).toHaveTextContent("Confirmed");
  });

  it("offers no cancel button for cancelled or completed orders", async () => {
    renderRoute("/orders?status=completed");

    await screen.findByRole("navigation", { name: "Pages" });

    expect(screen.queryByRole("button", { name: /^Cancel order / })).not.toBeInTheDocument();
  });
});
