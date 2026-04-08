import type { OutputItem } from "./extra";

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const isOverlap = (a: OutputItem, b: OutputItem) => {
  return (
    toMinutes(a.start) < toMinutes(b.end) &&
    toMinutes(b.start) < toMinutes(a.end)
  );
};

export const groupIntoColumns = (items: OutputItem[]) => {
  // 🔹 1. separate extra items
  const extras = items.filter((item) => item.type === "extra");
  const normalItems = items.filter((item) => item.type !== "extra");

  // 🔹 2. sort normal items
  const sorted = [...normalItems].sort(
    (a, b) => toMinutes(a.start) - toMinutes(b.start)
  );

  const columns: OutputItem[][] = [];

  // 🔹 3. normal column logic
  for (const item of sorted) {
    let placed = false;

    for (const col of columns) {
      const hasOverlap = col.some((existing) =>
        isOverlap(existing, item)
      );

      if (!hasOverlap) {
        col.push(item);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([item]);
    }
  }

  // 🔹 4. push extras as LAST column
  if (extras.length > 0) {
    columns.push(extras);
  }

  return columns;
};