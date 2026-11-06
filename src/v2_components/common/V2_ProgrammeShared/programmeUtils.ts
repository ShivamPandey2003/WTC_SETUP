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

export const getCategory = (s: Programme) => {
  const [id, cat] = Object.entries(s.categories ?? {})[0] ?? [];
  return { id: id ?? "", name: cat?.name ?? "", color: cat?.color || FALLBACK_COLOR };
};

/** Normalises #rgb / #rrggbb(aa) to #rrggbb. */
export const fullHex = (hex: string) => {
  const h = hex.replace("#", "");
  return `#${h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6)}`;
};

/** Hex colour with alpha, for soft card backgrounds. */
export const tint = (hex: string, alpha = "1F") => `${fullHex(hex)}${alpha}`;

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

export const sortByTime = (a: Programme, b: Programme) =>
  a.start_time.localeCompare(b.start_time) || a.end_time.localeCompare(b.end_time);
