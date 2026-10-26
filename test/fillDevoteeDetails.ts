import { screen, within } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";

export function devoteeDetails(): HTMLElement {
  return screen.getByRole("region", { name: "Devotee details" });
}

export async function fillDevoteeDetails(user: UserEvent): Promise<void> {
  await user.type(within(devoteeDetails()).getByLabelText("Name"), "Meera Nair");
  await user.type(within(devoteeDetails()).getByLabelText("Phone"), "9847000001");
  await user.selectOptions(within(devoteeDetails()).getByLabelText("Nakshatra"), "Rohini");
  await user.type(within(devoteeDetails()).getByLabelText("Offering date"), "2026-11-02");
}
