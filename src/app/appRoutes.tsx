import type { RouteObject } from "react-router";
import { OrdersPage } from "../features/orders";
import { App } from "./App";
import { BookingPage } from "./BookingPage";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <BookingPage /> },
      { path: "orders", element: <OrdersPage /> },
    ],
  },
];
