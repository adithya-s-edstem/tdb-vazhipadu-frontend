import type { Temple } from "../../api/types";

interface TemplePickerProps {
  temples: Pick<Temple, "id" | "name">[];
  selectedTempleId: string;
  onSelect: (templeId: string) => void;
}

export function TemplePicker({ temples, selectedTempleId, onSelect }: TemplePickerProps) {
  return (
    <label className="flex flex-1 flex-col gap-1 font-medium">
      Temple
      <select
        value={selectedTempleId}
        onChange={(event) => onSelect(event.target.value)}
        className="rounded border border-stone-500 bg-white px-3 py-2 font-normal"
      >
        {temples.map((temple) => (
          <option key={temple.id} value={temple.id}>
            {temple.name}
          </option>
        ))}
      </select>
    </label>
  );
}
