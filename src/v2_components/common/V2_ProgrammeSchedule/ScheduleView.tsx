import { cn } from "@/lib/utils";
import { Filter, Heart, LayoutGrid, Rows3, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import SessionDetailModal from "../V2_ProgrammeShared/SessionDetailModal";
import {
  AppliedFilters,
  EmptyState,
  ProgrammeError,
  ProgrammeLoading,
} from "../V2_ProgrammeShared/ProgrammeUI";
import {
  dayParts,
  getCategory,
  getRoom,
  isHappeningNow,
  matchesSearch,
  stageLabel,
} from "../V2_ProgrammeShared/programmeUtils";
import { useFavourites } from "../V2_ProgrammeShared/useFavourites";
import { useProgrammeData } from "../V2_ProgrammeShared/useProgrammeData";
import RoomGrid from "./RoomGrid";
import ScheduleFilterSheet from "./ScheduleFilterSheet";
import { EMPTY_SCHEDULE_FILTERS, type ScheduleFilters } from "./scheduleFilters";
import ScheduleList from "./ScheduleList";

const Chip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={cn(
      "shrink-0 h-9 px-4 rounded-full border text-sm whitespace-nowrap transition-colors",
      active
        ? "border-primary bg-primary/10 text-primary font-medium"
        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
    )}
  >
    {children}
  </button>
);

/** Programme by room: room columns × time rows (grid) or a time-grouped list. */
const ScheduleView = () => {
  const data = useProgrammeData();
  const favourites = useFavourites();

  const [view, setView] = useState<"grid" | "list">("grid");
  const [tab, setTab] = useState<"all" | "favourites">("all");
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [happeningNow, setHappeningNow] = useState(false);
  const [withSpeakers, setWithSpeakers] = useState(false);
  const [filters, setFilters] = useState<ScheduleFilters>(EMPTY_SCHEDULE_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [opened, setOpened] = useState<Programme[] | null>(null);

  const day = pickedDay ?? data.days[0];
  const sheetCount = filters.stages.length + filters.rooms.length + filters.categories.length;
  const isFiltered = sheetCount > 0 || happeningNow || withSpeakers || search.trim() !== "";

  const sessions = useMemo(
    () =>
      data.sessions.filter(
        (s) =>
          s.start_date === day &&
          (tab === "all" || favourites.favourites.includes(s.id)) &&
          (!happeningNow || isHappeningNow(s)) &&
          (!withSpeakers || s.speakers.length > 0) &&
          (!filters.stages.length || filters.stages.includes(s.type)) &&
          (!filters.rooms.length || filters.rooms.includes(getRoom(s))) &&
          (!filters.categories.length || filters.categories.includes(getCategory(s).id)) &&
          matchesSearch(s, search.trim()),
      ),
    [data.sessions, day, tab, favourites.favourites, happeningNow, withSpeakers, filters, search],
  );

  if (data.isPending) return <ProgrammeLoading />;
  if (data.error) return <ProgrammeError message={data.error.message} />;

  const clearAll = () => {
    setFilters(EMPTY_SCHEDULE_FILTERS);
    setHappeningNow(false);
    setWithSpeakers(false);
    setSearch("");
  };

  const categoryById = new Map(data.categories.map((c) => [c.id, c]));
  const applied = [
    ...filters.stages.map((v) => ({ id: `stages:${v}`, label: stageLabel(v) })),
    ...filters.categories.map((v) => ({
      id: `categories:${v}`,
      label: categoryById.get(v)?.name ?? v,
      color: categoryById.get(v)?.color,
    })),
    ...filters.rooms.map((v) => ({ id: `rooms:${v}`, label: v })),
  ];
  const removeApplied = (id: string) => {
    const [key, ...rest] = id.split(":");
    const value = rest.join(":");
    setFilters((f) => ({
      ...f,
      [key]: f[key as keyof ScheduleFilters].filter((x) => x !== value),
    }));
  };

  const viewButton = (v: "grid" | "list", Icon: typeof LayoutGrid, label: string) => (
    <button
      type="button"
      onClick={() => setView(v)}
      aria-pressed={view === v}
      aria-label={`${label} view`}
      className={cn(
        "flex items-center gap-2 h-full px-3 sm:px-4 text-sm",
        view === v ? "bg-gray-100 text-gray-900 font-medium" : "bg-white text-gray-600",
      )}
    >
      <Icon className="size-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="px-4 pb-10 mx-auto w-full max-w-7xl">
      <div className="bg-white rounded-2xl p-4 sm:p-8 flex flex-col gap-4 sm:gap-5">
        {/* Search · Grid/List · Filters */}
        <div className="flex gap-2 sm:gap-3">
          <label className="flex-1 min-w-0 flex items-center gap-2 h-11 px-3 rounded-lg border border-gray-200 focus-within:border-primary">
            <Search className="size-4 text-gray-500 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="flex-1 min-w-0 outline-none text-sm bg-transparent"
            />
            {search && (
              <button type="button" aria-label="Clear search" onClick={() => setSearch("")}>
                <X className="size-4 text-gray-400" />
              </button>
            )}
          </label>
          <div className="flex h-11 rounded-lg border border-gray-200 overflow-hidden divide-x divide-gray-200">
            {viewButton("grid", LayoutGrid, "Grid")}
            {viewButton("list", Rows3, "List")}
          </div>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            aria-label="Filters"
            className="relative flex items-center gap-2 h-11 px-3 sm:px-4 rounded-lg border border-gray-200 text-primary text-sm"
          >
            <Filter className="size-4" />
            <span className="hidden sm:inline">Filters</span>
            {sheetCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-primary text-white text-[11px] grid place-items-center">
                {sheetCount}
              </span>
            )}
          </button>
        </div>

        {/* All / Favourites + quick filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex p-1 rounded-full bg-gray-100 w-full sm:w-fit">
            {(["all", "favourites"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 sm:flex-none flex items-center justify-center gap-1.5 h-8 px-4 rounded-full text-sm transition-colors",
                  tab === t ? "bg-white shadow-sm text-gray-900 font-medium" : "text-gray-600",
                )}
              >
                {t === "all" ? (
                  "All sessions"
                ) : (
                  <>
                    <Heart className="size-3.5" /> Favourites
                    <span className="text-xs text-gray-500">({favourites.favourites.length})</span>
                  </>
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <Chip active={happeningNow} onClick={() => setHappeningNow(!happeningNow)}>
              Happening now
            </Chip>
            <Chip active={withSpeakers} onClick={() => setWithSpeakers(!withSpeakers)}>
              With speakers
            </Chip>
          </div>
        </div>

        <AppliedFilters items={applied} onRemove={removeApplied} onClearAll={clearAll} />

        {/* Day cards */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {data.days.map((d) => {
            const { weekday, short } = dayParts(d);
            const active = d === day;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setPickedDay(d)}
                className={cn(
                  "shrink-0 w-32 sm:w-52 text-left rounded-lg px-4 py-3 border transition-colors",
                  active ? "border-2 border-primary" : "border-gray-200 hover:border-gray-300",
                )}
              >
                <p className={cn("text-xs sm:text-sm", active ? "text-primary" : "text-gray-500")}>
                  {weekday}
                </p>
                <p className={cn("text-base sm:text-lg", active ? "text-primary" : "text-gray-600")}>
                  {short}
                </p>
              </button>
            );
          })}
        </div>

        {sessions.length === 0 ? (
          <EmptyState favourites={tab === "favourites"} filtered={isFiltered} onClear={clearAll} />
        ) : view === "grid" ? (
          <RoomGrid
            sessions={sessions}
            rooms={data.rooms}
            favourites={favourites}
            onOpen={setOpened}
          />
        ) : (
          <ScheduleList sessions={sessions} favourites={favourites} onOpen={setOpened} />
        )}
      </div>

      <ScheduleFilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        value={filters}
        onApply={setFilters}
        stages={data.stages}
        rooms={data.rooms}
        categories={data.categories}
      />
      {opened && (
        <SessionDetailModal sessions={opened} onClose={() => setOpened(null)} favourites={favourites} />
      )}
    </div>
  );
};

export default ScheduleView;
