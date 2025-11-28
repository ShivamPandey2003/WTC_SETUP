import { nanoid } from "nanoid";

export const getDateRange = (start: string, end: string): string[] => {
  const parse = (dateStr: string): Date => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d); // safe local date
  };

  const format = (date: Date): string => {
    return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
  };

  const startDate = parse(start);
  const endDate = parse(end);

  const result: string[] = [];

  let current = new Date(startDate);

  while (current <= endDate) {
    result.push(format(current));
    current.setDate(current.getDate() + 1);
  }

  return result;
};

export interface Session {
  session_id:string;
  id: string;
  title: string;
  color: string;
  start_time: string;
  end_time: string;
  type: "normal";
}

export interface NormalItem {
  session_id: string;
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  type: "normal";
}

export interface GroupItem {
  id: string;
  type: "array";
  start: string;
  end: string;
  Item: {
    session_id: string;
    id: string;
    title: string;
    start: string;
    end: string;
    color: string;
  }[];
}

export type OutputItem = NormalItem | GroupItem;

export const transformSessions = (sessions: Session[]): OutputItem[] => {
  const groups: Record<string, Session[]> = {};

  sessions.forEach((session) => {
    const key = `${session.start_time}-${session.end_time}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(session);
  });

  const result: OutputItem[] = [];

  Object.values(groups).forEach((group) => {
    if (group.length === 1) {
      // Unique timing → normal object
      const s = group[0];

      result.push({
        session_id: s.session_id,
        id: s.id,
        title: s.title,
        start: s.start_time,
        end: s.end_time,
        color: s.color,
        type: "normal",
      });
    } else {
      result.push({
        id: nanoid(),
        type: "array",
        start: group[0].start_time,
        end: group[0].end_time,
        Item: group.map((s) => ({
          session_id: s.session_id,
          id: s.id,
          title: s.title,
          start: s.start_time,
          end: s.end_time,
          color: s.color,
        })),
      });
    }
  });

  return result;
};

const timeToMinutes = (t: string): number => {
  const [h, m, s] = t.split(":").map(Number);
  return h * 60 + m + (s ? s / 60 : 0);
};

const minutesToTime = (min: number): string => {
  const h = Math.floor(min / 60)
    .toString()
    .padStart(2, "0");
  const m = Math.floor(min % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:00`;
};

export const getEarliestAndLatest = (sessions: any[]) => {
  const earliestMin = Math.min(
    ...sessions.map((s) => timeToMinutes(s.start_time))
  );
  const latestMin = Math.max(...sessions.map((s) => timeToMinutes(s.end_time)));

  return {
    earliest: minutesToTime(earliestMin),
    latest: minutesToTime(latestMin),
  };
};

export const getDayMonthRange = (start: string, end: string): string[] => {
  const parse = (d: string): Date => {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day);
  };

  const format = (date: Date): string => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const startDate = parse(start);
  const endDate = parse(end);

  const result: string[] = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    result.push(format(current));
    current.setDate(current.getDate() + 1);
  }

  return result;
};

export function generateTimeArray(
  start: string = "09:00",
  end: string = "18:00"
): string[] {
  const slots: string[] = [];

  let [h, m] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  while (h < endH || (h === endH && m <= endM)) {
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);

    m += 30;
    if (m >= 60) {
      m = 0;
      h++;
    }
  }

  return slots;
}
