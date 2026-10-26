import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { buildCartLine } from "../../../test/buildCartLine";
import { devoteeDetails, fillDevoteeDetails } from "../../../test/fillDevoteeDetails";
import { renderWithQueryClient } from "../../../test/renderWithQueryClient";
import { useEmptyCart } from "../../../test/useEmptyCart";
import { useInstantMockApi } from "../../../test/useInstantMockApi";
import { configureMockApi, getOrders } from "../../api/client";
import { useCartStore } from "../cart/useCartStore";
import { Checkout } from "./Checkout";

const SLOW_LATENCY_MS = 300;

function fillCartWithPushpanjaliAndArchana(): void {
  useCartStore.setState({
    lines: [
      buildCartLine({ quantity: 2 }),
      buildCartLine({ offeringId: "vaikom-archana", name: "Archana", unitPrice: 50 }),
    ],
  });
}

function cart(): HTMLElement {
  return screen.getByRole("region", { name: "Your cart" });
}

function placeOrderButton(): HTMLElement {
  return within(devoteeDetails()).getByRole("button", { name: /Plac(e|ing) order/ });
}

async function countOrders(): Promise<number> {
  const page = await getOrders({});
  return page.total;
}

async function findConfirmation(): Promise<HTMLElement> {
  return screen.findByRole("region", { name: "Order placed" });
}

describe("Checkout", () => {
  useInstantMockApi();
  useEmptyCart();
  beforeEach(fillCartWithPushpanjaliAndArchana);

  it("shows the order number and total once the order is placed", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<Checkout />);
    await fillDevoteeDetails(user);

    await user.click(placeOrderButton());

    const confirmation = await findConfirmation();
    expect(confirmation).toHaveTextContent("Order number VZ-1051");
    expect(confirmation).toHaveTextContent("Total ₹110");
  });

  it("empties the cart once the order is placed", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<Checkout />);
    await fillDevoteeDetails(user);

    await user.click(placeOrderButton());
    await findConfirmation();

    expect(cart()).toHaveTextContent("Your cart is empty.");
    expect(screen.queryByRole("region", { name: "Devotee details" })).not.toBeInTheDocument();
  });

  it("keeps a quantity added while the order is being placed", async () => {
    const user = userEvent.setup();
    configureMockApi({ minLatencyMs: SLOW_LATENCY_MS, maxLatencyMs: SLOW_LATENCY_MS });
    renderWithQueryClient(<Checkout />);
    await fillDevoteeDetails(user);

    await user.click(placeOrderButton());
    await user.click(within(cart()).getByRole("button", { name: "Increase quantity of Pushpanjali" }));
    await findConfirmation();

    expect(within(cart()).getByRole("listitem", { name: "Pushpanjali" })).toHaveTextContent("Quantity 1");
    expect(within(cart()).queryByRole("listitem", { name: "Archana" })).not.toBeInTheDocument();
  });

  it("creates exactly one order when Place order is double-clicked", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<Checkout />);
    await fillDevoteeDetails(user);
    const ordersBefore = await countOrders();

    await user.dblClick(placeOrderButton());
    await findConfirmation();

    expect(await countOrders()).toBe(ordersBefore + 1);
  });

  it("disables Place order while the order is being placed", async () => {
    const user = userEvent.setup();
    configureMockApi({ minLatencyMs: SLOW_LATENCY_MS, maxLatencyMs: SLOW_LATENCY_MS });
    renderWithQueryClient(<Checkout />);
    await fillDevoteeDetails(user);

    await user.click(placeOrderButton());

    expect(await within(devoteeDetails()).findByRole("button", { name: "Placing order…" })).toBeDisabled();
    await findConfirmation();
  });

  it("keeps the cart and details unchanged when placing the order fails", async () => {
    const user = userEvent.setup();
    configureMockApi({ failureRate: 1 });
    renderWithQueryClient(<Checkout />);
    await fillDevoteeDetails(user);

    await user.click(placeOrderButton());

    expect(await within(devoteeDetails()).findByRole("alert")).toHaveTextContent("Your order was not placed.");
    expect(within(cart()).getByRole("listitem", { name: "Pushpanjali" })).toHaveTextContent("Quantity 2");
    expect(within(cart()).getByRole("listitem", { name: "Archana" })).toBeInTheDocument();
    expect(within(devoteeDetails()).getByLabelText("Name")).toHaveValue("Meera Nair");
    expect(within(devoteeDetails()).getByLabelText("Phone")).toHaveValue("9847000001");
    expect(within(devoteeDetails()).getByLabelText("Nakshatra")).toHaveValue("Rohini");
    expect(within(devoteeDetails()).getByLabelText("Offering date")).toHaveValue("2026-11-02");
  });

  it("places the order when the devotee retries after a failure", async () => {
    const user = userEvent.setup();
    configureMockApi({ failureRate: 1 });
    renderWithQueryClient(<Checkout />);
    await fillDevoteeDetails(user);
    await user.click(placeOrderButton());
    await within(devoteeDetails()).findByRole("alert");
    configureMockApi({ failureRate: 0 });

    await user.click(placeOrderButton());

    expect(await findConfirmation()).toHaveTextContent("Order number VZ-1051");
  });

  it("does not place an order while the details are invalid", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<Checkout />);
    const ordersBefore = await countOrders();

    await user.click(placeOrderButton());

    expect(within(devoteeDetails()).getByLabelText("Name")).toBeInvalid();
    expect(await countOrders()).toBe(ordersBefore);
  });

  it("hides the confirmation when the devotee starts a new booking", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<Checkout />);
    await fillDevoteeDetails(user);
    await user.click(placeOrderButton());
    const confirmation = await findConfirmation();

    await user.click(within(confirmation).getByRole("button", { name: "Book more offerings" }));

    expect(screen.queryByRole("region", { name: "Order placed" })).not.toBeInTheDocument();
  });
});
