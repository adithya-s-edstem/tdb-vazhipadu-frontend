import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderRoute } from "../../test/renderRoute";
import { useInstantMockApi } from "../../test/useInstantMockApi";

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
