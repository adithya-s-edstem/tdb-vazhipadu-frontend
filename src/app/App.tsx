import { OfferingsPage } from "../features/offerings/OfferingsPage";

export function App() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900">
      <header className="bg-amber-700 px-4 py-3 text-white">
        <h1 className="text-xl font-semibold">Vazhipadu booking</h1>
      </header>
      <main className="mx-auto max-w-3xl p-4">
        <h2 className="mb-4 text-lg font-semibold">Offerings</h2>
        <OfferingsPage />
      </main>
    </div>
  );
}
