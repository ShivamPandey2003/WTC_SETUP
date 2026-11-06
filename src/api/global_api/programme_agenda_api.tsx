import { apiRequest } from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";

/**
 * apiRequest swallows errors (it toasts and resolves undefined), so check the
 * envelope here and throw, letting TanStack Query surface the error.
 */
const unwrap = <T extends { header: ResponseHeader }>(res: unknown, fallback: string): T => {
  const body = (res as { response?: T } | undefined)?.response;
  if (!body || body.header?.code !== 200) {
    throw new Error(body?.header?.message || fallback);
  }
  return body;
};

const withSearch = (path: string, search?: string) =>
  search ? `${path}?${new URLSearchParams({ search })}` : path;

/** Conference days, e.g. ["2026-05-14", ...]. */
export const useGetProgrammeDates = () =>
  useQuery({
    queryKey: ["programme-dates"],
    queryFn: async () => {
      const res = await apiRequest("get", "program/dates");
      return unwrap<ProgrammeDatesResponse>(res, "Failed to load programme dates").response.dates ?? [];
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

/** Session types (streams) and every category (track). */
export const useGetProgrammeTypes = () =>
  useQuery({
    queryKey: ["programme-types"],
    queryFn: async () => {
      const res = await apiRequest("get", "program/types");
      return unwrap<ProgrammeTypesResponse>(res, "Failed to load programme filters").response;
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

/**
 * Sessions of one day, optionally narrowed server-side by `search`.
 * Pass an already debounced search so typing does not fire a request per key.
 */
export const useGetProgrammeByDate = (date: string | undefined, search = "") =>
  useQuery({
    queryKey: ["programme-by-date", date, search],
    queryFn: async () => {
      const res = await apiRequest("post", withSearch("program/hybrid-calendar-by-date", search), { date });
      return unwrap<ProgrammeByDateResponse>(res, "Failed to load sessions").response ?? [];
    },
    enabled: Boolean(date),
    // Keep the previous results on screen while a new search for the same day loads,
    // but never show another day's sessions under this day's header
    placeholderData: (prev, prevQuery) => (prevQuery?.queryKey[1] === date ? prev : undefined),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
