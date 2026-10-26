import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { appRoutes } from "../src/app/appRoutes";
import { renderWithQueryClient } from "./renderWithQueryClient";

export function renderRoute(path: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  const user = userEvent.setup();
  const view = renderWithQueryClient(<RouterProvider router={router} />);
  const currentUrl = () => `${router.state.location.pathname}${router.state.location.search}`;
  return { ...view, user, currentUrl };
}
