import { apiRequest } from "@/services/apiService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

export type ProgrammeViewType = "all-programme" | "my-agenda";

/**
 * Sessions of one day, optionally narrowed server-side by `search`.
 * `view_type` picks every session ("all-programme") or the user's own ("my-agenda").
 * Pass an already debounced search so typing does not fire a request per key.
 */
export const useGetProgrammeByDate = (
  date: string | undefined,
  search = "",
  viewType: ProgrammeViewType = "all-programme",
) =>
  useQuery({
    queryKey: ["programme-by-date", date, search, viewType],
    queryFn: async () => {
      const res = await apiRequest("post", withSearch("program/hybrid-calendar-by-date", search), {
        date,
        view_type: viewType,
      });
      return unwrap<ProgrammeByDateResponse>(res, "Failed to load sessions").response ?? [];
    },
    enabled: Boolean(date),
    // Keep the previous results on screen while a new search for the same day loads,
    // but never show another day's (or the other tab's) sessions under this header
    placeholderData: (prev, prevQuery) =>
      prevQuery?.queryKey[1] === date && prevQuery?.queryKey[3] === viewType ? prev : undefined,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

/**
 * Adds a session to, or removes it from, the logged-in user's agenda.
 * The heart flips at once (optimistic `is_in_agenda`), then every by-date query is
 * refetched so both tabs show the server's state.
 */
export const useToggleAgenda = () => {
  const queryClient = useQueryClient();
  const key = ["programme-by-date"];

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await apiRequest("post", "program/agenda/toggle", { session_id: sessionId });
      return unwrap<{ header: ResponseHeader }>(res, "Couldn't update your agenda");
    },
    onMutate: async (sessionId) => {
      await queryClient.cancelQueries({ queryKey: key });
      queryClient.setQueriesData<ProgrammeByDateSession[]>({ queryKey: key }, (old) =>
        old?.map((s) => (s.id === sessionId ? { ...s, is_in_agenda: !s.is_in_agenda } : s)),
      );
    },
    onError: (error) => toast.error(error.message),
    // Refetch on failure too, which rolls back the optimistic flip
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};
