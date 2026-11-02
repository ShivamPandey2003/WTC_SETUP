import { cn, getContrastTextColor } from "@/lib/utils";
import { Check, LayoutGrid, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { SheetFooter } from "../V2_ProgrammeShared/ProgrammeUI";

type Category = { id: string; name: string; color: string };

type Props = {
  open: boolean;
  onClose: () => void;
  view: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
  categories: Category[];
  selected: string[];
  onApply: (ids: string[]) => void;
};

const toFullHex = (hex: string) => {
  const h = hex.replace("#", "");
  return h.length === 3 ? `#${h.split("").map((c) => c + c).join("")}` : `#${h.slice(0, 6)}`;
};

/** Drops down under the header (full width on mobile, popover on desktop). */
const TracksSettingsPanel = ({
  open,
  onClose,
  view,
  onViewChange,
  categories,
  selected,
  onApply,
}: Props) => {
  const [draft, setDraft] = useState(selected);

  useEffect(() => {
    if (open) setDraft(selected);
  }, [open, selected]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-label="Programme settings"
        className={cn(
          "absolute z-50 top-full mt-1 bg-white shadow-xl flex flex-col",
          "inset-x-0 rounded-b-2xl max-h-[75vh]",
          "sm:inset-x-auto sm:right-0 sm:w-[440px] sm:rounded-2xl",
        )}
      >
        <div className="overflow-y-auto p-5 flex flex-col gap-5">
          <section className="flex flex-col gap-3">
            <p className="text-sm text-gray-700">Program view</p>
            <div className="grid grid-cols-2 p-1 rounded-xl bg-gray-100">
              {(
                [
                  ["list", "List", Menu],
                  ["grid", "Grid", LayoutGrid],
                ] as const
              ).map(([v, label, Icon]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => onViewChange(v)}
                  aria-pressed={view === v}
                  className={cn(
                    "flex items-center justify-center gap-2 h-10 rounded-lg text-sm transition-colors",
                    view === v ? "bg-primary text-white shadow-sm" : "text-gray-700",
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">Session tracks</p>
              {draft.length > 0 && (
                <span className="text-xs text-gray-500">{draft.length} selected</span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((c) => {
                const on = draft.includes(c.id);
                const color = toFullHex(c.color);
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    title={c.name}
                    onClick={() =>
                      setDraft((d) => (on ? d.filter((x) => x !== c.id) : [...d, c.id]))
                    }
                    className={cn(
                      "relative min-h-12 px-3 py-2 rounded-lg text-xs font-medium leading-tight text-center shadow-sm transition-opacity",
                      draft.length > 0 && !on && "opacity-35",
                      on && "ring-2 ring-offset-2 ring-gray-900/70",
                    )}
                    style={{ background: color, color: getContrastTextColor(color) }}
                  >
                    <span className="line-clamp-2">{c.name}</span>
                    {on && (
                      <Check className="absolute top-1 right-1 size-3.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
        <div className="flex gap-3 px-5 py-4 border-t border-gray-100">
          <SheetFooter
            count={draft.length}
            onReset={() => setDraft([])}
            onApply={() => {
              onApply(draft);
              onClose();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TracksSettingsPanel;
