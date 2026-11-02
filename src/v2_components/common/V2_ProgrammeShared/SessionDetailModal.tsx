import Description from "@/components/ui/Description";
import Modal from "@/components/ui/Modal";
import { addToGoogleCalendar, cn, formatForGoogleCalendar } from "@/lib/utils";
import { CalendarPlus, ChevronLeft, Clock, Heart, MapPin } from "lucide-react";
import { useState } from "react";
import { FavouriteButton, SpeakerAvatar } from "./ProgrammeUI";
import { dayParts, formatClock, getCategory, getRoom, stageLabel } from "./programmeUtils";
import type { Favourites } from "./useFavourites";

type Props = {
  sessions: Programme[];
  onClose: () => void;
  favourites: Favourites;
};

const timeRange = (s: Programme) => `${formatClock(s.start_time)} - ${formatClock(s.end_time)}`;

/** One session shows its details; a collapsed slot (several sessions) shows a list first. */
const SessionDetailModal = ({ sessions, onClose, favourites }: Props) => {
  const [openId, setOpenId] = useState<string | null>(sessions.length === 1 ? sessions[0].id : null);
  const session = sessions.find((s) => s.id === openId);

  if (!session) {
    const first = sessions[0];
    return (
      <Modal isOpen onClose={onClose} title={`${sessions.length} sessions · ${timeRange(first)}`} size="lg">
        <ul className="flex flex-col divide-y divide-gray-100 max-h-[65vh] overflow-y-auto -mx-2">
          {sessions.map((s) => {
            const cat = getCategory(s);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(s.id)}
                  className="w-full flex gap-3 text-left px-2 py-3 hover:bg-gray-50 rounded-lg"
                >
                  <span className="w-1 shrink-0 rounded-full" style={{ background: cat.color }} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-gray-900">{s.title}</span>
                    <span className="block text-xs text-gray-500 mt-0.5 truncate">
                      {s.location || getRoom(s)}
                      {s.speakers.length > 0 && ` · ${s.speakers.map((sp) => sp.fullname).join(", ")}`}
                    </span>
                  </span>
                  <FavouriteButton
                    active={favourites.isFavourite(s.id)}
                    onToggle={() => favourites.toggleFavourite(s.id)}
                    className="self-start mt-0.5"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </Modal>
    );
  }

  const cat = getCategory(session);
  const fav = favourites.isFavourite(session.id);
  const { weekday, short } = dayParts(session.start_date);

  return (
    <Modal isOpen onClose={onClose} title={session.title} size="lg">
      <div className="flex flex-col gap-4 text-sm text-gray-700 max-h-[70vh] overflow-y-auto">
        {sessions.length > 1 && (
          <button
            type="button"
            onClick={() => setOpenId(null)}
            className="flex items-center gap-1 text-xs font-medium text-primary w-fit"
          >
            <ChevronLeft className="size-4" /> All sessions in this slot
          </button>
        )}
        <div className="flex flex-wrap gap-2">
          {cat.name && (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: `${cat.color}22`, color: "#1f2937" }}
            >
              <span className="inline-block size-2 rounded-full mr-1.5" style={{ background: cat.color }} />
              {cat.name}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-xs bg-gray-100">{stageLabel(session.type)}</span>
        </div>
        <div className="flex flex-col gap-1.5 text-gray-600">
          <p className="flex items-center gap-2">
            <Clock className="size-4 shrink-0" /> {weekday}, {short} · {timeRange(session)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            {getRoom(session)}
            {session.location && ` · ${session.location}`}
          </p>
        </div>

        {session.speakers.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Speakers</p>
            {session.speakers.map((sp) => (
              <div key={sp.speaker_id} className="flex items-center gap-3">
                <SpeakerAvatar speaker={sp} className="size-10" />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{sp.fullname}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {[sp.designation, sp.company].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {session.description && <Description text={session.description} />}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => favourites.toggleFavourite(session.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border text-sm font-medium",
              fav ? "border-rose-200 bg-rose-50 text-rose-600" : "border-gray-200 text-gray-700",
            )}
          >
            <Heart className={cn("size-4", fav && "fill-rose-500")} />
            {fav ? "Saved" : "Add to favourites"}
          </button>
          <button
            type="button"
            onClick={() =>
              addToGoogleCalendar({
                title: session.title,
                start: formatForGoogleCalendar(session.start_date, session.start_time),
                end: formatForGoogleCalendar(session.end_date, session.end_time),
                location: session.location,
              })
            }
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border border-gray-200 text-sm font-medium text-gray-700"
          >
            <CalendarPlus className="size-4" /> Calendar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SessionDetailModal;
