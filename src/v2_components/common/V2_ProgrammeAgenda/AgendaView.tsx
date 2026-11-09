import { Button } from "@/components/ui/Button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  CalendarArrowDown,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart, Loader2, MousePointerClick, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { buildAgenda, downloadAgenda } from "../V2_ProgrammeShared/agenda";
import {
  EmptyState,
  ProgrammeError,
  ProgrammeLoading,
  Segmented,
  Sheet,
} from "../V2_ProgrammeShared/ProgrammeUI";
import { dayParts, toMinutes } from "../V2_ProgrammeShared/programmeUtils";
import type { Favourites } from "../V2_ProgrammeShared/useFavourites";
import { useToggleAgenda } from "@/api/global_api/programme_agenda_api";
import { useFillViewport } from "../V2_ProgrammeShared/useFillViewport";
import { useNow } from "../V2_ProgrammeShared/useNow";
import { useQueryParams } from "../V2_ProgrammeShared/useQueryParams";
import AgendaDetail from "./AgendaDetail";
import AgendaFilterPanel from "./AgendaFilterPanel";
import AgendaList from "./AgendaList";
import LoginPromptModal from "./LoginPromptModal";
import { AgendaDetailSkeleton, AgendaFilterSkeleton, AgendaListSkeleton } from "./AgendaSkeleton";
import { activeCount, applyFilters, scrollWithin, slotId, type AgendaFilters } from "./agendaFilters";
import { useAgendaData } from "./useAgendaData";

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-grid place-items-center min-w-5 h-5 px-1 rounded border border-gray-300 bg-white text-[11px] font-medium text-gray-600">
    {children}
  </kbd>
);

const longDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

/** Day dropdown with prev / next arrows. */
const DayPicker = ({
  days,
  day,
  today,
  favsOn,
  onChange,
}: {
  days: string[];
  day: string;
  today: string;
  favsOn: (d: string) => number;
  onChange: (d: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const idx = days.indexOf(day);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const arrow = "size-9 shrink-0 grid place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none";

  return (
    <div ref={ref} className="relative flex items-center gap-1.5 w-full sm:w-auto">
      <button type="button" className={arrow} disabled={idx <= 0} onClick={() => onChange(days[idx - 1])} aria-label="Previous day">
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex-1 sm:flex-none sm:min-w-52 h-9 px-3 rounded-lg border border-gray-200 bg-white flex items-center gap-2 text-sm hover:border-primary/50"
      >
        <CalendarDays className="size-4 text-primary" />
        <span className="font-semibold text-gray-800">{longDate(day)}</span>
        {day === today && (
          <span className="px-1.5 rounded bg-primary text-white text-[10px] font-bold">TODAY</span>
        )}
        <span className="ml-auto text-xs text-gray-400">
          Day {idx + 1}/{days.length}
        </span>
        <ChevronDown className={cn("size-4 text-gray-400 transition-transform", open && "rotate-180")} />
      </button>
      <button type="button" className={arrow} disabled={idx >= days.length - 1} onClick={() => onChange(days[idx + 1])} aria-label="Next day">
        <ChevronRight className="size-4" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 top-full mt-1.5 left-10.5 right-10.5 sm:right-auto sm:min-w-52 bg-white rounded-lg shadow-lg border border-gray-100 p-1 flex flex-col gap-0.5"
        >
          {days.map((d, i) => {
            const active = d === day;
            const favs = favsOn(d);
            return (
              <li key={d}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(d);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-left",
                    active ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <span className={cn("w-10 text-xs", active ? "text-white/75" : "text-gray-400")}>Day {i + 1}</span>
                  <span className="font-medium">{longDate(d)}</span>
                  {d === today && (
                    <span className={cn("px-1 rounded text-[10px] font-bold", active ? "bg-white text-primary" : "bg-primary text-white")}>
                      TODAY
                    </span>
                  )}
                  {favs > 0 && (
                    <span className={cn("ml-auto inline-flex items-center gap-0.5 text-xs", active ? "text-white" : "text-rose-500")}>
                      <Heart className="size-3 fill-current" />
                      {favs}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

/**
 * Agenda: filters rail · timeline · detail panel on desktop;
 * date strip, compact timeline and bottom sheets on mobile.
 */
const AgendaView = () => {
  const { today, minutes: nowMin } = useNow();
  const q = useQueryParams();
  const noRail = useIsMobile(1060); // matches the `md` breakpoint
  const detailAsSheet = useIsMobile(1200); // matches the `lg` breakpoint
  const fill = useFillViewport<HTMLDivElement>(noRail ? 0 : 16);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // "My agenda" needs a login: the API answers 401 without a token, and apiRequest treats
  // any 401 as an expired session (clears storage, reloads the app). So never request it
  // while logged out; ask the user to log in instead.
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const wantsMine = q.get("tab") === "mine";
  const changeTab = (t: "all" | "mine") => {
    if (t === "mine" && !isLoggedIn) {
      setLoginOpen(true);
      return;
    }
    q.set({ tab: t === "all" ? null : t });
  };
  // A shared ?tab=mine link opened while logged out
  useEffect(() => {
    if (!wantsMine || isLoggedIn) return;
    setLoginOpen(true);
    q.set({ tab: null });
  }, [wantsMine, isLoggedIn]);

  // State in the URL: ?day=&tab=mine&q=&track=&stage=&room=&session=
  const tab = wantsMine && isLoggedIn ? "mine" : "all";
  const search = q.get("q") ?? "";
  const filters: AgendaFilters = {
    tracks: q.getList("track"),
    stages: q.getList("stage"),
    rooms: q.getList("room"),
  };
  const selectedId = q.get("session");

  // Sessions come one day at a time from program/hybrid-calendar-by-date; search runs
  // server-side on a debounced copy of `search`
  const data = useAgendaData({
    dayParam: q.get("day"),
    today,
    search,
    tab,
    isLoggedIn,
  });

  // Agenda membership comes from the server (`is_in_agenda`); a heart click toggles it
  // via program/agenda/toggle and refetches the day. Logged out: ask to log in.
  const toggleAgenda = useToggleAgenda();
  const inAgenda = new Set([
    ...data.saved.map((s) => s.id),
    ...data.matched.filter((s) => s.is_in_agenda).map((s) => s.id),
  ]);
  const favourites: Favourites = {
    favourites: data.saved.map((s) => s.id),
    isFavourite: (id) => inAgenda.has(id),
    toggleFavourite: (id) => {
      if (!isLoggedIn) {
        // The session bottom sheet sits above the modal, so close it first
        if (detailAsSheet && selectedId) q.set({ session: null });
        setLoginOpen(true);
        return;
      }
      toggleAgenda.mutate(id);
    },
  };

  const day = data.day ?? "";
  const daySessions = data.daySessions;
  // The server already narrows "My agenda" (view_type: my-agenda)
  const base = data.matched;
  const visible = applyFilters(base, filters);
  const selected = selectedId
    ? (daySessions.find((s) => s.id === selectedId) ?? data.saved.find((s) => s.id === selectedId))
    : undefined;

  const select = (s: Programme) => q.set({ session: s.id, day: s.start_date });
  const changeDay = (d: string) => q.set({ day: d, session: null });
  const setFilters = (f: AgendaFilters) => q.set({ track: f.tracks, stage: f.stages, room: f.rooms });
  const clearFilters = () => q.set({ track: null, stage: null, room: null });

  // Keyboard: / search · ←/→ day · j/k next/prev session · Esc close details
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const next = data.days[data.days.indexOf(day) + (e.key === "ArrowRight" ? 1 : -1)];
        if (next) changeDay(next);
      } else if ((e.key === "j" || e.key === "k") && visible.length) {
        const i = visible.findIndex((s) => s.id === selectedId);
        const step = e.key === "j" ? 1 : -1;
        select(visible[(i + step + visible.length) % visible.length] ?? visible[0]);
      } else if (e.key === "Escape" && selectedId) {
        q.set({ session: null });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  // Keep the selected row in view (keyboard navigation, shared links)
  useEffect(() => {
    if (!selectedId) return;
    const list = listRef.current;
    scrollWithin(list, list?.querySelector(`[data-session-id="${selectedId}"]`));
    // isPending / height: a shared link selects a session before the list has rendered and been sized
  }, [selectedId, day, data.isListLoading, fill.style?.height]);

  if (data.isPending) return <ProgrammeLoading />;
  if (data.error) return <ProgrammeError message={data.error.message} />;
  if (!data.days.length) return <ProgrammeError message="The programme hasn't been published yet." />;

  const agenda = buildAgenda(data.saved, favourites.favourites);
  const filterCount = activeCount(filters);
  const nowSlot =
    day === today && !data.isListLoading
      ? [...new Set(visible.map((s) => s.start_time))]
          .filter((t) => toMinutes(t) <= nowMin)
          .pop()
      : undefined;

  const filterPanel = data.isDayLoading ? (
    <AgendaFilterSkeleton />
  ) : (
    <AgendaFilterPanel
      sessions={base}
      filters={filters}
      onChange={setFilters}
      categories={data.categories}
      stages={data.stages}
      rooms={data.rooms}
    />
  );

  const saved = agenda.sessions.length;
  const exportButton = tab === "mine" && (
    <button
      type="button"
      onClick={() => downloadAgenda(agenda.sessions)}
      disabled={saved === 0}
      aria-label={`Export my agenda to calendar (${saved} sessions)`}
      title={saved === 0 ? "Save sessions with ♥ to export them" : `Export ${saved} saved session${saved > 1 ? "s" : ""} to calendar`}
      className="relative shrink-0 h-9 w-10 grid place-items-center rounded-md border border-primary/40 text-primary bg-white hover:bg-primary/10 disabled:opacity-40 disabled:pointer-events-none"
    >
      <CalendarArrowDown className="size-4.5" />
    </button>
  );

  const tabSwitch = (
    <Segmented
      value={tab}
      onChange={changeTab}
      className="p-0.5"
      options={[
        { value: "all", label: "All" },
        {
          value: "mine",
          label: (
            <>
              <Heart className={cn("size-3.5", tab === "mine" && "fill-white")} /> My agenda
              <span className="tabular-nums opacity-80">{favourites.favourites.length}</span>
            </>
          ),
        },
      ]}
    />
  );

  const searchBox = (
    <label className="flex items-center gap-2 h-9 px-3 bg-white border border-gray-300 rounded-lg focus-within:border-primary">
      {data.isSearching ? (
        <Loader2 size={16} className="text-primary shrink-0 animate-spin" aria-label="Searching" />
      ) : (
        <Search size={16} className="text-gray-400 shrink-0" />
      )}
      <input
        ref={searchRef}
        value={search}
        onChange={(e) => q.set({ q: e.target.value })}
        onKeyDown={(e) => {
          if (e.key !== "Escape") return;
          e.currentTarget.blur();
          q.set({ q: null });
        }}
        placeholder={tab === "mine" ? "Search in my agenda" : "Search all sessions, speakers, rooms"}
        className="flex-1 min-w-0 outline-none text-sm bg-transparent"
      />
      {search ? (
        <button type="button" aria-label="Clear search" onClick={() => q.set({ q: null })}>
          <X size={16} className="text-gray-400 hover:text-gray-600" />
        </button>
      ) : (
        !noRail && <Kbd>/</Kbd>
      )}
    </label>
  );

  return (
    <div className="sm:px-4 sm:pb-4 mx-auto w-full">
      <div
        ref={fill.ref}
        style={fill.style}
        className="bg-white sm:rounded-xl shadow-sm overflow-hidden flex flex-col"
      >
        {/* Top bar: date strip · search · All / My agenda */}
        <div className="shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-3 px-3 sm:px-4 py-2.5">
            <div className="flex-1 min-w-0">
              <DayPicker
                days={data.days}
                day={day}
                today={today}
                favsOn={(d) => agenda.sessions.filter((s) => s.start_date === d).length}
                onChange={changeDay}
              />
            </div>
            {!noRail && (
              <>
                <div className="w-64 xl:w-80">{searchBox}</div>
                {tabSwitch}
                {exportButton}
              </>
            )}
          </div>

          {noRail && (
            <div className="flex flex-col gap-2 px-3 pb-2.5">
              <div className="flex gap-2">
                <div className="flex-1 min-w-0">{searchBox}</div>
                <Button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  aria-label="Filters"
                  className="relative h-9 px-3"
                >
                  <SlidersHorizontal />
                  {filterCount > 0 && (
                    <span className="min-w-5 h-5 px-1 rounded-full bg-white text-primary text-[11px] font-semibold grid place-items-center">
                      {filterCount}
                    </span>
                  )}
                </Button>
                {exportButton}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 flex">
          {!noRail && (
            <aside className="w-64 xl:w-72 shrink-0 border-r border-gray-100 overflow-y-auto p-3" aria-label="Filters">
              <div className="flex items-center justify-between px-2 pb-3">
                <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
                {filterCount > 0 && (
                  <button type="button" onClick={clearFilters} className="text-xs font-medium text-primary hover:underline">
                    Clear {filterCount}
                  </button>
                )}
              </div>
              {filterPanel}
            </aside>
          )}

          <main ref={listRef} className="relative flex-1 min-w-0 overflow-y-auto" aria-label="Sessions">
            <div className="flex items-center gap-2 px-4 sm:px-5 pt-3 pb-1 text-xs text-gray-500">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold",
                  tab === "mine" ? "bg-rose-50 text-rose-600" : "bg-primary/10 text-primary",
                )}
              >
                {tab === "mine" && <Heart className="size-3 fill-current" />}
                {tab === "mine" ? "My agenda" : "All sessions"}
              </span>
              {!data.isListLoading && (filterCount > 0 || search.trim() !== "") && (
                <span>
                  <span className="font-semibold text-gray-900">{visible.length}</span>
                  {tab === "mine" ? ` saved session${visible.length === 1 ? "" : "s"}` : ` of ${daySessions.length} sessions`}
                  {" · "}
                  {dayParts(day).weekday}
                </span>
              )}
              {nowSlot && (
                <button
                  type="button"
                  onClick={() =>
                    scrollWithin(listRef.current, listRef.current?.querySelector(`#${slotId(nowSlot)}`), "start")
                  }
                  className="ml-auto inline-flex items-center gap-1 px-2 h-7 rounded-md bg-rose-50 text-rose-600 font-semibold hover:bg-rose-100"
                >
                  <CalendarClock className="size-3.5" /> Jump to now
                </button>
              )}
            </div>
            {data.isListLoading ? (
              <AgendaListSkeleton />
            ) : visible.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  favourites={tab === "mine"}
                  filtered={filterCount > 0 || search.trim() !== ""}
                  onClear={() => q.set({ track: null, stage: null, room: null, q: null })}
                />
              </div>
            ) : (
              <AgendaList
                sessions={visible}
                selectedId={selectedId}
                favourites={favourites}
                clashes={agenda.clashesWith}
                query={search}
                onSelect={select}
              />
            )}
          </main>

          {!detailAsSheet && (
            <aside className="w-[400px] xl:w-[440px] shrink-0 border-l border-gray-100 overflow-y-auto" aria-label="Session details">
              {selected ? (
                <AgendaDetail
                  key={selected.id}
                  session={selected}
                  daySessions={selected.start_date === day ? daySessions : [selected]}
                  favourites={favourites}
                  clashes={agenda.clashesWith}
                  onSelect={select}
                  onClose={() => q.set({ session: null })}
                />
              ) : selectedId && data.isDayLoading ? (
                <AgendaDetailSkeleton />
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-3 px-10 text-center text-gray-500">
                  <span className="size-14 rounded-2xl bg-primary/10 text-primary grid place-items-center">
                    <MousePointerClick className="size-7" />
                  </span>
                  <p className="text-sm font-semibold text-gray-800">Pick a session to see the details</p>
                  <p className="text-xs leading-relaxed">
                    Speakers, room, what else runs at the same time and what's next in the room.
                  </p>
                  <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs text-left">
                    <span className="flex gap-1"><Kbd>J</Kbd><Kbd>K</Kbd></span><span>Next / previous session</span>
                    <span className="flex gap-1"><Kbd>←</Kbd><Kbd>→</Kbd></span><span>Change day</span>
                    <span className="flex gap-1"><Kbd>/</Kbd></span><span>Search</span>
                  </div>
                </div>
              )}
            </aside>
          )}
        </div>
      </div>

      <LoginPromptModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      {/* Mobile: floating All / My agenda switch */}
      {noRail && (
        <div
          role="tablist"
          aria-label="Show"
          className="fixed right-2 top-1/2 -translate-y-1/2 z-800 flex flex-col gap-1 rounded-xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.18)] p-1"
        >
          {(["all", "mine"] as const).map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={t === "all" ? "All sessions" : `My agenda (${favourites.favourites.length})`}
                onClick={() => changeTab(t)}
                className={cn(
                  "w-11 h-11 rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-colors",
                  active ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100",
                )}
              >
                {t === "all" ? (
                  "All"
                ) : (
                  <>
                    <Heart className={cn("size-4", active ? "fill-white" : "text-rose-500")} />
                    <span className="tabular-nums leading-none mt-0.5">{favourites.favourites.length}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}

      {noRail && (
        <Sheet
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          title="Filters"
          bodyClassName="px-3"
          footer={
            <>
              <Button
                type="button"
                size="lg"
                onClick={clearFilters}
                className="flex-1 bg-gray-100 text-black hover:bg-gray-200"
              >
                Clear
              </Button>
              <Button type="button" size="lg" onClick={() => setFiltersOpen(false)} className="flex-[2]">
                {data.isListLoading ? "Loading sessions…" : `Show ${visible.length} sessions`}
              </Button>
            </>
          }
        >
          {filterPanel}
        </Sheet>
      )}

      {detailAsSheet && (
        <Sheet
          open={Boolean(selected) || Boolean(selectedId && data.isDayLoading)}
          onClose={() => q.set({ session: null })}
          title="Session"
          bodyClassName="p-0"
        >
          {!selected && data.isDayLoading && <AgendaDetailSkeleton />}
          {selected && (
            <AgendaDetail
              key={selected.id}
              session={selected}
              daySessions={selected.start_date === day ? daySessions : [selected]}
              favourites={favourites}
              clashes={agenda.clashesWith}
              onSelect={select}
            />
          )}
        </Sheet>
      )}
    </div>
  );
};

export default AgendaView;
