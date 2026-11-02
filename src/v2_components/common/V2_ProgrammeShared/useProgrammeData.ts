import { useGetProgrammeList } from "@/api/global_api/global_api";
import { useMemo } from "react";
import { getCategory, getRoom, sortByTime } from "./programmeUtils";

/** Flat programme sessions plus the lookups both programme views need. */
export function useProgrammeData() {
  const { ProgrammeList, isPending, error } = useGetProgrammeList();

  return useMemo(() => {
    const sessions = [...(ProgrammeList?.data.response?.programme ?? [])].sort(sortByTime);
    const days = [...new Set(sessions.map((s) => s.start_date))].sort();

    const roomCount = new Map<string, number>();
    const categories = new Map<string, { id: string; name: string; color: string }>();
    sessions.forEach((s) => {
      roomCount.set(getRoom(s), (roomCount.get(getRoom(s)) ?? 0) + 1);
      const c = getCategory(s);
      if (c.id) categories.set(c.id, c);
    });

    return {
      isPending,
      error,
      sessions,
      days,
      // Busiest rooms first, so the main session halls lead the grid
      rooms: [...roomCount.entries()].sort((a, b) => b[1] - a[1]).map(([r]) => r),
      stages: [...new Set(sessions.map((s) => s.type))].sort((a, b) => {
        if (a === "e-poster") return 1;
        if (b === "e-poster") return -1;
        return a.localeCompare(b);
      }),
      categories: [...categories.values()].sort((a, b) => a.name.localeCompare(b.name)),
    };
  }, [ProgrammeList, isPending, error]);
}
