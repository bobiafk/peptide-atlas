"use client";

export function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  availability,
  onAvailabilityChange,
  categories,
  availabilities,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  availability: string;
  onAvailabilityChange: (value: string) => void;
  categories: string[];
  availabilities: string[];
}): JSX.Element {
  return (
    <div className="soft-card grid gap-3 p-5 md:grid-cols-3">
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search peptide..."
        className="rounded-xl border border-hairline bg-panel-muted px-3 py-2 text-sm outline-none ring-accent-blue/30 focus:ring"
      />
      <select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        className="rounded-xl border border-hairline bg-panel-muted px-3 py-2 text-sm outline-none ring-accent-blue/30 focus:ring"
      >
        <option value="">All Categories</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item.replaceAll("-", " ")}
          </option>
        ))}
      </select>
      <select
        value={availability}
        onChange={(event) => onAvailabilityChange(event.target.value)}
        className="rounded-xl border border-hairline bg-panel-muted px-3 py-2 text-sm outline-none ring-accent-blue/30 focus:ring"
      >
        <option value="">All Availability</option>
        {availabilities.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
