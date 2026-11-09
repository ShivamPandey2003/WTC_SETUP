import {
  useGetProgrammeByDate,
  useGetProgrammeDates,
  useGetProgrammeTypes,
} from "@/api/global_api/programme_agenda_api";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { getRoom, sortByTime } from "../V2_ProgrammeShared/programmeUtils";

const SEARCH_DEBOUNCE_MS = 300;
const SAVED_KEY = "wtc_programme_saved_sessions";

/**
 * Maps a `program/hybrid-calendar-by-date` row onto the `Programme` shape the agenda
 * components already use. The first line of `location` is the room, the rest the address.
 */
const toProgramme = (s: ProgrammeByDateSession): Programme => {
  const [room = "", ...address] = (s.location ?? "").split(/\r?\n/).map((l) => l.trim());
  return {
    id: s.id,
    type: s.type,
    title: s.title,
    location: address.filter(Boolean).join(", "),
    start_date: s.date,
    end_date: s.date,
    start_time: s.start_time,
    end_time: s.end_time,
    speakers: (s.speakers ?? []).map((sp) => ({
      ...sp,
      bio: "",
      external_link: "",
      keyNote: false,
    })),
    categories: s.categories ?? {},
    external_link: "",
    description: s.description ?? "",
    bg_image: s.bg_image ?? "",
    attachments: s.attachments ?? [],
    venue: { name: room } as Programme["venue"],
    space_type: s.space_type ?? "",
    is_in_agenda: Boolean(s.is_in_agenda),
  };
};

const readSaved = (): Record<string, Programme> => {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) ?? "{}") ?? {};
  } catch {
    return {};
  }
};

/**
 * The API serves one day at a time, but "My agenda" (export, clashes, per-day counts)
 * spans every day. `is_in_agenda` on the loaded day is the source of truth; keep a
 * snapshot of agenda sessions from other days, refreshed whenever their day is loaded.
 * Nothing is kept while logged out.
 */
function useSavedSessions(loaded: Programme[], day: string | undefined, isLoggedIn: boolean) {
  const [stored, setStored] = useState(readSaved);
  const fromOtherDays = Object.values(stored).filter((s) => s.start_date !== day);
  const saved = isLoggedIn ? [...fromOtherDays, ...loaded.filter((s) => s.is_in_agenda)] : [];

  const json = JSON.stringify(Object.fromEntries(saved.map((s) => [s.id, s])));
  useEffect(() => {
    if (json === JSON.stringify(stored)) return;
    try {
      localStorage.setItem(SAVED_KEY, json);
    } catch {
      // storage unavailable: other days' agenda sessions stay in memory for this visit
    }
    setStored(JSON.parse(json));
  }, [json, stored]);

  return saved;
}

/** Data for the agenda view: day list, filter options and the selected day's sessions. */
export function useAgendaData({
  dayParam,
  today,
  search,
  tab,
  isLoggedIn,
}: {
  dayParam: string | null;
  today: string;
  search: string;
  tab: "all" | "mine";
  isLoggedIn: boolean;
}) {
  const dates = useGetProgrammeDates();
  const types = useGetProgrammeTypes();

  const days = [...(dates.data ?? [])].sort();
  const day =
    dayParam && days.includes(dayParam) ? dayParam : days.includes(today) ? today : days[0];

  const query = useDebounce(search.trim(), SEARCH_DEBOUNCE_MS);
  const viewType = tab === "mine" ? "my-agenda" : "all-programme";
  // Whole day (detail panel, counts, rooms) and the list for the current tab + search;
  // on "All" with no search they share one query key, so it is a single request
  const dayAll = useGetProgrammeByDate(day);
  const results = useGetProgrammeByDate(day, query, viewType);
  const usesResults = Boolean(query) || viewType === "my-agenda";

  const daySessions = (dayAll.data ?? []).map(toProgramme).sort(sortByTime);
  const matched = usesResults ? (results.data ?? []).map(toProgramme).sort(sortByTime) : daySessions;
  const saved = useSavedSessions(daySessions, day, isLoggedIn);

  const roomCount = new Map<string, number>();
  daySessions.forEach((s) => roomCount.set(getRoom(s), (roomCount.get(getRoom(s)) ?? 0) + 1));

  /** A debounced search is pending or its request is in flight. */
  const isSearching = search.trim() !== query || (Boolean(query) && results.isFetching);
  const isListPending = Boolean(day) && (dayAll.isPending || (usesResults && results.isPending));

  return {
    /** Day list still loading: nothing can render yet. */
    isPending: dates.isPending,
    error: dates.error ?? dayAll.error ?? results.error,
    /** The selected day's sessions are loading (first load or day change). */
    isDayLoading: Boolean(day) && dayAll.isPending,
    isSearching,
    /** Session list is not final yet: day/tab loading or a search in progress. */
    isListLoading: isListPending || isSearching,
    days,
    day,
    daySessions,
    matched,
    saved,
    // Busiest rooms first
    rooms: [...roomCount.entries()].sort((a, b) => b[1] - a[1]).map(([r]) => r),
    stages: [...(types.data?.types ?? [])].sort((a, b) => {
      if (a === "e-poster") return 1;
      if (b === "e-poster") return -1;
      return a.localeCompare(b);
    }),
    categories: (types.data?.categories ?? [])
      .map(({ id, name, color }) => ({ id, name, color }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}
