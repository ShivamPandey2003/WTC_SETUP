import { cn } from "@/lib/utils";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { useState } from "react";
import { stageLabel } from "../V2_ProgrammeShared/programmeUtils";
import { facetCounts, type AgendaFilters, type Facet } from "./agendaFilters";

type Option = { value: string; label: string; color?: string };

type Props = {
  sessions: Programme[]; // day sessions after tab + search, before facets
  filters: AgendaFilters;
  onChange: (f: AgendaFilters) => void;
  categories: { id: string; name: string; color: string }[];
  stages: string[];
  rooms: string[];
};

const COLLAPSED_LIMIT = 6;

const CheckRow = ({
  option,
  count,
  checked,
  onToggle,
}: {
  option: Option;
  count: number;
  checked: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={onToggle}
    disabled={!checked && count === 0}
    className={cn(
      "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-left text-sm transition-colors",
      checked ? "bg-primary/10" : "hover:bg-gray-100",
      !checked && count === 0 && "opacity-40 cursor-not-allowed hover:bg-transparent",
    )}
  >
    <span
      className={cn(
        "size-4 shrink-0 rounded border grid place-items-center transition-colors",
        checked ? "bg-primary border-primary text-white" : "border-gray-300 bg-white",
      )}
    >
      {checked && <Check className="size-3" strokeWidth={3} />}
    </span>
    {option.color && (
      <span className="size-2.5 shrink-0 rounded-full" style={{ background: option.color }} />
    )}
    <span
      title={option.label}
      className={cn("flex-1 min-w-0 truncate", checked ? "text-gray-900 font-medium" : "text-gray-700")}
    >
      {option.label}
    </span>
    <span className="text-xs tabular-nums text-gray-400">{count}</span>
  </button>
);

const FacetSection = ({
  title,
  facet,
  options,
  counts,
  filters,
  onChange,
  query,
}: {
  title: string;
  facet: Facet;
  options: Option[];
  counts: Map<string, number>;
  filters: AgendaFilters;
  onChange: (f: AgendaFilters) => void;
  query: string;
}) => {
  const [isOpen, setOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const open = isOpen || !!query; // searching always reveals matches

  const selected = filters[facet];
  // Selected first, then by how many sessions they'd show
  const sorted = options
    .filter((o) => selected.includes(o.value) || (counts.get(o.value) ?? 0) > 0)
    .filter((o) => matches(o.label, query))
    .sort(
      (a, b) =>
        Number(selected.includes(b.value)) - Number(selected.includes(a.value)) ||
        (counts.get(b.value) ?? 0) - (counts.get(a.value) ?? 0),
    );
  const visible = showAll || query ? sorted : sorted.slice(0, COLLAPSED_LIMIT);

  const toggle = (value: string) =>
    onChange({
      ...filters,
      [facet]: selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value],
    });

  if (sorted.length === 0) return null;

  return (
    <section className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center justify-between px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500"
      >
        <span>
          {title}
          {selected.length > 0 && <span className="ml-1.5 text-primary normal-case">· {selected.length}</span>}
        </span>
        <ChevronDown className={cn("size-4 transition-transform", !open && "-rotate-90")} />
      </button>
      {open && (
        <>
          {visible.map((o) => (
            <CheckRow
              key={o.value}
              option={o}
              count={counts.get(o.value) ?? 0}
              checked={selected.includes(o.value)}
              onToggle={() => toggle(o.value)}
            />
          ))}
          {!query && sorted.length > COLLAPSED_LIMIT && (
            <button
              type="button"
              onClick={() => setShowAll((s) => !s)}
              className="self-start px-2 py-1 text-xs font-medium text-primary hover:underline"
            >
              {showAll ? "Show less" : `Show all ${sorted.length}`}
            </button>
          )}
        </>
      )}
    </section>
  );
};

const matches = (label: string, q: string) => label.toLowerCase().includes(q.trim().toLowerCase());

const AgendaFilterPanel = ({ sessions, filters, onChange, categories, stages, rooms }: Props) => {
  const [query, setQuery] = useState("");
  const sections: { title: string; facet: Facet; options: Option[] }[] = [
    { title: "Tracks", facet: "tracks", options: categories.map((c) => ({ value: c.id, label: c.name, color: c.color })) },
    { title: "Streams", facet: "stages", options: stages.map((s) => ({ value: s, label: stageLabel(s) })) },
    { title: "Rooms", facet: "rooms", options: rooms.map((r) => ({ value: r, label: r })) },
  ];
  const nothingFound =
    !!query.trim() && sections.every((sec) => !sec.options.some((o) => matches(o.label, query)));

  return (
    <div className="flex flex-col gap-5">
      <label className="mx-2 flex items-center gap-2 h-9 px-2.5 bg-white border border-gray-300 rounded-md focus-within:border-primary">
        <Search className="size-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tracks, streams, rooms"
          aria-label="Search filters"
          className="flex-1 min-w-0 outline-none text-sm bg-transparent"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear filter search" className="text-gray-400 hover:text-gray-600">
            <X className="size-4" />
          </button>
        )}
      </label>
      {sections.map((sec) => (
        <FacetSection
          key={sec.facet}
          title={sec.title}
          facet={sec.facet}
          options={sec.options}
          counts={facetCounts(sessions, filters, sec.facet)}
          filters={filters}
          onChange={onChange}
          query={query}
        />
      ))}
      {nothingFound && <p className="px-2 text-sm text-gray-500">No filters match “{query.trim()}”.</p>}
    </div>
  );
};

export default AgendaFilterPanel;
