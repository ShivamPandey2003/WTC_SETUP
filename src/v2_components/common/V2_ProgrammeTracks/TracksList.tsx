import { cn } from "@/lib/utils";
import { FavouriteButton, SpeakerAvatar } from "../V2_ProgrammeShared/ProgrammeUI";
import { getCategory, stageLabel } from "../V2_ProgrammeShared/programmeUtils";
import type { Favourites } from "../V2_ProgrammeShared/useFavourites";

type Props = {
  sessions: Programme[];
  favourites: Favourites;
  onOpen: (sessions: Programme[]) => void;
};

const MAX_SPEAKERS = 2;

const SessionCard = ({
  session,
  favourites,
  onOpen,
}: {
  session: Programme;
  favourites: Favourites;
  onOpen: () => void;
}) => {
  const cat = getCategory(session);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-4 sm:p-5 cursor-pointer hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow h-full"
    >
      <div className="flex gap-3">
        <span className="w-1 shrink-0 rounded-full" style={{ background: cat.color }} />
        <p className="flex-1 text-[15px] sm:text-base font-semibold leading-snug text-gray-900">
          {session.title}
        </p>
        <FavouriteButton
          active={favourites.isFavourite(session.id)}
          onToggle={() => favourites.toggleFavourite(session.id)}
          className="self-start"
        />
      </div>
      {/* Track name lives in the timeline header on mobile; on desktop it moves into the card */}
      {cat.name && (
        <p className="hidden sm:block mt-2 pl-4 text-xs text-gray-500 truncate">{cat.name}</p>
      )}
      {session.speakers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
          {session.speakers.slice(0, MAX_SPEAKERS).map((sp) => (
            <div key={sp.speaker_id} className="flex items-center gap-3">
              <SpeakerAvatar speaker={sp} className="size-9" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{sp.fullname}</p>
                {sp.company && <p className="text-xs text-gray-500 truncate">{sp.company}</p>}
              </div>
            </div>
          ))}
          {session.speakers.length > MAX_SPEAKERS && (
            <p className="text-xs text-gray-500">
              +{session.speakers.length - MAX_SPEAKERS} more speakers
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/** Timeline list: per-card time header on mobile, time column + card grid on desktop. */
const TracksList = ({ sessions, favourites, onOpen }: Props) => {
  const slots = sessions.reduce<Record<string, Programme[]>>((acc, s) => {
    (acc[s.start_time] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="relative flex flex-col gap-5 sm:gap-8">
      <span className="absolute left-[3px] top-2 bottom-2 w-px bg-gray-200 sm:hidden" />
      {Object.entries(slots).map(([start, items]) => (
        <section key={start} className="sm:grid sm:grid-cols-[110px_1fr] sm:gap-6">
          <div className="hidden sm:flex items-start gap-2 pt-1 text-sm font-semibold text-gray-900">
            <span className="mt-1.5 size-2 rounded-full bg-gray-900" />
            {start}
          </div>
          <div className="flex flex-col gap-5 sm:grid sm:grid-cols-2 xl:grid-cols-3 sm:gap-4">
            {items.map((s) => (
              <div key={s.id} className="flex flex-col gap-2">
                <div className="sm:hidden flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-3 font-semibold text-gray-900">
                    <span className="relative size-[7px] rounded-full bg-gray-900" />
                    {s.start_time} - {s.end_time}
                  </span>
                  <span className="text-gray-600 truncate">{getCategory(s).name || stageLabel(s.type)}</span>
                </div>
                <p className="hidden sm:block text-xs text-gray-500">
                  {s.start_time} - {s.end_time} · {stageLabel(s.type)}
                </p>
                <div className={cn("pl-5 sm:pl-0 flex-1")}>
                  <SessionCard session={s} favourites={favourites} onOpen={() => onOpen([s])} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default TracksList;
