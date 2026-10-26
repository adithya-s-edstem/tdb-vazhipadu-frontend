import { cleanup, screen, within } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { buildCartLine } from "../../test/buildCartLine";
import { devoteeDetails, fillDevoteeDetails } from "../../test/fillDevoteeDetails";
import { renderWithQueryClient } from "../../test/renderWithQueryClient";
import { useEmptyCart } from "../../test/useEmptyCart";
import { useInstantMockApi } from "../../test/useInstantMockApi";
import { CART_STORAGE_KEY } from "../features/cart/useCartStore";
import { BookingPage } from "./BookingPage";

async function addToCart(user: UserEvent, offeringName: string): Promise<void> {
  await user.click(await screen.findByRole("button", { name: `Add ${offeringName} to cart` }));
}

function cart(): HTMLElement {
  return screen.getByRole("region", { name: "Your cart" });
}

function cartTotal(): HTMLElement {
  return within(cart()).getByRole("status", { name: "Total" });
}

function cartLine(offeringName: string): HTMLElement {
  return within(cart()).getByRole("listitem", { name: offeringName });
}

async function fillCartWithPushpanjaliAndArchana(user: UserEvent): Promise<void> {
  await addToCart(user, "Pushpanjali");
  await addToCart(user, "Pushpanjali");
  await addToCart(user, "Archana");
}

describe("BookingPage cart", () => {
  useInstantMockApi();
  useEmptyCart();

  it("tells the devotee the cart is empty before anything is added", async () => {
    renderWithQueryClient(<BookingPage />);

    await screen.findByRole("listitem", { name: "Pushpanjali" });

    expect(cart()).toHaveTextContent("Your cart is empty.");
  });

  it("shows a total of ₹110 for 2 Pushpanjali at ₹30 and 1 Archana at ₹50", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<BookingPage />);

    await fillCartWithPushpanjaliAndArchana(user);

    expect(cartLine("Pushpanjali")).toHaveTextContent("₹60");
    expect(cartLine("Archana")).toHaveTextContent("₹50");
    expect(cartTotal()).toHaveTextContent("₹110");
  });

  it("changes a line total when its quantity is increased", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<BookingPage />);
    await addToCart(user, "Archana");

    await user.click(within(cart()).getByRole("button", { name: "Increase quantity of Archana" }));

    expect(within(cartLine("Archana")).getByText("Quantity 2")).toBeInTheDocument();
    expect(cartLine("Archana")).toHaveTextContent("₹100");
  });

  it("announces the new quantity to screen readers when it changes", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<BookingPage />);
    await addToCart(user, "Archana");

    await user.click(within(cart()).getByRole("button", { name: "Increase quantity of Archana" }));

    expect(within(cartLine("Archana")).getByRole("status")).toHaveTextContent("Quantity 2");
  });

  it("does not let the quantity go below 1", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<BookingPage />);
    await addToCart(user, "Archana");

    const decrease = within(cart()).getByRole("button", { name: "Decrease quantity of Archana" });

    expect(decrease).toBeDisabled();
    expect(within(cartLine("Archana")).getByText("Quantity 1")).toBeInTheDocument();
  });

  it("updates the total when a line is removed", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<BookingPage />);
    await fillCartWithPushpanjaliAndArchana(user);

    await user.click(within(cart()).getByRole("button", { name: "Remove Pushpanjali" }));

    expect(within(cart()).queryByRole("listitem", { name: "Pushpanjali" })).not.toBeInTheDocument();
    expect(cartTotal()).toHaveTextContent("₹50");
  });

  it("keeps the cart after the page is refreshed", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<BookingPage />);
    await fillCartWithPushpanjaliAndArchana(user);
    cleanup();
    vi.resetModules();

    const { BookingPage: RefreshedBookingPage } = await import("./BookingPage");
    renderWithQueryClient(<RefreshedBookingPage />);

    expect(within(cartLine("Pushpanjali")).getByText("Quantity 2")).toBeInTheDocument();
    expect(cartTotal()).toHaveTextContent("₹110");
  });

  it("drops saved cart lines that are no longer valid when the page loads", async () => {
    const savedLines = [
      buildCartLine({ quantity: 2 }),
      buildCartLine({ offeringId: "vaikom-archana", name: "Archana", unitPrice: 50, quantity: 50 }),
    ];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ state: { lines: savedLines }, version: 0 }));
    vi.resetModules();

    const { BookingPage: ReloadedBookingPage } = await import("./BookingPage");
    renderWithQueryClient(<ReloadedBookingPage />);

    expect(within(cart()).queryByRole("listitem", { name: "Archana" })).not.toBeInTheDocument();
    expect(cartTotal()).toHaveTextContent("₹60");
  });

  it("does not mix offerings from two temples in one cart", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<BookingPage />);
    await addToCart(user, "Pushpanjali");

    await user.selectOptions(screen.getByRole("combobox", { name: "Temple" }), "Ettumanoor Mahadeva Temple");

    expect(await screen.findByRole("button", { name: "Add Thulabharam to cart" })).toBeDisabled();
    expect(screen.getByText(/Your cart has offerings from another temple/)).toBeInTheDocument();
  });
});

describe("BookingPage devotee details", () => {
  useInstantMockApi();
  useEmptyCart();

  it("asks for devotee details only once the cart has an offering", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<BookingPage />);
    await screen.findByRole("listitem", { name: "Pushpanjali" });
    expect(screen.queryByRole("region", { name: "Devotee details" })).not.toBeInTheDocument();

    await addToCart(user, "Pushpanjali");

    expect(screen.getByRole("region", { name: "Devotee details" })).toBeInTheDocument();
  });

  it("places an order for the cart and shows its order number and total", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<BookingPage />);
    await fillCartWithPushpanjaliAndArchana(user);
    await fillDevoteeDetails(user);

    await user.click(within(devoteeDetails()).getByRole("button", { name: "Place order" }));

    const confirmation = await screen.findByRole("region", { name: "Order placed" });
    expect(confirmation).toHaveTextContent("Order number VZ-1051");
    expect(confirmation).toHaveTextContent("Total ₹110");
    expect(cart()).toHaveTextContent("Your cart is empty.");
  });
});
