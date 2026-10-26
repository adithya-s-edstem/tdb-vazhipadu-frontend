interface OfferingSearchProps {
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
}

export function OfferingSearch({ searchTerm, onSearch }: OfferingSearchProps) {
  return (
    <label className="flex flex-1 flex-col gap-1 font-medium">
      Search offerings
      <input
        type="search"
        value={searchTerm}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="e.g. Pushpanjali"
        className="rounded border border-stone-300 bg-white px-3 py-2 font-normal"
      />
    </label>
  );
}
