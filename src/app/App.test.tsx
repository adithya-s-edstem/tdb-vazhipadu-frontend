import { screen, within } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { devoteeDetails } from "../../test/fillDevoteeDetails";
import { renderRoute } from "../../test/renderRoute";
import { tabTo } from "../../test/tabTo";
import { useEmptyCart } from "../../test/useEmptyCart";
import { useInstantMockApi } from "../../test/useInstantMockApi";

async function tabAndPress(user: UserEvent, target: HTMLElement, key: string): Promise<void> {
  await tabTo(user, target);
  await user.keyboard(key);
}

async function tabAndType(user: UserEvent, label: string, text: string): Promise<void> {
  await tabTo(user, within(devoteeDetails()).getByLabelText(label));
  await user.keyboard(text);
}

async function tabAndChooseNakshatra(user: UserEvent, nakshatra: string): Promise<void> {
  const nakshatraField = within(devoteeDetails()).getByLabelText("Nakshatra");
  await tabTo(user, nakshatraField);
  await user.selectOptions(nakshatraField, nakshatra);
}

describe("App", () => {
  useInstantMockApi();

  it("shows the app name as the main heading", () => {
    renderRoute("/");

    expect(screen.getByRole("heading", { level: 1, name: "Vazhipadu booking" })).toBeInTheDocument();
  });

  it("opens on the offerings of the default temple", async () => {
    renderRoute("/");

    expect(await screen.findByRole("listitem", { name: "Pushpanjali" })).toBeInTheDocument();
  });

  it("opens the orders list from the main navigation", async () => {
    const { user } = renderRoute("/");

    await user.click(screen.getByRole("link", { name: "Orders" }));

    expect(await screen.findByRole("heading", { level: 2, name: "Orders" })).toBeInTheDocument();
  });
});

describe("App keyboard booking", () => {
  useInstantMockApi();
  useEmptyCart();

  it("books offerings from start to confirmation with the keyboard alone", async () => {
    const { user } = renderRoute("/");
    await tabAndPress(user, await screen.findByRole("button", { name: "Add Pushpanjali to cart" }), "{Enter}");
    await tabAndPress(user, screen.getByRole("button", { name: "Add Archana to cart" }), " ");
    await tabAndPress(user, screen.getByRole("button", { name: "Increase quantity of Archana" }), "{Enter}");
    await tabAndType(user, "Name", "Meera Nair");
    await tabAndType(user, "Phone", "9847000001");
    await tabAndChooseNakshatra(user, "Rohini");
    await tabAndType(user, "Offering date", "2026-11-02");

    await tabAndPress(user, within(devoteeDetails()).getByRole("button", { name: "Place order" }), "{Enter}");

    const confirmation = await screen.findByRole("region", { name: "Order placed" });
    expect(within(confirmation).getByRole("heading", { name: "Order placed" })).toHaveFocus();
    expect(confirmation).toHaveTextContent("Total ₹130");
  });

  it("starts a new booking from the confirmation with the keyboard", async () => {
    const { user } = renderRoute("/");
    await tabAndPress(user, await screen.findByRole("button", { name: "Add Archana to cart" }), "{Enter}");
    await tabAndType(user, "Name", "Meera Nair");
    await tabAndType(user, "Phone", "9847000001");
    await tabAndChooseNakshatra(user, "Rohini");
    await tabAndType(user, "Offering date", "2026-11-02");
    await user.keyboard("{Enter}");
    await screen.findByRole("region", { name: "Order placed" });

    await tabAndPress(user, screen.getByRole("button", { name: "Book more offerings" }), "{Enter}");

    expect(screen.queryByRole("region", { name: "Order placed" })).not.toBeInTheDocument();
  });

  it("takes the devotee to the first invalid field when details are missing", async () => {
    const { user } = renderRoute("/");
    await tabAndPress(user, await screen.findByRole("button", { name: "Add Archana to cart" }), "{Enter}");
    await tabAndType(user, "Name", "Meera Nair");

    await tabAndPress(user, within(devoteeDetails()).getByRole("button", { name: "Place order" }), "{Enter}");

    expect(within(devoteeDetails()).getByLabelText("Phone")).toHaveFocus();
  });
});
