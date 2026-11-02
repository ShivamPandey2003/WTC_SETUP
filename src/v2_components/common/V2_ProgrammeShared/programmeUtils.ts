import { normalizeLabel } from "@/lib/utils";

export const UNASSIGNED_ROOM = "Venue TBA";
const FALLBACK_COLOR = "#9CA3AF";

export const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const formatClock = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 && h < 24 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
};

export const formatMinutes = (mins: number) =>
  formatClock(`${Math.floor(mins / 60)}:${mins % 60}`);

export const getCategory = (s: Programme) => {
  const [id, cat] = Object.entries(s.categories ?? {})[0] ?? [];
  return { id: id ?? "", name: cat?.name ?? "", color: cat?.color || FALLBACK_COLOR };
};

/** Hex colour with alpha, for soft card backgrounds. Accepts #rgb and #rrggbb. */
export const tint = (hex: string, alpha = "1F") => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
  return `#${full}${alpha}`;
};

// venue can be null in the API response even though the type says otherwise
export const getRoom = (s: Programme) => s.venue?.name?.trim() || UNASSIGNED_ROOM;

export const stageLabel = (type: string) => (type ? normalizeLabel(type) : "Other");

export const isHappeningNow = (s: Programme, now = new Date()) => {
  const start = new Date(`${s.start_date}T${s.start_time}:00`);
  const end = new Date(`${s.end_date}T${s.end_time}:00`);
  return now >= start && now < end;
};

export const dayParts = (date: string) => {
  const d = new Date(`${date}T00:00:00`);
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
    short: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
};

export const matchesSearch = (s: Programme, query: string) => {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    s.title.toLowerCase().includes(q) ||
    getRoom(s).toLowerCase().includes(q) ||
    getCategory(s).name.toLowerCase().includes(q) ||
    s.speakers.some((sp) => sp.fullname.toLowerCase().includes(q))
  );
};

export const sortByTime = (a: Programme, b: Programme) =>
  a.start_time.localeCompare(b.start_time) || a.end_time.localeCompare(b.end_time);

/**
 * A block is one card on a timeline. Sessions that share the exact same slot in the
 * same row/column (e.g. 20+ e-posters at 18:00-18:15) collapse into one block so the
 * grid stays readable; the card then opens a list of those sessions.
 */
export type SessionBlock = {
  key: string;
  start: number;
  end: number;
  lane: number;
  sessions: Programme[];
};

export const layoutBlocks = (sessions: Programme[]) => {
  const bySlot = new Map<string, Programme[]>();
  sessions.forEach((s) => {
    const key = `${s.start_time}-${s.end_time}`;
    bySlot.set(key, [...(bySlot.get(key) ?? []), s]);
  });

  const blocks: SessionBlock[] = [...bySlot.entries()]
    .map(([key, items]) => ({
      key,
      start: toMinutes(items[0].start_time),
      end: Math.max(toMinutes(items[0].end_time), toMinutes(items[0].start_time) + 5),
      lane: 0,
      sessions: items,
    }))
    .sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));

  // Greedy lane assignment for blocks that still overlap
  const laneEnds: number[] = [];
  blocks.forEach((b) => {
    const lane = laneEnds.findIndex((end) => end <= b.start);
    b.lane = lane === -1 ? laneEnds.length : lane;
    laneEnds[b.lane] = b.end;
  });

  return { blocks, lanes: Math.max(laneEnds.length, 1) };
};

export const getTimeBounds = (sessions: Programme[]) => {
  const start = Math.min(...sessions.map((s) => toMinutes(s.start_time)));
  const end = Math.max(...sessions.map((s) => toMinutes(s.end_time)));
  return { start: Math.floor(start / 60) * 60, end: Math.min(Math.ceil(end / 60) * 60, 24 * 60) };
};
