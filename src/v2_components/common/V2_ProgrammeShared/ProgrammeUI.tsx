import ErrorDisplay from "@/components/global/ErrorDisplay";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertTriangle, CalendarHeart, Heart, X } from "lucide-react";
import { useEffect } from "react";

type Speaker = Programme["speakers"][number];

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: React.ReactNode; ariaLabel?: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1 p-1 rounded-md bg-gray-100 w-fit", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          aria-label={o.ariaLabel}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
            "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            value === o.value ? "bg-primary text-white shadow-sm" : "text-black hover:bg-white",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

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
  bodyClassName,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  bodyClassName?: string;
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
        <div className={cn("flex-1 overflow-y-auto px-5 py-4", bodyClassName)}>{children}</div>
        {footer && <div className="flex gap-3 px-5 py-4 border-t border-gray-100">{footer}</div>}
      </div>
    </div>
  );
};

export const EmptyState = ({
  favourites,
  filtered,
  onClear,
}: {
  favourites: boolean;
  filtered: boolean;
  onClear: () => void;
}) => (
  <div className="flex flex-col items-center text-center gap-2 py-16 text-gray-500 bg-white rounded-xl shadow-sm">
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
      <Button type="button" onClick={onClear} className="mt-2">
        Clear all filters
      </Button>
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

/** Marks the parts of `text` that match the search query. */
export const Highlight = ({ text, query }: { text: string; query?: string }) => {
  const q = query?.trim();
  if (!q) return <>{text}</>;
  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  const parts: React.ReactNode[] = [];
  let from = 0;
  let at = lower.indexOf(needle);
  while (at !== -1) {
    if (at > from) parts.push(text.slice(from, at));
    parts.push(
      <mark key={at} className="bg-amber-200 text-inherit rounded-sm px-0.5 -mx-0.5">
        {text.slice(at, at + needle.length)}
      </mark>,
    );
    from = at + needle.length;
    at = lower.indexOf(needle, from);
  }
  parts.push(text.slice(from));
  return <>{parts}</>;
};

export const ClashBadge = ({ className }: { className?: string }) => (
  <span
    title="Overlaps another favourite"
    className={cn(
      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-semibold",
      className,
    )}
  >
    <AlertTriangle className="size-3" /> Clash
  </span>
);
