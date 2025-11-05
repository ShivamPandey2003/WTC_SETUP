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
