import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { FavouriteButton } from "../V2_ProgrammeShared/ProgrammeUI";
import {
  formatMinutes,
  getCategory,
  getRoom,
  getTimeBounds,
  layoutBlocks,
  tint,
  type SessionBlock,
} from "../V2_ProgrammeShared/programmeUtils";
import type { Favourites } from "../V2_ProgrammeShared/useFavourites";

type Props = {
  sessions: Programme[];
  rooms: string[]; // column order
  favourites: Favourites;
  onOpen: (sessions: Programme[]) => void;
};

const PX_PER_MIN = 3.2; // 1 hour = 192px
const GUTTER = 76;
const LANE_WIDTH = 188;
const GAP = 4;

const BlockCard = ({
  block,
  favourites,
  onOpen,
}: {
  block: SessionBlock;
  favourites: Favourites;
  onOpen: () => void;
}) => {
  const first = block.sessions[0];
  const cat = getCategory(first);
  const group = block.sessions.length > 1;
  const height = (block.end - block.start) * PX_PER_MIN - GAP * 2;
  const compact = height < 64;
  const anyFav = block.sessions.some((s) => favourites.isFavourite(s.id));

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      title={group ? `${block.sessions.length} sessions` : first.title}
      className="absolute rounded-lg border border-black/5 cursor-pointer overflow-hidden hover:shadow-md hover:z-10 transition-shadow"
      style={{
        top: GAP,
        height: Math.max(height, 20),
        left: block.lane * LANE_WIDTH + GAP * 2,
        width: LANE_WIDTH - GAP * 4,
        background: tint(cat.color),
      }}
    >
      <div className={cn("flex h-full gap-2.5", compact ? "px-2 py-1" : "p-3")}>
        <span className="w-0.5 shrink-0 rounded-full" style={{ background: cat.color }} />
        <div className="min-w-0 flex-1 flex flex-col gap-1">
          {!compact && (
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] text-gray-500">
                {formatMinutes(block.start)} - {formatMinutes(block.end)}
              </p>
              {group ? (
                anyFav && <Heart className="size-3.5 fill-rose-500 text-rose-500 shrink-0" />
              ) : (
                <FavouriteButton
                  active={favourites.isFavourite(first.id)}
                  onToggle={() => favourites.toggleFavourite(first.id)}
                />
              )}
            </div>
          )}
          <p
            className={cn(
              "text-gray-900 leading-snug",
              compact ? "text-[11px] truncate" : "text-[13px] line-clamp-2",
            )}
          >
            {group ? `${block.sessions.length} sessions · ${cat.name || first.title}` : first.title}
          </p>
          {!compact && height > 110 && cat.name && (
            <p className="text-[11px] text-gray-500 truncate mt-auto">{cat.name}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const RoomGrid = ({ sessions, rooms, favourites, onOpen }: Props) => {
  const bounds = getTimeBounds(sessions);
  const hours = Array.from(
    { length: (bounds.end - bounds.start) / 60 },
    (_, i) => bounds.start + i * 60,
  );
  const height = (bounds.end - bounds.start) * PX_PER_MIN;

  const columns = rooms
    .map((room) => {
      const { blocks, lanes } = layoutBlocks(sessions.filter((s) => getRoom(s) === room));
      return { room, blocks, width: lanes * LANE_WIDTH };
    })
    .filter((c) => c.blocks.length > 0);
  const totalWidth = GUTTER + columns.reduce((sum, c) => sum + c.width, 0);

  return (
    // Scrolls both ways inside its own box so the room header and time gutter can stay pinned
    <div className="overflow-auto max-h-[70vh] sm:max-h-[calc(100vh-300px)] -mx-4 sm:mx-0 border-y border-dashed border-gray-200">
      <div style={{ width: totalWidth }}>
        <div className="sticky top-0 z-20 flex bg-white border-b border-dashed border-gray-200">
          <div className="sticky left-0 z-30 bg-white shrink-0" style={{ width: GUTTER }} />
          {columns.map((c) => (
            <div
              key={c.room}
              title={c.room}
              className="shrink-0 px-3 py-2.5 border-l border-dashed border-gray-200 text-sm text-gray-800 truncate"
              style={{ width: c.width }}
            >
              {c.room}
            </div>
          ))}
        </div>

        <div className="flex" style={{ height }}>
          <div className="sticky left-0 z-10 bg-white shrink-0" style={{ width: GUTTER }}>
            {hours.map((m) => (
              <span
                key={m}
                className="absolute left-3 sm:left-4 pt-2 text-xs sm:text-sm text-gray-800 whitespace-nowrap"
                style={{ top: (m - bounds.start) * PX_PER_MIN }}
              >
                {formatMinutes(m)}
              </span>
            ))}
          </div>

          {columns.map((c) => (
            <div
              key={c.room}
              className="relative shrink-0 border-l border-dashed border-gray-200"
              style={{ width: c.width }}
            >
              {hours.map((m) => (
                <div
                  key={m}
                  className="absolute inset-x-0 border-t border-dashed border-gray-200"
                  style={{ top: (m - bounds.start) * PX_PER_MIN }}
                />
              ))}
              {c.blocks.map((b) => (
                <div
                  key={b.key}
                  className="absolute inset-x-0"
                  style={{ top: (b.start - bounds.start) * PX_PER_MIN }}
                >
                  <BlockCard block={b} favourites={favourites} onOpen={() => onOpen(b.sessions)} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomGrid;
