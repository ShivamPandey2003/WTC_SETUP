import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { formatClock, isHappeningNow, stageLabel } from "../V2_ProgrammeShared/programmeUtils";
import { eventTzAbbr } from "../V2_ProgrammeShared/agenda";
import type { Favourites } from "../V2_ProgrammeShared/useFavourites";
import AgendaRow from "./AgendaRow";
import { slotId } from "./agendaFilters";

type Props = {
  sessions: Programme[]; // already filtered + sorted
  selectedId: string | null;
  favourites: Favourites;
  clashes: Map<string, Programme[]>;
  query: string;
  onSelect: (s: Programme) => void;
};

// A slot with more than this many sessions of one stream folds the rest away
const FOLD_AFTER = 3;

const AgendaList = ({ sessions, selectedId, favourites, clashes, query, onSelect }: Props) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const slots = sessions.reduce<Map<string, Programme[]>>((acc, s) => {
    acc.set(s.start_time, [...(acc.get(s.start_time) ?? []), s]);
    return acc;
  }, new Map());

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="pb-24 sm:pb-6">
      {[...slots.entries()].map(([start, items]) => {
        const live = items.some((s) => isHappeningNow(s));
        const byStage = items.reduce<Map<string, Programme[]>>((acc, s) => {
          acc.set(s.type, [...(acc.get(s.type) ?? []), s]);
          return acc;
        }, new Map());

        return (
          <section key={start} id={slotId(start)} aria-label={formatClock(start)}>
            <header
              className={cn(
                "sticky top-0 z-10 border-b bg-white",
                live ? "border-rose-200" : "border-gray-100",
              )}
            >
              <div className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-primary/10">
              <div className="flex items-baseline gap-2 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 tabular-nums">{formatClock(start)}</h3>
                <span className="text-sm font-medium text-primary">
                  {eventTzAbbr(items[0].start_date, "long")}
                </span>
                <span className="text-xs text-gray-500">
                  {items.length} session{items.length > 1 && "s"}
                </span>
              </div>
              {live && (
                <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-rose-600">
                  <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" /> HAPPENING NOW
                </span>
              )}
              </div>
            </header>

            <div className="px-1 sm:px-2 py-1.5 flex flex-col gap-0.5">
              {[...byStage.entries()].map(([stage, group]) => {
                const key = `${start}-${stage}`;
                const hidden = group.slice(FOLD_AFTER);
                // Keep a selected session visible even inside a folded group
                const open =
                  expanded.has(key) || hidden.some((s) => s.id === selectedId) || hidden.length === 0;
                const shown = open ? group : group.slice(0, FOLD_AFTER);

                return (
                  <div key={key} className="flex flex-col gap-0.5">
                    {shown.map((s) => (
                      <AgendaRow
                        key={s.id}
                        session={s}
                        selected={s.id === selectedId}
                        favourite={favourites.isFavourite(s.id)}
                        clash={clashes.has(s.id)}
                        query={query}
                        onSelect={() => onSelect(s)}
                        onToggleFavourite={() => favourites.toggleFavourite(s.id)}
                      />
                    ))}
                    {hidden.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggle(key)}
                        aria-expanded={open}
                        className="ml-7 sm:ml-8 mr-3 my-1 flex items-center gap-1.5 self-start px-3 h-8 rounded-md bg-gray-100 text-xs font-medium text-gray-700 hover:bg-primary/15"
                      >
                        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
                        {open
                          ? "Show less"
                          : `${hidden.length} more ${stageLabel(stage).toLowerCase()} session${hidden.length > 1 ? "s" : ""}`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default AgendaList;
