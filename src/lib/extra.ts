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
  session_id: string;
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
  type: "normal" | "extra";
}

export interface MergeItem {
  session_id: string[];
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  type: "merge";
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

const toMinutes = (time: string) => {
  const [h, m, s] = time.split(":").map(Number);
  return h * 60 + m + (s ? s / 60 : 0);
};

export type OutputItem = NormalItem | GroupItem | MergeItem;

export const transformSessions = (sessions: Session[]): OutputItem[] => {
  const result: OutputItem[] = [];

  const durationType = (s: Session) => {
    const diff = toMinutes(s.end_time) - toMinutes(s.start_time);
    return diff > 210 ? "extra" : "normal";
  };

  const isIntersect = (a: Session, b: Session) => {
    const aStart = toMinutes(a.start_time);
    const aEnd = toMinutes(a.end_time);
    const bStart = toMinutes(b.start_time);
    const bEnd = toMinutes(b.end_time);
    return aStart < bEnd && bStart < aEnd;
  };

  const findClusters = (items: Session[]) => {
    const clusters: Session[][] = [];

    items.forEach((session) => {
      let added = false;

      for (const cluster of clusters) {
        if (cluster.some((s) => isIntersect(s, session))) {
          cluster.push(session);
          added = true;
          break;
        }
      }

      if (!added) {
        clusters.push([session]);
      }
    });

    return clusters;
  };

  // ---------------------------------------------------------
  // 1️⃣ FIRST: GROUP BY TIME (start + end) TO FIND ARRAY TYPE
  // ---------------------------------------------------------
  const timeGroups: Record<string, Session[]> = {};

  sessions.forEach((s) => {
    const start = s.start_time;
    const end = s.end_time;

    const key = `${start}-${end}`;
    if (!timeGroups[key]) timeGroups[key] = [];
    timeGroups[key].push(s);
  });

  const leftover: Session[] = [];

  Object.values(timeGroups).forEach((group) => {
    if (group.length > 1) {
      // ARRAY TYPE
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
    } else {
      leftover.push(group[0]); // keep for merge/normal
    }
  });

  if (leftover.length === 0) return result;

  // ---------------------------------------------------------
  // 2️⃣ SECOND: GROUP LEFTOVER BY TITLE
  // ---------------------------------------------------------
  const byTitle = leftover.reduce((acc, s) => {
    if (!acc[s.title]) acc[s.title] = [];
    acc[s.title].push(s);
    return acc;
  }, {} as Record<string, Session[]>);

  // ---------------------------------------------------------
  // 3️⃣ THIRD: PROCESS MERGE + NORMAL + EXTRA
  // ---------------------------------------------------------
  Object.values(byTitle).forEach((titleGroup) => {
    const clusters = findClusters(titleGroup);

    clusters.forEach((cluster) => {
      if (cluster.length > 1) {
        // MERGE TYPE
        const earliest = cluster.reduce((a, b) =>
          toMinutes(a.start_time) < toMinutes(b.start_time) ? a : b
        );

        const latest = cluster.reduce((a, b) =>
          toMinutes(a.end_time) > toMinutes(b.end_time) ? a : b
        );

        result.push({
          id: nanoid(),
          type: "merge",
          title: cluster[0].title,
          color: cluster[0].color,
          start: earliest.start_time,
          end: latest.end_time,
          session_id: cluster.map((s) => s.session_id),
        });
      } else {
        // NORMAL / EXTRA TYPE
        const s = cluster[0];
        result.push({
          session_id: s.session_id,
          id: s.id,
          title: s.title,
          start: s.start_time,
          end: s.end_time,
          color: s.color,
          type: durationType(s),
        });
      }
    });
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
