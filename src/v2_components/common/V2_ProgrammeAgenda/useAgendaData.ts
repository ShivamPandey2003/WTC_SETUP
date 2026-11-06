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
 * spans every day. Keep a snapshot of favourite sessions, refreshed whenever their day
 * is loaded, so saved sessions from other days stay available.
 */
function useSavedSessions(favouriteIds: string[], loaded: Programme[]) {
  const [stored, setStored] = useState(readSaved);
  const loadedById = new Map(loaded.map((s) => [s.id, s]));
  const saved = favouriteIds.flatMap((id) => loadedById.get(id) ?? stored[id] ?? []);

  const json = JSON.stringify(Object.fromEntries(saved.map((s) => [s.id, s])));
  useEffect(() => {
    if (json === JSON.stringify(stored)) return;
    try {
      localStorage.setItem(SAVED_KEY, json);
    } catch {
      // storage unavailable: other days' favourites stay in memory for this visit
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
  favouriteIds,
}: {
  dayParam: string | null;
  today: string;
  search: string;
  favouriteIds: string[];
}) {
  const dates = useGetProgrammeDates();
  const types = useGetProgrammeTypes();

  const days = [...(dates.data ?? [])].sort();
  const day =
    dayParam && days.includes(dayParam) ? dayParam : days.includes(today) ? today : days[0];

  const query = useDebounce(search.trim(), SEARCH_DEBOUNCE_MS);
  // Whole day (detail panel, counts, rooms) and search results; with no search they
  // share one query key, so it is a single request
  const dayAll = useGetProgrammeByDate(day);
  const results = useGetProgrammeByDate(day, query);

  const daySessions = (dayAll.data ?? []).map(toProgramme).sort(sortByTime);
  const matched = query ? (results.data ?? []).map(toProgramme).sort(sortByTime) : daySessions;
  const saved = useSavedSessions(favouriteIds, daySessions);

  const roomCount = new Map<string, number>();
  daySessions.forEach((s) => roomCount.set(getRoom(s), (roomCount.get(getRoom(s)) ?? 0) + 1));

  /** A debounced search is pending or its request is in flight. */
  const isSearching = search.trim() !== query || (Boolean(query) && results.isFetching);

  return {
    /** Day list still loading: nothing can render yet. */
    isPending: dates.isPending,
    error: dates.error ?? dayAll.error ?? results.error,
    /** The selected day's sessions are loading (first load or day change). */
    isDayLoading: Boolean(day) && dayAll.isPending,
    isSearching,
    /** Session list is not final yet: day loading or a search in progress. */
    isListLoading: (Boolean(day) && dayAll.isPending) || isSearching,
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
