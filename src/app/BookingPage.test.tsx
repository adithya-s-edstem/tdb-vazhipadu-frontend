import { cleanup, screen, within } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithQueryClient } from "../../test/renderWithQueryClient";
import { useEmptyCart } from "../../test/useEmptyCart";
import { useInstantMockApi } from "../../test/useInstantMockApi";
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

function devoteeDetails(): HTMLElement {
  return screen.getByRole("region", { name: "Devotee details" });
}

function detailsStatus(): HTMLElement {
  return within(devoteeDetails()).getByRole("status");
}

async function fillDevoteeDetails(user: UserEvent): Promise<void> {
  await user.type(within(devoteeDetails()).getByLabelText("Name"), "Meera Nair");
  await user.type(within(devoteeDetails()).getByLabelText("Phone"), "9847000001");
  await user.selectOptions(within(devoteeDetails()).getByLabelText("Nakshatra"), "Rohini");
  await user.type(within(devoteeDetails()).getByLabelText("Offering date"), "2026-11-02");
}

async function checkDetails(user: UserEvent): Promise<void> {
  await user.click(within(devoteeDetails()).getByRole("button", { name: "Check details" }));
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

  it("confirms the details once every field is valid", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<BookingPage />);
    await addToCart(user, "Pushpanjali");

    await fillDevoteeDetails(user);
    await checkDetails(user);

    expect(detailsStatus()).toHaveTextContent("Details look good.");
  });

  it("withdraws the confirmation as soon as a field is changed", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<BookingPage />);
    await addToCart(user, "Pushpanjali");
    await fillDevoteeDetails(user);
    await checkDetails(user);

    await user.clear(within(devoteeDetails()).getByLabelText("Phone"));

    expect(detailsStatus()).toBeEmptyDOMElement();
  });

  it("does not confirm details alongside an error after a later failed check", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<BookingPage />);
    await addToCart(user, "Pushpanjali");
    await fillDevoteeDetails(user);
    await checkDetails(user);
    const phone = within(devoteeDetails()).getByLabelText("Phone");
    await user.clear(phone);
    await user.type(phone, "12345");

    await checkDetails(user);

    expect(phone).toBeInvalid();
    expect(detailsStatus()).toBeEmptyDOMElement();
  });
});
