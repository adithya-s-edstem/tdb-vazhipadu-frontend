import { render, screen, within } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NAKSHATRAS } from "../../api/types";
import { useFixedToday } from "../../../test/useFixedToday";
import { OrderForm } from "./OrderForm";

interface FilledDetails {
  name: string;
  phone: string;
  nakshatra: string;
  offeringDate: string;
}

const VALID_DETAILS: FilledDetails = {
  name: "Meera Nair",
  phone: "9847000001",
  nakshatra: "Rohini",
  offeringDate: "2026-11-02",
};

async function fillForm(user: UserEvent, overrides: Partial<FilledDetails> = {}): Promise<void> {
  const details = { ...VALID_DETAILS, ...overrides };
  await user.type(screen.getByLabelText("Name"), details.name);
  await user.type(screen.getByLabelText("Phone"), details.phone);
  await user.selectOptions(screen.getByLabelText("Nakshatra"), details.nakshatra);
  await user.type(screen.getByLabelText("Offering date"), details.offeringDate);
}

async function submit(user: UserEvent): Promise<void> {
  await user.click(screen.getByRole("button", { name: "Place order" }));
}

describe("OrderForm", () => {
  useFixedToday();

  it("shows each invalid field's own message next to it", async () => {
    const user = userEvent.setup();
    render(<OrderForm onSubmit={vi.fn()} isSubmitting={false} />);

    await submit(user);

    expect(screen.getByLabelText("Name")).toHaveAccessibleDescription("Enter the devotee's name.");
    expect(screen.getByLabelText("Phone")).toHaveAccessibleDescription("Enter a phone number.");
    expect(screen.getByLabelText("Nakshatra")).toHaveAccessibleDescription("Choose a nakshatra.");
    expect(screen.getByLabelText("Offering date")).toHaveAccessibleDescription("Choose the offering date.");
  });

  it("marks only the invalid fields as invalid", async () => {
    const user = userEvent.setup();
    render(<OrderForm onSubmit={vi.fn()} isSubmitting={false} />);
    await fillForm(user, { phone: "12345" });

    await submit(user);

    expect(screen.getByLabelText("Phone")).toBeInvalid();
    expect(screen.getByLabelText("Name")).toBeValid();
    expect(screen.getByLabelText("Name")).not.toHaveAccessibleDescription();
  });

  it("rejects a phone number that is not a 10-digit Indian mobile", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<OrderForm onSubmit={onSubmit} isSubmitting={false} />);
    await fillForm(user, { phone: "12345" });

    await submit(user);

    expect(screen.getByLabelText("Phone")).toHaveAccessibleDescription(
      "Enter a 10-digit Indian mobile number, optionally starting with +91.",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects an offering date in the past", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<OrderForm onSubmit={onSubmit} isSubmitting={false} />);
    await fillForm(user, { offeringDate: "2026-10-25" });

    await submit(user);

    expect(screen.getByLabelText("Offering date")).toHaveAccessibleDescription(
      "The offering date cannot be in the past.",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("accepts today as the offering date", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<OrderForm onSubmit={onSubmit} isSubmitting={false} />);
    await fillForm(user, { offeringDate: "2026-10-26" });

    await submit(user);

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ offeringDate: "2026-10-26" }));
  });

  it("cannot be submitted again while the order is being placed", () => {
    render(<OrderForm onSubmit={vi.fn()} isSubmitting={true} />);

    expect(screen.getByRole("button", { name: "Placing order…" })).toBeDisabled();
  });

  it("offers all 27 nakshatras", () => {
    render(<OrderForm onSubmit={vi.fn()} isSubmitting={false} />);

    const options = within(screen.getByLabelText("Nakshatra")).getAllByRole("option");

    expect(options.map((option) => option.textContent).slice(1)).toEqual([...NAKSHATRAS]);
  });

  it("submits the details with the phone as a plain 10-digit number", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<OrderForm onSubmit={onSubmit} isSubmitting={false} />);
    await fillForm(user, { name: "  Meera Nair ", phone: "+91 98470 00001" });

    await submit(user);

    expect(onSubmit).toHaveBeenCalledWith(VALID_DETAILS);
  });

  it("clears a field's message once the devotee corrects it", async () => {
    const user = userEvent.setup();
    render(<OrderForm onSubmit={vi.fn()} isSubmitting={false} />);
    await submit(user);

    await user.type(screen.getByLabelText("Name"), "Meera Nair");

    expect(screen.getByLabelText("Name")).not.toHaveAccessibleDescription();
  });
});
