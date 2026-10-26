import { NavLink, Outlet } from "react-router";

const NAV_LINK_CLASSES = "rounded px-2 py-1 underline-offset-4 hover:underline aria-[current=page]:underline";

export function App() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900">
      <header className="flex flex-wrap items-center justify-between gap-2 bg-amber-700 px-4 py-3 text-white">
        <h1 className="text-xl font-semibold">Vazhipadu booking</h1>
        <nav aria-label="Main" className="flex gap-2">
          <NavLink to="/" end className={NAV_LINK_CLASSES}>
            Offerings
          </NavLink>
          <NavLink to="/orders" className={NAV_LINK_CLASSES}>
            Orders
          </NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
