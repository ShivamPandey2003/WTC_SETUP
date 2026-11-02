import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { AvatarStack } from "../V2_ProgrammeShared/ProgrammeUI";
import {
  getCategory,
  getTimeBounds,
  layoutBlocks,
  stageLabel,
  type SessionBlock,
} from "../V2_ProgrammeShared/programmeUtils";
import type { Favourites } from "../V2_ProgrammeShared/useFavourites";

type Props = {
  sessions: Programme[];
  stages: string[]; // row order
  favourites: Favourites;
  onOpen: (sessions: Programme[]) => void;
};

const PX_PER_MIN = 6; // 1 hour = 360px
const LABEL_COL = 40;
const LANE_HEIGHT = 156;
const GAP = 6;

const pad = (n: number) => String(n).padStart(2, "0");
const hhmm = (mins: number) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

const BlockCard = ({ block, favourites }: { block: SessionBlock; favourites: Favourites }) => {
  const first = block.sessions[0];
  const cat = getCategory(first);
  const group = block.sessions.length > 1;
  const width = (block.end - block.start) * PX_PER_MIN - GAP * 2;
  const compact = width < 120;
  const speakers = block.sessions.flatMap((s) => s.speakers);
  const anyFav = block.sessions.some((s) => favourites.isFavourite(s.id));

  return (
    <div className="h-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.08)] p-3 flex flex-col overflow-hidden hover:shadow-[0_4px_14px_rgba(0,0,0,0.14)] transition-shadow">
      <div className="flex gap-2 min-h-0">
        <span className="w-[3px] shrink-0 rounded-full" style={{ background: cat.color }} />
        <p
          className={cn(
            "flex-1 text-gray-900 leading-snug",
            compact ? "text-[10px] line-clamp-5" : "text-xs line-clamp-4",
          )}
        >
          {group && <span className="font-semibold">{block.sessions.length} sessions · </span>}
          {group ? cat.name || first.title : first.title}
        </p>
        {anyFav && <Heart className="size-3.5 shrink-0 fill-rose-500 text-rose-500" />}
      </div>
      {!compact && (
        <div className="mt-auto flex items-center gap-2 min-w-0 pt-2">
          {speakers.length > 0 ? (
            <>
              <AvatarStack speakers={speakers} max={group ? 3 : 2} />
              {!group && (
                <span className="text-[11px] text-gray-600 truncate">{speakers[0].fullname}</span>
              )}
            </>
          ) : (
            <span className="text-[11px] text-gray-400">
              {hhmm(block.start)} - {hhmm(block.end)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/** Stages as rows, time running left → right. */
const TracksGrid = ({ sessions, stages, favourites, onOpen }: Props) => {
  const bounds = getTimeBounds(sessions);
  const hours = Array.from(
    { length: (bounds.end - bounds.start) / 60 },
    (_, i) => bounds.start + i * 60,
  );
  const width = (bounds.end - bounds.start) * PX_PER_MIN;

  const rows = stages
    .map((stage) => ({ stage, ...layoutBlocks(sessions.filter((s) => s.type === stage)) }))
    .filter((r) => r.blocks.length > 0);

  return (
    <div className="overflow-auto max-h-[72vh] sm:max-h-[calc(100vh-280px)] bg-gray-50 rounded-xl -mx-4 sm:mx-0">
      <div style={{ width: LABEL_COL + width }}>
        <div className="sticky top-0 z-20 flex bg-gray-50/95 backdrop-blur border-b border-gray-200">
          <div className="sticky left-0 z-30 bg-gray-50 shrink-0" style={{ width: LABEL_COL }} />
          <div className="relative h-9" style={{ width }}>
            {hours.map((m) => (
              <span
                key={m}
                className="absolute top-2.5 text-xs text-gray-500 pl-2"
                style={{ left: (m - bounds.start) * PX_PER_MIN }}
              >
                {hhmm(m)}
              </span>
            ))}
          </div>
        </div>

        {rows.map((row) => (
          <div key={row.stage} className="flex border-b border-gray-200 last:border-b-0">
            <div
              className="sticky left-0 z-10 shrink-0 bg-gray-50 border-r border-gray-200 grid place-items-center"
              style={{ width: LABEL_COL }}
            >
              <span className="[writing-mode:vertical-rl] rotate-180 text-xs text-gray-600 whitespace-nowrap py-3">
                {stageLabel(row.stage)}
              </span>
            </div>
            <div className="relative" style={{ width, height: row.lanes * LANE_HEIGHT + GAP }}>
              {hours.map((m) => (
                <div
                  key={m}
                  className="absolute inset-y-0 border-l border-gray-200"
                  style={{ left: (m - bounds.start) * PX_PER_MIN }}
                />
              ))}
              {row.blocks.map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => onOpen(b.sessions)}
                  title={b.sessions.length > 1 ? `${b.sessions.length} sessions` : b.sessions[0].title}
                  className="absolute text-left"
                  style={{
                    left: (b.start - bounds.start) * PX_PER_MIN + GAP,
                    width: Math.max((b.end - b.start) * PX_PER_MIN - GAP * 2, 24),
                    top: b.lane * LANE_HEIGHT + GAP,
                    height: LANE_HEIGHT - GAP,
                  }}
                >
                  <BlockCard block={b} favourites={favourites} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TracksGrid;
