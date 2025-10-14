import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDatesInRangeFormatted(startDate: string, endDate: string): string[] {
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