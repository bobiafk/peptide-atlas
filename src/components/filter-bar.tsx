"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

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
  const hasFilters = Boolean(search || category || availability);

  return (
    <div className="lift-card flex flex-col gap-4 p-5 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search 102 peptides…"
          className="w-full rounded-full border border-hairline bg-panel-muted py-2.5 pl-10 pr-4 text-sm text-text outline-none ring-accent-blue/30 transition focus:bg-[#0a1326] focus:ring"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
        <SlidersHorizontal className="hidden h-4 w-4 shrink-0 text-muted md:block" />
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="rounded-full border border-hairline bg-panel-muted px-4 py-2.5 text-sm capitalize text-text outline-none ring-accent-blue/30 focus:ring"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item.replaceAll("-", " ")}
            </option>
          ))}
        </select>
        <select
          value={availability}
          onChange={(event) => onAvailabilityChange(event.target.value)}
          className="rounded-full border border-hairline bg-panel-muted px-4 py-2.5 text-sm text-text outline-none ring-accent-blue/30 focus:ring"
        >
          <option value="">All availability</option>
          {availabilities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              onSearchChange("");
              onCategoryChange("");
              onAvailabilityChange("");
            }}
            className="inline-flex items-center gap-1 rounded-full border border-hairline px-3 py-2.5 text-xs font-medium text-muted transition hover:border-accent-coral/40 hover:text-accent-coral"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
