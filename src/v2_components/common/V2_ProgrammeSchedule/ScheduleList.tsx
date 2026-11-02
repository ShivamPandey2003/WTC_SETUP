import { MapPin } from "lucide-react";
import { AvatarStack, FavouriteButton } from "../V2_ProgrammeShared/ProgrammeUI";
import { formatClock, getCategory, getRoom, tint } from "../V2_ProgrammeShared/programmeUtils";
import type { Favourites } from "../V2_ProgrammeShared/useFavourites";

type Props = {
  sessions: Programme[];
  favourites: Favourites;
  onOpen: (sessions: Programme[]) => void;
};

const ScheduleList = ({ sessions, favourites, onOpen }: Props) => {
  // Parallel sessions sit together under one start time
  const slots = sessions.reduce<Record<string, Programme[]>>((acc, s) => {
    (acc[s.start_time] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(slots).map(([start, items]) => (
        <section key={start} className="sm:grid sm:grid-cols-[96px_1fr] sm:gap-4">
          <p className="text-sm font-medium text-gray-800 mb-2 sm:mb-0 sm:pt-4">
            {formatClock(start)}
          </p>
          <div className="grid gap-3 lg:grid-cols-2">
            {items.map((s) => {
              const cat = getCategory(s);
              return (
                <div
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpen([s])}
                  onKeyDown={(e) => e.key === "Enter" && onOpen([s])}
                  className="flex gap-3 bg-white rounded-xl border border-gray-100 p-4 cursor-pointer hover:shadow-sm transition-shadow"
                >
                  <span className="w-1 shrink-0 rounded-full" style={{ background: cat.color }} />
                  <div className="min-w-0 flex-1 flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs text-gray-500">
                        {formatClock(s.start_time)} - {formatClock(s.end_time)}
                      </p>
                      <FavouriteButton
                        active={favourites.isFavourite(s.id)}
                        onToggle={() => favourites.toggleFavourite(s.id)}
                      />
                    </div>
                    <p className="text-sm font-medium leading-snug text-gray-900">{s.title}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {getRoom(s)}
                      </span>
                      {cat.name && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[11px] text-gray-700 max-w-full truncate"
                          style={{ background: tint(cat.color, "26") }}
                        >
                          {cat.name}
                        </span>
                      )}
                    </div>
                    {s.speakers.length > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        <AvatarStack speakers={s.speakers} />
                        <p className="text-xs text-gray-600 truncate">
                          {s.speakers.map((sp) => sp.fullname).join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ScheduleList;
