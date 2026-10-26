import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithQueryClient } from "../../test/renderWithQueryClient";
import { useInstantMockApi } from "../../test/useInstantMockApi";
import { App } from "./App";

describe("App", () => {
  useInstantMockApi();

  it("shows the app name as the main heading", () => {
    renderWithQueryClient(<App />);

    expect(screen.getByRole("heading", { level: 1, name: "Vazhipadu booking" })).toBeInTheDocument();
  });

  it("opens on the offerings of the default temple", async () => {
    renderWithQueryClient(<App />);

    expect(await screen.findByRole("listitem", { name: "Pushpanjali" })).toBeInTheDocument();
  });
});
