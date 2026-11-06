import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { formatDuration } from "../V2_ProgrammeShared/agenda";
import {
  AvatarStack,
  ClashBadge,
  FavouriteButton,
  Highlight,
} from "../V2_ProgrammeShared/ProgrammeUI";
import {
  formatClock,
  getCategory,
  getRoom,
  isHappeningNow,
  tint,
  toMinutes,
} from "../V2_ProgrammeShared/programmeUtils";

type Props = {
  session: Programme;
  selected: boolean;
  favourite: boolean;
  clash: boolean;
  query: string;
  onSelect: () => void;
  onToggleFavourite: () => void;
};

const AgendaRow = ({ session: s, selected, favourite, clash, query, onSelect, onToggleFavourite }: Props) => {
  const cat = getCategory(s);
  const live = isHappeningNow(s);
  const duration = toMinutes(s.end_time) - toMinutes(s.start_time);

  return (
    <div
      role="button"
      tabIndex={0}
      data-session-id={s.id}
      aria-current={selected || undefined}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className={cn(
        "group relative flex gap-3 px-3 sm:px-4 py-3 rounded-lg cursor-pointer outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-primary/40",
        selected ? "bg-primary/[0.07] ring-1 ring-primary/30" : "hover:bg-gray-50",
      )}
    >
      <span className="w-1 shrink-0 rounded-full" style={{ background: cat.color }} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
          <span className="tabular-nums">
            {formatClock(s.start_time)} – {formatClock(s.end_time)}
          </span>
          <span className="text-gray-300">•</span>
          <span>{formatDuration(duration)}</span>
          {live && (
            <span className="inline-flex items-center gap-1 px-1.5 rounded bg-rose-500 text-white text-[10px] font-bold">
              <span className="size-1.5 rounded-full bg-white animate-pulse" /> LIVE
            </span>
          )}
          {clash && <ClashBadge />}
        </div>
        {cat.name && (
          <span
            className="mt-1 inline-block px-2 py-0.5 rounded-full text-[11px] font-medium text-gray-700 max-w-full truncate"
            style={{ background: tint(cat.color, "24") }}
          >
            {cat.name}
          </span>
        )}
        <p className="mt-1 text-[15px] font-semibold leading-snug text-gray-900 line-clamp-2">
          <Highlight text={s.title} query={query} />
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500">
          {s.speakers.length > 0 && (
            <span className="flex items-center gap-1.5 min-w-0 max-w-full">
              <AvatarStack speakers={s.speakers} max={3} />
              <span className="truncate text-gray-600">
                <Highlight text={s.speakers.map((sp) => sp.fullname).join(", ")} query={query} />
              </span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5 shrink-0" />
            <Highlight text={getRoom(s)} query={query} />
          </span>
        </div>
      </div>
      <FavouriteButton
        active={favourite}
        onToggle={onToggleFavourite}
        className={cn(
          "self-start mt-0.5 p-1.5 -m-1",
          // Quiet until hover on desktop; always visible on touch and on the selected row
          !favourite && !selected && "opacity-60 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100",
        )}
      />
    </div>
  );
};

export default AgendaRow;
