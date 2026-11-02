import { cn } from "@/lib/utils";
import { ChevronDown, Heart, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import SessionDetailModal from "../V2_ProgrammeShared/SessionDetailModal";
import {
  AppliedFilters,
  EmptyState,
  ProgrammeError,
  ProgrammeLoading,
} from "../V2_ProgrammeShared/ProgrammeUI";
import { dayParts, getCategory, stageLabel } from "../V2_ProgrammeShared/programmeUtils";
import { useFavourites } from "../V2_ProgrammeShared/useFavourites";
import { useProgrammeData } from "../V2_ProgrammeShared/useProgrammeData";
import TracksGrid from "./TracksGrid";
import TracksList from "./TracksList";
import TracksSettingsPanel from "./TracksSettingsPanel";

const ALL = "all";

/** Programme by stage: timeline list or stage-rows × time grid. */
const TracksView = () => {
  const data = useProgrammeData();
  const favourites = useFavourites();

  const [view, setView] = useState<"list" | "grid">("list");
  const [tab, setTab] = useState<"all" | "favourites">("all");
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const [stage, setStage] = useState(ALL);
  const [tracks, setTracks] = useState<string[]>([]);
  const [dayMenuOpen, setDayMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [opened, setOpened] = useState<Programme[] | null>(null);
  const dayMenuRef = useRef<HTMLDivElement>(null);

  const day = pickedDay ?? data.days[0];

  useEffect(() => {
    if (!dayMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!dayMenuRef.current?.contains(e.target as Node)) setDayMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [dayMenuOpen]);

  const daySessions = useMemo(
    () => data.sessions.filter((s) => s.start_date === day),
    [data.sessions, day],
  );
  const dayStages = data.stages.filter((st) => daySessions.some((s) => s.type === st));
  // Only offer tracks that exist on this day so the tile list stays short
  const dayCategories = data.categories.filter((c) =>
    daySessions.some((s) => getCategory(s).id === c.id),
  );

  const sessions = useMemo(
    () =>
      daySessions.filter(
        (s) =>
          (tab === "all" || favourites.favourites.includes(s.id)) &&
          (stage === ALL || s.type === stage) &&
          (!tracks.length || tracks.includes(getCategory(s).id)),
      ),
    [daySessions, tab, favourites.favourites, stage, tracks],
  );

  if (data.isPending) return <ProgrammeLoading />;
  if (data.error) return <ProgrammeError message={data.error.message} />;

  const isFiltered = stage !== ALL || tracks.length > 0;
  const clearAll = () => {
    setStage(ALL);
    setTracks([]);
  };
  const changeDay = (d: string) => {
    setPickedDay(d);
    setDayMenuOpen(false);
    setStage(ALL);
  };

  const categoryById = new Map(data.categories.map((c) => [c.id, c]));

  return (
    <div className="sm:px-4 pb-10 mx-auto w-full max-w-7xl">
      <div className="bg-white sm:rounded-2xl sm:shadow-sm">
        {/* Header: day picker · favourites · settings */}
        <div className="relative flex items-center justify-between gap-2 px-4 sm:px-6 h-14 border-b border-gray-100">
          <div className="flex p-0.5 rounded-full bg-gray-100">
            {(["all", "favourites"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                aria-pressed={tab === t}
                aria-label={t === "all" ? "All sessions" : "Favourites"}
                className={cn(
                  "flex items-center gap-1 h-8 px-3 rounded-full text-xs sm:text-sm transition-colors",
                  tab === t ? "bg-white shadow-sm text-gray-900 font-medium" : "text-gray-500",
                )}
              >
                {t === "all" ? (
                  "All"
                ) : (
                  <>
                    <Heart className={cn("size-3.5", tab === t && "fill-rose-500 text-rose-500")} />
                    <span className="hidden sm:inline">Favourites</span>
                    <span className="text-gray-400">{favourites.favourites.length}</span>
                  </>
                )}
              </button>
            ))}
          </div>

          <div ref={dayMenuRef} className="absolute left-1/2 -translate-x-1/2">
            <button
              type="button"
              onClick={() => setDayMenuOpen((o) => !o)}
              aria-expanded={dayMenuOpen}
              className="flex items-center gap-1 text-sm font-semibold tracking-wide text-gray-900 uppercase"
            >
              {dayParts(day).weekday}
              <span className="hidden sm:inline font-normal text-gray-500 normal-case ml-1">
                {dayParts(day).short}
              </span>
              <ChevronDown className={cn("size-4 text-primary transition-transform", dayMenuOpen && "rotate-180")} />
            </button>
            {dayMenuOpen && (
              <ul className="absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1">
                {data.days.map((d) => (
                  <li key={d}>
                    <button
                      type="button"
                      onClick={() => changeDay(d)}
                      className={cn(
                        "w-full flex justify-between px-4 py-2.5 text-sm hover:bg-gray-50",
                        d === day ? "text-primary font-medium" : "text-gray-700",
                      )}
                    >
                      {dayParts(d).weekday}
                      <span className="text-gray-400">{dayParts(d).short}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSettingsOpen((o) => !o)}
            aria-label="Programme settings"
            aria-expanded={settingsOpen}
            className="relative p-2 -mr-2 text-primary"
          >
            <SlidersHorizontal className="size-5" />
            {tracks.length > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-primary text-white text-[10px] grid place-items-center">
                {tracks.length}
              </span>
            )}
          </button>

          <TracksSettingsPanel
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            view={view}
            onViewChange={setView}
            categories={dayCategories}
            selected={tracks}
            onApply={setTracks}
          />
        </div>

        {/* Stage tabs */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar px-4 sm:px-6 border-b border-gray-100">
          {[ALL, ...dayStages].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStage(st)}
              className={cn(
                "shrink-0 py-3 text-sm border-b-2 -mb-px transition-colors",
                stage === st ? "border-primary text-primary" : "border-transparent text-gray-800",
              )}
            >
              {st === ALL ? "All stages" : stageLabel(st)}
            </button>
          ))}
        </div>

        <div className="px-4 sm:px-6 pt-4">
          <AppliedFilters
            items={tracks.map((id) => ({
              id,
              label: categoryById.get(id)?.name ?? id,
              color: categoryById.get(id)?.color,
            }))}
            onRemove={(id) => setTracks((t) => t.filter((x) => x !== id))}
            onClearAll={clearAll}
          />
        </div>

        <div className="px-4 sm:px-6 py-5">
          {sessions.length === 0 ? (
            <EmptyState favourites={tab === "favourites"} filtered={isFiltered} onClear={clearAll} />
          ) : view === "list" ? (
            <TracksList sessions={sessions} favourites={favourites} onOpen={setOpened} />
          ) : (
            <TracksGrid
              sessions={sessions}
              stages={stage === ALL ? dayStages : [stage]}
              favourites={favourites}
              onOpen={setOpened}
            />
          )}
        </div>
      </div>

      {opened && (
        <SessionDetailModal sessions={opened} onClose={() => setOpened(null)} favourites={favourites} />
      )}
    </div>
  );
};

export default TracksView;
