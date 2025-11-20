import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDatesInRangeFormatted(
  startDate: string,
  endDate: string
): string[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: string[] = [];

  const current = new Date(start);
  while (current <= end) {
    const formatted = current.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    dates.push(formatted);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function getPrefix(str: string): string {
  return str.replaceAll("/", "").split("-")[0];
}

export function CategoryColor(str: string): string {
  switch (str) {
    case "Diamond": {
      return "bg-[#CDB054]";
    }
    case "Platinum": {
      return "bg-[#BFCD54]";
    }
    case "Gold": {
      return "bg-[#CD8C54]";
    }
    default: {
      return "";
    }
  }
}

export const dateCustom = (datestr: string) => {
  const time = new Date(datestr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return time;
};

export function normalizeLabel(str: string): string {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export function formatSpeakers(arr: string[]) {
  if (arr.length <= 1) return arr[0] || "";
  return arr.join(" & ");
}

export const CustomPick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {} as Pick<T, K>);
};

export const filterDates = (
  dates: { date: string; day_name: string }[]
) => {
  const today = new Date();
  const todayStr = today.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const todayIndex = dates.findIndex((d) => d.date === todayStr);
  if (todayIndex === -1) return [];

  const startIndex = Math.max(todayIndex - 2, 0);

  return dates.slice(startIndex);
};

export function getNewDatesInRangeFormatted(
  startDate: string,
  endDate: string
): { date: string; day_name: string }[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: { date: string; day_name: string }[] = [];

  const current = new Date(start);
  while (current <= end) {
    const dateStr = current.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    const dayName = current.toLocaleDateString("en-US", {
      weekday: "short",
    });

    dates.push({ date: dateStr, day_name: dayName });

    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};