import { Button } from "@/components/ui/Button";
import Description from "@/components/ui/Description";
import { addToGoogleCalendar, cn, formatForGoogleCalendar } from "@/lib/utils";
import { AlertTriangle, CalendarPlus, Clock, Heart, MapPin, Share2, X } from "lucide-react";
import { formatDuration } from "../V2_ProgrammeShared/agenda";
import { SpeakerAvatar } from "../V2_ProgrammeShared/ProgrammeUI";
import {
  dayParts,
  formatClock,
  getCategory,
  getRoom,
  stageLabel,
  tint,
  toMinutes,
} from "../V2_ProgrammeShared/programmeUtils";
import { shareSession } from "../V2_ProgrammeShared/share";
import type { Favourites } from "../V2_ProgrammeShared/useFavourites";

type Props = {
  session: Programme;
  daySessions: Programme[]; // unfiltered sessions of the same day, for "related" lists
  favourites: Favourites;
  clashes: Map<string, Programme[]>;
  onSelect: (s: Programme) => void;
  onClose?: () => void;
};

const MiniRow = ({ s, onSelect, favourite }: { s: Programme; onSelect: () => void; favourite: boolean }) => (
  <button
    type="button"
    onClick={onSelect}
    className="w-full flex gap-2.5 text-left px-2 py-2 rounded-md hover:bg-gray-100"
  >
    <span className="w-0.5 shrink-0 rounded-full" style={{ background: getCategory(s).color }} />
    <span className="flex-1 min-w-0">
      <span className="block text-[13px] font-medium text-gray-900 line-clamp-2">{s.title}</span>
      <span className="block text-[11px] text-gray-500 truncate">
        {formatClock(s.start_time)} · {getRoom(s)}
      </span>
    </span>
    {favourite && <Heart className="size-3.5 shrink-0 mt-0.5 fill-rose-500 text-rose-500" />}
  </button>
);

const RELATED_LIMIT = 5;

const AgendaDetail = ({ session: s, daySessions, favourites, clashes, onSelect, onClose }: Props) => {
  const cat = getCategory(s);
  const fav = favourites.isFavourite(s.id);
  const { weekday, short } = dayParts(s.start_date);
  const start = toMinutes(s.start_time);
  const end = toMinutes(s.end_time);

  // Real alternatives first: closest start time, short sessions before all-day blocks
  // (registration, exhibition) which overlap everything
  const LONG = 180;
  const length = (o: Programme) => toMinutes(o.end_time) - toMinutes(o.start_time);
  const parallel = daySessions
    .filter((o) => o.id !== s.id && toMinutes(o.start_time) < end && start < toMinutes(o.end_time))
    .sort(
      (a, b) =>
        Number(length(a) >= LONG) - Number(length(b) >= LONG) ||
        Math.abs(toMinutes(a.start_time) - start) - Math.abs(toMinutes(b.start_time) - start),
    );
  const nextInRoom = daySessions.find(
    (o) => getRoom(o) === getRoom(s) && toMinutes(o.start_time) >= end && o.id !== s.id,
  );
  const clashing = fav ? clashes.get(s.id) : undefined;

  return (
    <article className="flex flex-col">
      {/* Colour band header */}
      <header className="relative px-5 pt-5 pb-4" style={{ background: tint(cat.color, "1A") }}>
        <span className="absolute inset-x-0 top-0 h-1" style={{ background: cat.color }} />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute right-3 top-3 p-1.5 rounded-md text-gray-500 hover:bg-black/5"
          >
            <X className="size-4" />
          </button>
        )}
        <div className="flex flex-wrap gap-1.5 pr-8">
          {cat.name && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white text-[11px] font-semibold text-gray-700">
              <span className="size-2 rounded-full" style={{ background: cat.color }} />
              {cat.name}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-white/70 text-[11px] text-gray-600">{stageLabel(s.type)}</span>
        </div>
        <h2 className="mt-3 text-lg sm:text-xl font-bold leading-snug text-gray-900">{s.title}</h2>
        <div className="mt-3 flex flex-col gap-1.5 text-sm text-gray-700">
          <p className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-gray-500" />
            {weekday}, {short} · {formatClock(s.start_time)} – {formatClock(s.end_time)}
            <span className="text-gray-400">({formatDuration(end - start)})</span>
          </p>
          <p className="flex items-start gap-2">
            <MapPin className="size-4 shrink-0 mt-0.5 text-gray-500" />
            <span>
              {getRoom(s)}
              {s.location && <span className="text-gray-500"> · {s.location}</span>}
            </span>
          </p>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            onClick={() => favourites.toggleFavourite(s.id)}
            className={cn("flex-1", fav && "bg-rose-500 hover:bg-rose-600")}
          >
            <Heart className={cn(fav && "fill-white")} />
            {fav ? "In my agenda" : "Add to my agenda"}
          </Button>
          <Button
            type="button"
            size="icon"
            aria-label="Add to Google Calendar"
            title="Add to Google Calendar"
            onClick={() =>
              addToGoogleCalendar({
                title: s.title,
                start: formatForGoogleCalendar(s.start_date, s.start_time),
                end: formatForGoogleCalendar(s.end_date, s.end_time),
                location: s.location,
              })
            }
            className="bg-white text-black hover:bg-gray-100"
          >
            <CalendarPlus />
          </Button>
          <Button
            type="button"
            size="icon"
            aria-label="Share session"
            title="Share"
            onClick={() => shareSession(s)}
            className="bg-white text-black hover:bg-gray-100"
          >
            <Share2 />
          </Button>
        </div>
      </header>

      <div className="px-5 py-5 flex flex-col gap-6">
        {clashing && (
          <div className="flex gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
            <AlertTriangle className="size-4 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold">Overlaps with {clashing.length} of your favourites</p>
              <ul className="mt-1 flex flex-col gap-0.5">
                {clashing.map((c) => (
                  <li key={c.id}>
                    <button type="button" onClick={() => onSelect(c)} className="text-left hover:underline">
                      {formatClock(c.start_time)} · {c.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {s.speakers.length > 0 && (
          <section className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Speaker{s.speakers.length > 1 && "s"}
            </h3>
            {s.speakers.map((sp) => (
              <div key={sp.speaker_id} className="flex gap-3">
                <SpeakerAvatar speaker={sp} className="size-11" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{sp.fullname}</p>
                  <p className="text-xs text-gray-500">
                    {[sp.designation, sp.company].filter(Boolean).join(" · ")}
                  </p>
                  {sp.bio && <p className="mt-1 text-xs text-gray-600 line-clamp-3">{sp.bio}</p>}
                </div>
              </div>
            ))}
          </section>
        )}

        {s.description && (
          <section className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">About</h3>
            <Description text={s.description} />
          </section>
        )}

        {parallel.length > 0 && (
          <section className="flex flex-col gap-1">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              At the same time <span className="normal-case font-normal">· {parallel.length}</span>
            </h3>
            {parallel.slice(0, RELATED_LIMIT).map((o) => (
              <MiniRow key={o.id} s={o} onSelect={() => onSelect(o)} favourite={favourites.isFavourite(o.id)} />
            ))}
            {parallel.length > RELATED_LIMIT && (
              <p className="px-2 text-[11px] text-gray-400">+{parallel.length - RELATED_LIMIT} more in this slot</p>
            )}
          </section>
        )}

        {nextInRoom && (
          <section className="flex flex-col gap-1">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Next in {getRoom(s)}</h3>
            <MiniRow s={nextInRoom} onSelect={() => onSelect(nextInRoom)} favourite={favourites.isFavourite(nextInRoom.id)} />
          </section>
        )}
      </div>
    </article>
  );
};

export default AgendaDetail;
