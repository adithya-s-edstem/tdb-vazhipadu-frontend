import { screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { configureMockApi } from "../../../api/client";
import { renderRoute } from "../../../../test/renderRoute";
import { useInstantMockApi } from "../../../../test/useInstantMockApi";

const SLOW_LATENCY_MS = 400;
const UPDATING_MESSAGE = "Updating orders…";

function slowDownMockApi(): void {
  configureMockApi({ minLatencyMs: SLOW_LATENCY_MS, maxLatencyMs: SLOW_LATENCY_MS });
}

function orderResults() {
  return screen.getByRole("region", { name: "Order results" });
}

function updatingStatus() {
  return within(orderResults()).getByRole("status");
}

async function waitUntilUpdated(): Promise<void> {
  await waitFor(() => expect(updatingStatus()).toBeEmptyDOMElement());
}

async function openOrdersWithSlowApi(path = "/orders") {
  const view = renderRoute(path);
  await screen.findByRole("region", { name: "Order results" });
  slowDownMockApi();
  return view;
}

describe("OrdersResults loading", () => {
  useInstantMockApi();

  it("shows the first-load status until the first page arrives", async () => {
    slowDownMockApi();
    renderRoute("/orders");

    expect(screen.getByRole("status")).toHaveTextContent("Loading orders…");
    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(screen.queryByText("Loading orders…")).not.toBeInTheDocument();
  });

  it("shows an updating status while a phone search loads, then hides it", async () => {
    const { user } = await openOrdersWithSlowApi();

    await user.type(screen.getByRole("searchbox", { name: "Phone number" }), "9847");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(updatingStatus()).toHaveTextContent(UPDATING_MESSAGE);
    await waitUntilUpdated();
  });

  it("shows an updating status while a status filter loads", async () => {
    const { user } = await openOrdersWithSlowApi();

    await user.selectOptions(screen.getByLabelText("Status"), "Completed");

    expect(updatingStatus()).toHaveTextContent(UPDATING_MESSAGE);
    expect(await screen.findByText(/Page 1 of 4/)).toBeInTheDocument();
    expect(updatingStatus()).toBeEmptyDOMElement();
  });

  it("shows an updating status while a date filter loads", async () => {
    const { user } = await openOrdersWithSlowApi();

    await user.type(screen.getByLabelText("Offering date"), "2026-10-26");

    expect(updatingStatus()).toHaveTextContent(UPDATING_MESSAGE);
    await waitUntilUpdated();
  });

  it("shows an updating status while the next page loads", async () => {
    const { user } = await openOrdersWithSlowApi();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(updatingStatus()).toHaveTextContent(UPDATING_MESSAGE);
    expect(await screen.findByText(/Page 2 of 5/)).toBeInTheDocument();
    expect(updatingStatus()).toBeEmptyDOMElement();
  });

  it("shows an updating status while the previous page loads", async () => {
    const { user } = await openOrdersWithSlowApi("/orders?page=3");

    await user.click(screen.getByRole("button", { name: "Previous" }));

    expect(updatingStatus()).toHaveTextContent(UPDATING_MESSAGE);
    expect(await screen.findByText(/Page 2 of 5/)).toBeInTheDocument();
    expect(updatingStatus()).toBeEmptyDOMElement();
  });

  it("keeps the previous rows visible but dimmed and marks the results busy while loading", async () => {
    const { user } = await openOrdersWithSlowApi();

    await user.selectOptions(screen.getByLabelText("Status"), "Completed");

    expect(screen.getAllByRole("row")).toHaveLength(11);
    expect(screen.getByRole("table")).toHaveClass("opacity-50");
    expect(orderResults()).toHaveAttribute("aria-busy", "true");
    expect(updatingStatus()).toHaveAttribute("aria-live", "polite");
    await waitUntilUpdated();
    expect(screen.getByRole("table")).not.toHaveClass("opacity-50");
    expect(orderResults()).toHaveAttribute("aria-busy", "false");
  });

  it("marks the page buttons disabled while a page loads so repeated clicks do not skip pages", async () => {
    const { user, currentUrl } = await openOrdersWithSlowApi("/orders?page=2");

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByRole("button", { name: "Next" })).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("button", { name: "Previous" })).toHaveAttribute("aria-disabled", "true");
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(await screen.findByText(/Page 3 of 5/)).toBeInTheDocument();
    expect(currentUrl()).toBe("/orders?page=3");
  });

  it("keeps keyboard focus on Next while the next page loads", async () => {
    const { user } = await openOrdersWithSlowApi();
    screen.getByRole("button", { name: "Next" }).focus();

    await user.keyboard("{Enter}");

    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();
    expect(await screen.findByText(/Page 2 of 5/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();
  });

  it("shows the empty state only after loading finishes, not over the previous rows", async () => {
    const { user } = await openOrdersWithSlowApi();

    await user.type(screen.getByRole("searchbox", { name: "Phone number" }), "0000000");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(screen.queryByText("No orders match these filters.")).not.toBeInTheDocument();
    expect(await screen.findByText("No orders match these filters.")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("does not show a stale empty state while the next filter loads", async () => {
    const { user } = await openOrdersWithSlowApi("/orders?phone=0000000");

    await user.selectOptions(screen.getByLabelText("Status"), "Completed");

    expect(updatingStatus()).toHaveTextContent(UPDATING_MESSAGE);
    expect(screen.queryByText("No orders match these filters.")).not.toBeInTheDocument();
    expect(await screen.findByText("No orders match these filters.")).toBeInTheDocument();
  });

  it("replaces the updating status with the error and retry when a new filter fails", async () => {
    const { user } = await openOrdersWithSlowApi();
    configureMockApi({ failureRate: 1 });

    await user.selectOptions(screen.getByLabelText("Status"), "Completed");

    expect(updatingStatus()).toHaveTextContent(UPDATING_MESSAGE);
    expect(await screen.findByText("Could not load orders.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    expect(screen.queryByText(UPDATING_MESSAGE)).not.toBeInTheDocument();
  });

  it("keeps the table and shows no loading status while cancelling refreshes the list", async () => {
    const { user } = await openOrdersWithSlowApi();
    const [cancelButton] = screen.getAllByRole("button", { name: /^Cancel order / });
    const orderId = cancelButton?.getAttribute("aria-label")?.replace("Cancel order ", "");
    if (!cancelButton || !orderId) {
      throw new Error("No cancellable order on the first page");
    }
    await user.click(cancelButton);

    await user.click(screen.getByRole("button", { name: "Cancel order" }));
    await screen.findByRole("row", { name: new RegExp(`${orderId}.*Cancelled`) });

    expect(screen.getAllByRole("row")).toHaveLength(11);
    expect(updatingStatus()).toBeEmptyDOMElement();
    expect(screen.queryByText("Loading orders…")).not.toBeInTheDocument();
  });
});
