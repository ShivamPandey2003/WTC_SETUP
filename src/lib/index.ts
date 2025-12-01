import { formatTime } from "./utils";

export const CATEGORY_COLORS = {
  Technical: "border-blue-400 bg-blue-50",
  Activity: "border-pink-400 bg-pink-50",
  Open: "border-yellow-400 bg-yellow-50",
  Lunch: "border-teal-400 bg-teal-50",
};

export type Placeholder = {};

export type TimelineGroup = (Programme | Placeholder)[];

export interface TimelineOutput {
  [groupIndex: number]: TimelineGroup;
}

function isSession(item: Programme | Placeholder): item is Programme {
  return "start_time" in item && "end_time" in item;
}

export const toMin = (t: string): number => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

function groupByTime(events: Programme[]): Record<number, Programme[]> {
  const groups: Record<number, Programme[]> = {};
  // console.log(events)
  if (!events || events.length === 0) return groups;

  const sorted = [...events].sort(
    (a, b) =>
      toMin(a.start_time) - toMin(b.start_time)
  );

  const uniqueHours: number[] = [];
  sorted.forEach(ev => {
    const hour = Number(ev.start_time.split(":")[0]);
    if (!uniqueHours.includes(hour)) {
      uniqueHours.push(hour);
    }
  });

  sorted.forEach(ev => {
    const hour = Number(ev.start_time.split(":")[0]);
    const groupIndex = uniqueHours.indexOf(hour);

    if (!groups[groupIndex]) groups[groupIndex] = [];
    groups[groupIndex].push(ev);
  });
  return groups;
}


function alignGroup(events: Programme[], nextEvents: (Programme | Placeholder)[]): TimelineGroup {
  const end = nextEvents.filter(isSession).reduce((max, ev) => {
    return toMin(ev.end_time) > toMin(max.end_time) ? ev : max;
  });
  const result: TimelineGroup = [];

  events.forEach((ev, index) => {
    const startMin = toMin(ev.start_time);

    if (index === nextEvents.indexOf(end) && startMin < toMin(end.end_time)) {
      result.push({});
    }

    result.push(ev);
  });

  return result;
}

export function buildTimeline(events: Programme[]): TimelineOutput {
  // console.log(events)
  const groups = groupByTime(events);
  const output: TimelineOutput = {};

  const maxIndex = Math.max(...Object.keys(groups).map(Number));

  for (let i = 0; i <= maxIndex; i++) {
    const current =
      groups[i].sort((a, b) => {
        const minA = Number(formatTime(a.start_time).split(":")[1]);
        const minB = Number(formatTime(b.start_time).split(":")[1]);
        return minA - minB;
      }) || [];

    if (i === 0 || groups[i].length === 1) {
      output[i] = groups[i].sort((a, b) => {
        const minA = Number(formatTime(a.start_time).split(":")[1]);
        const minB = Number(formatTime(b.start_time).split(":")[1]);
        return minA - minB;
      });
    }
    else {
        const next = output[i - 1] || [];
      output[i] = alignGroup(current, next);
    }
  }

  return output;
}

export function formatDuration(period: string): string {
  const [start, end] = period.split("-").map(t => t.trim());

  const diff = toMin(end) - toMin(start);
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  let output = "";

  if (hours > 0) {
    output += `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  if (minutes > 0) {
    if (output) output += " ";
    output += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  return output || "0 minutes";
}

export const CompareDates = (date1:string, date2:string)=>{

const d1 = new Date(date1);
const d2 = new Date(date2);

  if(d1 < d2){
    return true
  }

  return false
}