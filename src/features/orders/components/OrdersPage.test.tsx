import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { configureMockApi, getOrders } from "../../../api/client";
import type { OrdersQuery } from "../../../api/types";
import { renderRoute } from "../../../../test/renderRoute";
import { useInstantMockApi } from "../../../../test/useInstantMockApi";
import { formatIsoDate } from "../../../shared/format/formatIsoDate";
import { formatRupees } from "../../../shared/format/formatRupees";
import { describeOrderLines } from "./describeOrderLines";

function orderRows() {
  return screen.getAllByRole("row").slice(1);
}

async function findOrderRows() {
  await screen.findByRole("navigation", { name: "Pages" });
  return orderRows();
}

function statusCell(row: HTMLElement) {
  const status = within(row).getAllByRole("cell")[4];
  if (!status) {
    throw new Error("Order row has no status cell");
  }
  return status;
}

async function firstOrderOf(query: OrdersQuery) {
  const [order] = (await getOrders({ ...query, pageSize: 1 })).orders;
  if (!order) {
    throw new Error("Seed has no order for this query");
  }
  return order;
}

describe("OrdersPage", () => {
  useInstantMockApi();

  it("shows a loading message while orders are on their way", () => {
    renderRoute("/orders");

    expect(screen.getByRole("status")).toHaveTextContent("Loading orders…");
  });

  it("lists each order's date, devotee, offerings, total and status, newest first", async () => {
    const newest = await firstOrderOf({});
    renderRoute("/orders");

    const [firstRow] = await findOrderRows();

    expect(firstRow).toHaveTextContent(newest.id);
    expect(firstRow).toHaveTextContent(newest.devotee.name);
    expect(firstRow).toHaveTextContent(describeOrderLines(newest.lines));
    expect(firstRow).toHaveTextContent(formatRupees(newest.total));
    expect(firstRow).toHaveTextContent(formatIsoDate(newest.offeringDate));
    expect(firstRow).toHaveTextContent("Confirmed");
  });

  it("shows ten orders per page with the page count", async () => {
    renderRoute("/orders");

    expect(await findOrderRows()).toHaveLength(10);
    expect(screen.getByText(/Page 1 of 5/)).toBeInTheDocument();
  });

  it("filtering by status shows only matching orders and goes back to page 1", async () => {
    const { user, currentUrl } = renderRoute("/orders?page=3");
    await findOrderRows();

    await user.selectOptions(screen.getByLabelText("Status"), "Completed");

    expect(await screen.findByText(/Page 1 of 4/)).toBeInTheDocument();
    expect(orderRows().every((row) => statusCell(row).textContent === "Completed")).toBe(true);
    expect(currentUrl()).toBe("/orders?status=completed");
  });

  it("refreshing the page keeps the filters and the current page", async () => {
    const firstVisit = renderRoute("/orders");
    await findOrderRows();
    await firstVisit.user.selectOptions(screen.getByLabelText("Status"), "Completed");
    await screen.findByText(/Page 1 of/);
    await firstVisit.user.click(screen.getByRole("button", { name: "Next" }));
    await screen.findByText(/Page 2 of/);
    const urlBeforeRefresh = firstVisit.currentUrl();
    firstVisit.unmount();

    renderRoute(urlBeforeRefresh);

    expect(await screen.findByText(/Page 2 of/)).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toHaveValue("completed");
    expect(orderRows().every((row) => statusCell(row).textContent === "Completed")).toBe(true);
  });

  it("filters by offering date and returns to page 1", async () => {
    const { offeringDate } = await firstOrderOf({ page: 7 });
    const { user, currentUrl } = renderRoute("/orders?page=2");
    await findOrderRows();

    await user.type(screen.getByLabelText("Offering date"), offeringDate);

    expect(await screen.findByText(/Page 1 of 1/)).toBeInTheDocument();
    expect(currentUrl()).toBe(`/orders?offeringDate=${offeringDate}`);
  });

  it("searches by part of a phone number", async () => {
    const { phone } = (await firstOrderOf({})).devotee;
    const { user, currentUrl } = renderRoute("/orders");
    await findOrderRows();

    await user.type(screen.getByRole("searchbox", { name: "Phone number" }), phone.slice(-6));
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(await screen.findByText(/Page 1 of 1/)).toBeInTheDocument();
    expect(orderRows().every((row) => row.textContent?.includes(phone))).toBe(true);
    expect(currentUrl()).toBe(`/orders?phone=${phone.slice(-6)}`);
  });

  it("says so when no orders match the filters", async () => {
    renderRoute("/orders?phone=0000000");

    expect(await screen.findByText("No orders match these filters.")).toBeInTheDocument();
  });

  it("moves to the last page when the page in the URL is past the end", async () => {
    const { currentUrl } = renderRoute("/orders?page=99");

    expect(await screen.findByText(/Page 5 of 5/)).toBeInTheDocument();
    expect(currentUrl()).toBe("/orders?page=5");
  });

  it("offers a retry when orders fail to load", async () => {
    configureMockApi({ failureRate: 1 });
    const { user } = renderRoute("/orders");
    await screen.findByText("Could not load orders.");
    configureMockApi({ failureRate: 0 });

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await findOrderRows()).toHaveLength(10);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
