import { getRoom, toMinutes } from "./programmeUtils";

// The conference runs in Montréal; exported events carry this zone so they land
// at the right time in attendees' calendars wherever they are.
export const EVENT_TZ = "America/Toronto";

/** Zone name for the event on a given day: "EDT" (short) or "Eastern Daylight Time" (long). */
export const eventTzAbbr = (date: string, style: "short" | "long" = "short") =>
  new Intl.DateTimeFormat("en-US", { timeZone: EVENT_TZ, timeZoneName: style })
    .formatToParts(new Date(`${date}T12:00:00Z`))
    .find((p) => p.type === "timeZoneName")?.value ?? "ET";

const overlaps = (a: Programme, b: Programme) =>
  a.start_date === b.start_date &&
  toMinutes(a.start_time) < toMinutes(b.end_time) &&
  toMinutes(b.start_time) < toMinutes(a.end_time);

/** Favourite sessions, their total time and which of them clash with another favourite. */
export const buildAgenda = (sessions: Programme[], favouriteIds: string[]) => {
  const picked = sessions.filter((s) => favouriteIds.includes(s.id));
  const clashesWith = new Map<string, Programme[]>();
  picked.forEach((a) => {
    const others = picked.filter((b) => b.id !== a.id && overlaps(a, b));
    if (others.length) clashesWith.set(a.id, others);
  });

  return {
    sessions: picked,
    clashesWith,
    clashCount: clashesWith.size,
    minutes: picked.reduce((sum, s) => sum + toMinutes(s.end_time) - toMinutes(s.start_time), 0),
    days: new Set(picked.map((s) => s.start_date)).size,
  };
};

export type Agenda = ReturnType<typeof buildAgenda>;

export const formatDuration = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h${m ? ` ${m}m` : ""}` : `${m}m`;
};

const escapeText = (text: string) =>
  text.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

// RFC 5545: lines longer than 75 octets are folded with CRLF + space
const encoder = new TextEncoder();
const fold = (line: string) => {
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    if (bytes + size > 75) {
      out.push(current);
      current = ` ${ch}`;
      bytes = 1 + size;
    } else {
      current += ch;
      bytes += size;
    }
  }
  out.push(current);
  return out.join("\r\n");
};

const localStamp = (date: string, time: string) =>
  `${date.replace(/-/g, "")}T${time.replace(":", "").slice(0, 4)}00`;

export const buildAgendaICS = (sessions: Programme[]) => {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const events = sessions.flatMap((s) => [
    "BEGIN:VEVENT",
    `UID:${s.id}@wtc2026`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=${EVENT_TZ}:${localStamp(s.start_date, s.start_time)}`,
    `DTEND;TZID=${EVENT_TZ}:${localStamp(s.end_date, s.end_time)}`,
    `SUMMARY:${escapeText(s.title)}`,
    `LOCATION:${escapeText([getRoom(s), s.location].filter(Boolean).join(" · "))}`,
    `DESCRIPTION:${escapeText(
      [
        s.speakers.length ? `Speakers: ${s.speakers.map((sp) => sp.fullname).join(", ")}` : "",
        s.description,
      ]
        .filter(Boolean)
        .join("\n\n"),
    )}`,
    "END:VEVENT",
  ]);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WTC 2026//Programme//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VTIMEZONE",
    `TZID:${EVENT_TZ}`,
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:-0500",
    "TZOFFSETTO:-0400",
    "TZNAME:EDT",
    "DTSTART:19700308T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:-0400",
    "TZOFFSETTO:-0500",
    "TZNAME:EST",
    "DTSTART:19701101T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
    ...events,
    "END:VCALENDAR",
  ]
    .map(fold)
    .join("\r\n");
};

export const downloadAgenda = (sessions: Programme[]) => {
  const blob = new Blob([buildAgendaICS(sessions)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "WTC2026-my-agenda.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
