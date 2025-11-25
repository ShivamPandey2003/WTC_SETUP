import { MapPin, Bell, Calendar } from "lucide-react";
import clsx from "clsx";
import { CATEGORY_COLORS, formatDuration } from "@/lib";

export default function SessionCard({
  session,
  className,
}: {
  session: Programme;
  className?: string;
}) {
  const color =
    CATEGORY_COLORS[session.categories[0].name as keyof typeof CATEGORY_COLORS] ||
    "border-blue-400 bg-blue-50";

  return (
    <div
      className={clsx("rounded-xl border shadow-sm text-sm flex flex-col", color, className)}
      // style={{backgroundColor:session.categories[0].color}}
    >
      <div className="flex-1">
        <h3 className="font-medium text-gray-800 mb-1">{session.title}</h3>

        {session.location && (
          <div className="flex items-center justify-between gap-1 text-gray-500 text-xs mt-2">
            <div className="flex items-center"><MapPin size={14} /> {session.location}</div>
            <div className="flex gap-2">
            <Bell size={14} />
            <Calendar size={14} />
          </div>
          </div>
        )}
      </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span className="text-xs text-gray-500">{session.categories[0].name}</span>
          <span>
            {(session.start_time)} - {(session.end_time)}
          </span>
          <span>{formatDuration(`${(session.start_time)} - ${(session.end_time)}`)}</span>
        </div>
    </div>
  );
}
