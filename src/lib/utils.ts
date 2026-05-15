import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Height_OBJ = {
  1: "80",
  2: "150",
  3: "200",
  4: "400",
  5: "750",
  6: "900",
  7: "1100",
  8: "1600",
  9: "1800",
  10: "2000",
}

export const convertToDate = (data: { dayMonth: string }) => {
  const [monthStr, day] = data.dayMonth.split(" ");

  const months: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const month = months[monthStr];
  const paddedDay = day.padStart(2, "0");

  const year = new Date().getFullYear();

  return `${year}-${month}-${paddedDay}`;
};

export function getDatesInRangeFormatted(
  startDate: string,
  endDate: string,
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
      timeZone:"UTC"
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
    timeZone: "UTC",
  });

export const formatDateDisplay = (date: string | null) => {
  if (!date) return "";
  const dateObj = new Date(date + "T00:00:00");
  return dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

export function formatSpeakers(arr: string[]) {
  if (arr.length <= 1) return arr[0] || "";
  return arr.join(" & ");
}

export const CustomPick = <T, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> => {
  return keys.reduce(
    (acc, key) => {
      acc[key] = obj[key];
      return acc;
    },
    {} as Pick<T, K>,
  );
};

export const filterDates = (dates: { date: string; day_name: string }[]) => {
  const today = new Date();
  const todayStr = today.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });

  const todayIndex = dates.findIndex((d) => d.date === todayStr);
  if (todayIndex === -1) return [];

  const startIndex = Math.max(todayIndex - 2, 0);

  return dates.slice(startIndex);
};

export function getNewDatesInRangeFormatted(
  startDate: string,
  endDate: string,
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
      timeZone: "UTC",
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

export const formatForGoogleCalendar = (date: string, time: string) => {
  const dateTime = new Date(`${date}T${time}`);
  return dateTime.toISOString().replace(/-|:|\.\d+/g, "");
};

export function normalizeTime(time: string) {
  if (!time) return "";
  return time.split(".")[0].slice(0, 5);
}

export const addToGoogleCalendar = ({
  title,
  start,
  end,
  location,
}: {
  title: string;
  start: string;
  end: string;
  location: string;
}) => {
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&location=${encodeURIComponent(location)}`;

  window.open(url, "_blank");
};

// export const addToOutlookCalendar = ({
//   title,
//   start,
//   end,
//   location,
// }: {
//   title: string;
//   start: string;
//   end: string;
//   location: string;
// }) => {
//   const url =
//     `https://outlook.office.com/calendar/action/compose` +
//     `?rru=addevent` +
//     `&startdt=${encodeURIComponent(start)}` +
//     `&enddt=${encodeURIComponent(end)}` +
//     `&subject=${encodeURIComponent(title)}` +
//     `&location=${encodeURIComponent(location)}`;

//   window.open(url, "_blank");
// };

type CalendarEvent = {
  title: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
  icsUrl: string; // your API endpoint that returns the .ics file
};

export const addToOutlookCalendar = (event: CalendarEvent): void => {
  const params = new URLSearchParams({
    rru: "addevent",
    startdt: event.start,
    enddt: event.end,
    subject: event.title,
    location: event.location ?? "",
    body: event.description ?? "",
  });

  const url = `https://outlook.office.com/calendar/action/compose?${params}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

export const addToCalendar = (event: CalendarEvent): void => {
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // .ics URL directly — iOS/Android intercept and open native calendar
    window.location.href = event.icsUrl;
  } else {
    // Desktop — Outlook Web compose (no app install needed)
    addToOutlookCalendar(event);
  }
};

export const downloadICSFromUrl = async (icsUrl: string, title: string): Promise<void> => {
  const res = await fetch(icsUrl);
  const blob = await res.blob();

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${title.replace(/\s+/g, "_")}.ics`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const addToICalendar = ({
  title,
  start,
  end,
  location,
}: {
  title: string;
  start: string;
  end: string;
  location: string;
}) => {
  const formatDate = (iso: string) =>
    iso.replace(/[-:]/g, "").replace(".000", "");

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${title}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const addToYahooCalendar = ({
  title,
  start,
  end,
  location,
}: {
  title: string;
  start: string;
  end: string;
  location: string;
}) => {
  const url = `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(title)}&st=${start}&et=${end}&in_loc=${encodeURIComponent(location)}`;

  window.open(url, "_blank");
};

export function base64ToFile(
  base64: string,
  filename = "image.png"
): File {
  const [meta, data] = base64.split(",");
  const mime = meta.match(/data:(.*);base64/)?.[1] || "image/png";

  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], filename, { type: mime });
}

export function isBase64Image(str: string): boolean {
  return /^data:image\/(png|jpg|jpeg|gif|webp);base64,/.test(str);
}

export const isValidImage = (filename: string) => {
  const lower = filename.toLowerCase();
  return (
    lower.endsWith(".png") ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".webp")
  );
};

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]; // don't mutate original

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

export function generateExhibitorId(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
}

export function getContrastTextColor(hexColor: string): string {
  // Strip # if present
  let hex = hexColor.replace('#', '');

  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate relative luminance (WCAG formula)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#1A1A1A' : '#FFFFFF';
}