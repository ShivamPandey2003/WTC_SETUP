import { cn } from "@/lib/utils";
import { Check, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetFooter } from "../V2_ProgrammeShared/ProgrammeUI";
import { stageLabel } from "../V2_ProgrammeShared/programmeUtils";
import { EMPTY_SCHEDULE_FILTERS, type ScheduleFilters } from "./scheduleFilters";


type Props = {
  open: boolean;
  onClose: () => void;
  value: ScheduleFilters;
  onApply: (filters: ScheduleFilters) => void;
  stages: string[];
  rooms: string[];
  categories: { id: string; name: string; color: string }[];
};

const toggle = (list: string[], item: string) =>
  list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

const Option = ({
  label,
  selected,
  onClick,
  dot,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  dot?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={cn(
      "flex items-center gap-2 px-3 min-h-9 py-1.5 rounded-full border text-sm text-left transition-colors",
      selected
        ? "border-primary bg-primary/10 text-primary font-medium"
        : "border-gray-200 text-gray-700 hover:border-gray-300",
    )}
  >
    {dot && <span className="size-2 rounded-full shrink-0" style={{ background: dot }} />}
    {label}
    {selected && <Check className="size-3.5 shrink-0" />}
  </button>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-3">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{title}</p>
    {children}
  </section>
);

const ScheduleFilterSheet = ({ open, onClose, value, onApply, stages, rooms, categories }: Props) => {
  // Edits stay local until "Apply"
  const [draft, setDraft] = useState(value);
  const [categoryQuery, setCategoryQuery] = useState("");

  useEffect(() => {
    if (open) {
      setDraft(value);
      setCategoryQuery("");
    }
  }, [open, value]);

  const count = draft.stages.length + draft.rooms.length + draft.categories.length;
  const visibleCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categoryQuery.trim().toLowerCase()),
  );

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Filters"
      footer={
        <SheetFooter
          count={count}
          onReset={() => setDraft(EMPTY_SCHEDULE_FILTERS)}
          onApply={() => {
            onApply(draft);
            onClose();
          }}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <Section title="Stream">
          <div className="flex flex-wrap gap-2">
            {stages.map((s) => (
              <Option
                key={s}
                label={stageLabel(s)}
                selected={draft.stages.includes(s)}
                onClick={() => setDraft((d) => ({ ...d, stages: toggle(d.stages, s) }))}
              />
            ))}
          </div>
        </Section>

        <Section title="Track">
          <label className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 focus-within:border-primary">
            <Search className="size-4 text-gray-400" />
            <input
              value={categoryQuery}
              onChange={(e) => setCategoryQuery(e.target.value)}
              placeholder="Find a track"
              className="flex-1 min-w-0 outline-none text-sm bg-transparent"
            />
          </label>
          <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
            {visibleCategories.map((c) => (
              <Option
                key={c.id}
                label={c.name}
                dot={c.color}
                selected={draft.categories.includes(c.id)}
                onClick={() => setDraft((d) => ({ ...d, categories: toggle(d.categories, c.id) }))}
              />
            ))}
            {visibleCategories.length === 0 && (
              <p className="text-xs text-gray-500">No tracks match “{categoryQuery}”.</p>
            )}
          </div>
        </Section>

        <Section title="Room">
          <div className="flex flex-wrap gap-2">
            {rooms.map((r) => (
              <Option
                key={r}
                label={r}
                selected={draft.rooms.includes(r)}
                onClick={() => setDraft((d) => ({ ...d, rooms: toggle(d.rooms, r) }))}
              />
            ))}
          </div>
        </Section>
      </div>
    </Sheet>
  );
};

export default ScheduleFilterSheet;
