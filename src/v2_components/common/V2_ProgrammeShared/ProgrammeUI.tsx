import ErrorDisplay from "@/components/global/ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CalendarHeart, Heart, X } from "lucide-react";
import { useEffect } from "react";

type Speaker = Programme["speakers"][number];

export const SpeakerAvatar = ({ speaker, className }: { speaker: Speaker; className?: string }) =>
  speaker.profile_img ? (
    <img
      src={speaker.profile_img}
      alt={speaker.fullname}
      loading="lazy"
      className={cn("size-8 rounded-full object-cover bg-gray-100 shrink-0", className)}
    />
  ) : (
    <span
      className={cn(
        "size-8 rounded-full bg-gray-200 text-gray-600 text-[11px] font-medium grid place-items-center shrink-0",
        className,
      )}
    >
      {speaker.fullname
        .replace(/^(Mr|Mrs|Ms|Dr|Prof)\.?\s+/i, "")
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")}
    </span>
  );

export const AvatarStack = ({ speakers, max = 3 }: { speakers: Speaker[]; max?: number }) => (
  <div className="flex items-center">
    {speakers.slice(0, max).map((sp, i) => (
      <SpeakerAvatar
        key={sp.speaker_id}
        speaker={sp}
        className={cn("size-6 ring-2 ring-white", i > 0 && "-ml-2")}
      />
    ))}
    {speakers.length > max && (
      <span className="ml-1 text-[11px] text-gray-500">+{speakers.length - max}</span>
    )}
  </div>
);

export const FavouriteButton = ({
  active,
  onToggle,
  className,
}: {
  active: boolean;
  onToggle: () => void;
  className?: string;
}) => (
  <button
    type="button"
    aria-label={active ? "Remove from favourites" : "Add to favourites"}
    aria-pressed={active}
    onClick={(e) => {
      e.stopPropagation();
      onToggle();
    }}
    className={cn("shrink-0 p-1 -m-1 rounded-full hover:bg-black/5", className)}
  >
    <Heart className={cn("size-4", active ? "fill-rose-500 text-rose-500" : "text-gray-400")} />
  </button>
);

/** Bottom sheet on mobile, right-side drawer from `sm` up. */
export const Sheet = ({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={cn("fixed inset-0 z-[1000]", !open && "pointer-events-none")} aria-hidden={!open}>
      <div
        className={cn("absolute inset-0 bg-black/40 transition-opacity", open ? "opacity-100" : "opacity-0")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-label={title}
        className={cn(
          "absolute bg-white flex flex-col shadow-xl transition-transform duration-300",
          "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl",
          "sm:inset-x-auto sm:right-0 sm:top-0 sm:bottom-0 sm:max-h-none sm:w-[400px] sm:rounded-none",
          open ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-y-0 sm:translate-x-full",
        )}
      >
        <div className="sm:hidden mx-auto mt-2 h-1 w-10 rounded-full bg-gray-300" />
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="size-5 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex gap-3 px-5 py-4 border-t border-gray-100">{footer}</div>}
      </div>
    </div>
  );
};

export const SheetFooter = ({ onReset, onApply, count }: { onReset: () => void; onApply: () => void; count: number }) => (
  <>
    <button
      type="button"
      onClick={onReset}
      className="flex-1 h-11 rounded-lg border border-gray-200 text-sm font-medium text-gray-700"
    >
      Reset
    </button>
    <button
      type="button"
      onClick={onApply}
      className="flex-1 h-11 rounded-lg bg-primary text-white text-sm font-medium"
    >
      Apply{count > 0 && ` (${count})`}
    </button>
  </>
);

export const AppliedFilters = ({
  items,
  onRemove,
  onClearAll,
}: {
  items: { id: string; label: string; color?: string }[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}) =>
  items.length === 0 ? null : (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
      {items.map((f) => (
        <span
          key={f.id}
          className="shrink-0 flex items-center gap-1.5 h-7 pl-3 pr-1.5 rounded-full bg-gray-100 text-xs text-gray-700 max-w-[220px]"
        >
          {f.color && <span className="size-2 rounded-full shrink-0" style={{ background: f.color }} />}
          <span className="truncate">{f.label}</span>
          <button
            type="button"
            aria-label={`Remove ${f.label}`}
            onClick={() => onRemove(f.id)}
            className="p-0.5 rounded-full hover:bg-gray-200 shrink-0"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="shrink-0 text-xs font-medium text-primary hover:underline underline-offset-2"
      >
        Clear all
      </button>
    </div>
  );

export const EmptyState = ({
  favourites,
  filtered,
  onClear,
}: {
  favourites: boolean;
  filtered: boolean;
  onClear: () => void;
}) => (
  <div className="flex flex-col items-center text-center gap-2 py-16 text-gray-500">
    <CalendarHeart className="size-10 text-gray-300" />
    <p className="text-sm font-medium text-gray-700">
      {favourites && !filtered ? "No favourites for this day yet" : "No sessions match your filters"}
    </p>
    <p className="text-xs max-w-xs">
      {favourites && !filtered
        ? "Tap the heart on any session to save it here."
        : "Try another day or remove a filter."}
    </p>
    {filtered && (
      <button type="button" onClick={onClear} className="mt-2 text-sm font-medium text-primary">
        Clear all filters
      </button>
    )}
  </div>
);

export const ProgrammeLoading = () => (
  <div className="px-4 mx-auto w-full max-w-7xl flex flex-col gap-4">
    <Skeleton className="h-11 w-full rounded-lg" />
    <div className="flex gap-3">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-16 w-32 sm:w-48 rounded-lg" />
      ))}
    </div>
    {Array.from({ length: 5 }, (_, i) => (
      <Skeleton key={i} className="h-24 w-full rounded-xl" />
    ))}
  </div>
);

export const ProgrammeError = ({ message }: { message?: string }) => (
  <div className="flex items-center justify-center h-[80vh]">
    <ErrorDisplay title="Programme Error" message={message || "An unknown error occurred"} />
  </div>
);
