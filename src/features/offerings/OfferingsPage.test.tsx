import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { configureMockApi } from "../../api/client";
import { refreshQueriesInBackground } from "../../../test/refreshQueriesInBackground";
import { renderWithQueryClient } from "../../../test/renderWithQueryClient";
import { useInstantMockApi } from "../../../test/useInstantMockApi";
import { OfferingsPage } from "./OfferingsPage";

const SLOW_RESPONSE_MS = 60_000;

async function findOfferingNames(): Promise<string[]> {
  const list = await screen.findByRole("list", { name: "Offerings" });
  return within(list)
    .getAllByRole("heading")
    .map((heading) => heading.textContent ?? "");
}

describe("OfferingsPage", () => {
  useInstantMockApi();

  it("shows a loading message while temples load", () => {
    renderWithQueryClient(<OfferingsPage />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading temples");
  });

  it("selects the first temple by default and lists its offerings with prices in rupees", async () => {
    renderWithQueryClient(<OfferingsPage />);

    const pushpanjali = await screen.findByRole("listitem", { name: "Pushpanjali" });

    expect(screen.getByRole("combobox", { name: "Temple" })).toHaveDisplayValue("Vaikom Mahadeva Temple");
    expect(pushpanjali).toHaveTextContent("₹30");
    expect(screen.getByRole("listitem", { name: "Archana" })).toHaveTextContent("₹50");
  });

  it('shows Pushpanjali and hides offerings that do not match when searching "push"', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<OfferingsPage />);
    await screen.findByRole("listitem", { name: "Pushpanjali" });

    await user.type(screen.getByRole("searchbox", { name: "Search offerings" }), "push");

    expect(await findOfferingNames()).toEqual(["Pushpanjali"]);
  });

  it("does not offer inactive offerings for booking", async () => {
    renderWithQueryClient(<OfferingsPage />);

    await screen.findByRole("listitem", { name: "Pushpanjali" });

    expect(screen.queryByRole("listitem", { name: "Ennabhishekam" })).not.toBeInTheDocument();
  });

  it("tells the devotee when no offering matches the search", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<OfferingsPage />);
    await screen.findByRole("listitem", { name: "Pushpanjali" });

    await user.type(screen.getByRole("searchbox", { name: "Search offerings" }), "xyz");

    expect(screen.getByRole("status")).toHaveTextContent('No offerings match "xyz".');
    expect(screen.queryByRole("list", { name: "Offerings" })).not.toBeInTheDocument();
  });

  it("announces how many offerings match the search", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<OfferingsPage />);
    await screen.findByRole("listitem", { name: "Pushpanjali" });

    await user.type(screen.getByRole("searchbox", { name: "Search offerings" }), "push");

    expect(screen.getByRole("status")).toHaveTextContent("1 offering available.");
  });

  it("lists the offerings of another temple when it is picked", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<OfferingsPage />);
    await screen.findByRole("listitem", { name: "Pushpanjali" });

    await user.selectOptions(screen.getByRole("combobox", { name: "Temple" }), "Ettumanoor Mahadeva Temple");

    expect(await screen.findByRole("listitem", { name: "Thulabharam" })).toHaveTextContent("₹1,000");
    expect(screen.queryByRole("listitem", { name: "Pushpanjali" })).not.toBeInTheDocument();
  });

  it("shows an error when temples fail to load and recovers on retry", async () => {
    const user = userEvent.setup();
    configureMockApi({ failureRate: 1 });
    renderWithQueryClient(<OfferingsPage />);

    const alert = await screen.findByRole("alert");
    configureMockApi({ failureRate: 0 });
    await user.click(within(alert).getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("listitem", { name: "Pushpanjali" })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("keeps the temple, search and offerings on screen when a background refresh fails", async () => {
    const user = userEvent.setup();
    const { queryClient } = renderWithQueryClient(<OfferingsPage />);
    await screen.findByRole("listitem", { name: "Pushpanjali" });
    await user.type(screen.getByRole("searchbox", { name: "Search offerings" }), "push");
    configureMockApi({ failureRate: 1 });

    await refreshQueriesInBackground(queryClient);

    expect(screen.getByRole("combobox", { name: "Temple" })).toHaveDisplayValue("Vaikom Mahadeva Temple");
    expect(screen.getByRole("searchbox", { name: "Search offerings" })).toHaveValue("push");
    expect(await findOfferingNames()).toEqual(["Pushpanjali"]);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("keeps showing cached offerings when returning to a temple whose refresh fails", async () => {
    const user = userEvent.setup();
    const { queryClient } = renderWithQueryClient(<OfferingsPage />);
    const templePicker = await screen.findByRole("combobox", { name: "Temple" });
    await screen.findByRole("listitem", { name: "Pushpanjali" });
    await user.selectOptions(templePicker, "Ettumanoor Mahadeva Temple");
    await screen.findByRole("listitem", { name: "Thulabharam" });
    configureMockApi({ failureRate: 1 });

    await user.selectOptions(templePicker, "Vaikom Mahadeva Temple");
    await refreshQueriesInBackground(queryClient);

    expect(screen.getByRole("listitem", { name: "Pushpanjali" })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows an error when offerings fail to load and recovers on retry", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<OfferingsPage />);
    await screen.findByRole("listitem", { name: "Pushpanjali" });
    configureMockApi({ failureRate: 1 });

    await user.selectOptions(screen.getByRole("combobox", { name: "Temple" }), "Ettumanoor Mahadeva Temple");
    const alert = await screen.findByRole("alert");
    configureMockApi({ failureRate: 0 });
    await user.click(within(alert).getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("listitem", { name: "Thulabharam" })).toBeInTheDocument();
  });

  it("explains that offerings could not be loaded", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<OfferingsPage />);
    await screen.findByRole("listitem", { name: "Pushpanjali" });
    configureMockApi({ failureRate: 1 });

    await user.selectOptions(screen.getByRole("combobox", { name: "Temple" }), "Ettumanoor Mahadeva Temple");

    expect(await screen.findByRole("alert")).toHaveTextContent("Could not load offerings.");
  });

  it("shows a loading message while a temple's offerings load", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<OfferingsPage />);
    await screen.findByRole("listitem", { name: "Pushpanjali" });
    configureMockApi({ minLatencyMs: SLOW_RESPONSE_MS, maxLatencyMs: SLOW_RESPONSE_MS });

    await user.selectOptions(screen.getByRole("combobox", { name: "Temple" }), "Ettumanoor Mahadeva Temple");

    expect(screen.getByRole("status")).toHaveTextContent("Loading offerings");
  });
});
