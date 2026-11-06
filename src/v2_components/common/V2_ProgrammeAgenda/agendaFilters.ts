import { getCategory, getRoom } from "../V2_ProgrammeShared/programmeUtils";

export type AgendaFilters = { tracks: string[]; stages: string[]; rooms: string[] };
export type Facet = keyof AgendaFilters;

export const EMPTY_AGENDA_FILTERS: AgendaFilters = { tracks: [], stages: [], rooms: [] };

const valueOf: Record<Facet, (s: Programme) => string> = {
  tracks: (s) => getCategory(s).id,
  stages: (s) => s.type,
  rooms: (s) => getRoom(s),
};

/** Applies every facet except `skip` (used for faceted counts). */
export const applyFilters = (sessions: Programme[], f: AgendaFilters, skip?: Facet) =>
  sessions.filter((s) =>
    (Object.keys(valueOf) as Facet[]).every(
      (facet) => facet === skip || !f[facet].length || f[facet].includes(valueOf[facet](s)),
    ),
  );

/**
 * How many sessions each option would show given the *other* active facets,
 * so options never promise results that aren't there.
 */
export const facetCounts = (sessions: Programme[], f: AgendaFilters, facet: Facet) => {
  const counts = new Map<string, number>();
  applyFilters(sessions, f, facet).forEach((s) => {
    const v = valueOf[facet](s);
    counts.set(v, (counts.get(v) ?? 0) + 1);
  });
  return counts;
};

/**
 * Scrolls `target` into view inside `container` only. Element.scrollIntoView would
 * also scroll every ancestor (even overflow-hidden ones), shifting the whole layout.
 */
export const scrollWithin = (
  container: HTMLElement | null,
  target: Element | null | undefined,
  block: "start" | "nearest" = "nearest",
) => {
  if (!container || !target) return;
  const c = container.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  const offset = t.top - c.top + container.scrollTop;
  // Leave room for the sticky time-slot header
  const header = 44;
  let top: number | undefined;
  if (block === "start") top = offset;
  else if (t.top < c.top + header) top = offset - header;
  else if (t.bottom > c.bottom) top = offset - container.clientHeight + t.height + 12;
  if (top !== undefined) container.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
};

/** DOM id of a time-slot section, used for "Jump to now". */
export const slotId = (start: string) => `slot-${start.replace(":", "")}`;

export const activeCount = (f: AgendaFilters) => f.tracks.length + f.stages.length + f.rooms.length;
