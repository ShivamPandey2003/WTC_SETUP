import EventModal from "@/components/common/Programme/EventModal";
import { cn, getContrastTextColor } from "@/lib/utils";
import { useMemo, useState } from "react";
import { color } from "./EventGrid2_v2";


/* ================= CONFIGURATION ================= */
const PX_PER_MIN = 1.6; // Vertical scale (1 hour = 120px)
const BASE_COL_WIDTH = 100; // Width of one lane
const GAP = 6; // Space between cards

const calculateOverlaps = (events: Programme[], typesOrder: string[] = []) => {
  if (!events || events.length === 0) return [];

  /**
   * =========================================================
   * STEP 1: GROUP EVENTS BY CATEGORY
   * =========================================================
   */
  const groupedByCategory = new Map<string, Programme[]>();

  events.forEach((event) => {
    const catId = Object.keys(event.categories || {})[0] || "no-cat";

    if (!groupedByCategory.has(catId)) {
      groupedByCategory.set(catId, []);
    }

    groupedByCategory.get(catId)!.push(event);
  });

  /**
   * =========================================================
   * STEP 2: MERGE CONTINUOUS EVENTS
   * =========================================================
   */
  const mergedEvents: any[] = [];

  groupedByCategory.forEach((categoryEvents) => {
    const sorted = [...categoryEvents].sort(
      (a, b) => timeToMins(a.start_time) - timeToMins(b.start_time),
    );

    let current: any = null;

    sorted.forEach((event) => {
      if (!current) {
        current = {
          ...event,
          allTitles: [event.title],
          allIds: [event.id],
        };

        return;
      }

      const currentEnd = timeToMins(current.end_time);

      const nextStart = timeToMins(event.start_time);

      const nextEnd = timeToMins(event.end_time);

      /**
       * MERGE IF:
       * - overlapping
       * - continuous
       */
      const shouldMerge = nextStart <= currentEnd || nextStart === currentEnd;

      if (shouldMerge) {
        if (nextEnd > currentEnd) {
          current.end_time = event.end_time;
        }

        if (!current.allTitles.includes(event.title)) {
          current.allTitles.push(event.title);
        }

        current.allIds.push(event.id);
      } else {
        mergedEvents.push(current);

        current = {
          ...event,
          allTitles: [event.title],
          allIds: [event.id],
        };
      }
    });

    if (current) {
      mergedEvents.push(current);
    }
  });

  /**
   * =========================================================
   * STEP 3: DYNAMIC TYPE ORDER
   * =========================================================
   */
  const categoryOrder = typesOrder.reduce(
    (acc: Record<string, number>, type: string, index: number) => {
      acc[type] = index;

      return acc;
    },
    {},
  );

  /**
   * =========================================================
   * STEP 4: SORT EVENTS
   * =========================================================
   */
  const processedEvents = mergedEvents.sort((a, b) => {
    const typeCompare =
      (categoryOrder[a.type] ?? 999) - (categoryOrder[b.type] ?? 999);

    if (typeCompare !== 0) return typeCompare;

    return timeToMins(a.start_time) - timeToMins(b.start_time);
  });

  /**
   * =========================================================
   * STEP 5: CATEGORY-AWARE LEFT COMPACT LANE PACKING
   * =========================================================
   */

  const lanes: any[][] = [];

  /**
   * Keep track of the LAST lane used by category
   */
  const categoryLaneMap = new Map<string, number>();

  /**
   * Sort by start time
   */
  processedEvents.sort((a, b) => {
    return timeToMins(a.start_time) - timeToMins(b.start_time);
  });

  processedEvents.forEach((event) => {
    const eventStart = timeToMins(event.start_time);
    const eventEnd = timeToMins(event.end_time);

    const categoryKey = Object.keys(event.categories || {})[0] || "no-cat";

    /**
     * Try reusing SAME CATEGORY lane first
     */
    const preferredLane = categoryLaneMap.get(categoryKey);

    const canFitInLane = (laneIndex: number) => {
      const lane = lanes[laneIndex] || [];

      return !lane.some((laneEvent) => {
        const laneStart = timeToMins(laneEvent.start_time);

        const laneEnd = timeToMins(laneEvent.end_time);

        return eventStart < laneEnd && eventEnd > laneStart;
      });
    };

    let assignedLane = -1;

    /**
     * PRIORITY 1:
     * Reuse previous category lane
     */
    if (preferredLane !== undefined && canFitInLane(preferredLane)) {
      assignedLane = preferredLane;
    } else {
      /**
       * PRIORITY 2:
       * Find first available lane
       */
      let laneIndex = 0;

      while (true) {
        if (canFitInLane(laneIndex)) {
          assignedLane = laneIndex;
          break;
        }

        laneIndex++;
      }
    }

    /**
     * Create lane if needed
     */
    if (!lanes[assignedLane]) {
      lanes[assignedLane] = [];
    }

    lanes[assignedLane].push(event);

    event.laneIndex = assignedLane;

    /**
     * Remember lane for this category
     */
    categoryLaneMap.set(categoryKey, assignedLane);
  });

  /**
   * =========================================================
   * STEP 6: TOTAL LANE COUNT
   * =========================================================
   */
  processedEvents.forEach((ev) => {
    ev.totalLanesCount = lanes.length;
  });

  return processedEvents;
};

const getDayWidth = (dayData: Record<string, any[]>, types: string[]) => {
  let totalLanesForDay = 0;

  types.forEach((typeKey) => {
    const events = dayData[typeKey] || [];
    if (events.length === 0) {
      // Even if empty, the column exists (1 lane wide)
    } else {
      // Use your overlap function to see how many lanes this specific type needs
      const positioned = calculateOverlaps(events, types);
      const lanesInThisType =
        positioned.length > 0 ? positioned[0].totalLanesCount : 1;
      totalLanesForDay += lanesInThisType;
    }
  });

  return totalLanesForDay * BASE_COL_WIDTH;
};

const timeToMins = (timeStr: string) => {
  const [h, m] = timeStr.split(":").map(Number);

  return h * 60 + m;
};
/* ================= COMPONENTS ================= */

function DayColumn({
  types,
  data,
  globalStartMins,
  height,
  setSelected,
  date,
  isAnyColumnHovered,
  isThisColumnHovered,
  onMouseEnter,
  onMouseLeave,
}: any) {
  /**
   * ENSURE FIXED COLUMN ORDER
   * general -> tech t1 -> tech t2 -> ...
   */
  types = [...types];

  /**
   * DYNAMIC ORDERING FROM API
   * Keeps exact sequence received from API
   */
  const typePriority = types.reduce(
    (acc: Record<string, number>, type: string, index: number) => {
      acc[type] = index;

      return acc;
    },
    {},
  );

  types.sort((a: string, b: string) => {
    return (typePriority[a] ?? 999) - (typePriority[b] ?? 999);
  });

  const lastVisibleType = [...types]
    .reverse()
    .find((type) => data[type]?.length > 0);

  // 1. DYNAMICALLY CALCULATE TOTAL DAY WIDTH
  const columnWidths = types.map((str: any) => {
    const events = data[str] || [];
    const overlaps = calculateOverlaps(events, types);
    const lanes = overlaps.length > 0 ? overlaps[0].totalLanesCount : 1;

    return events.length > 0 ? lanes * BASE_COL_WIDTH : 0;
  });

  const totalDayWidth = columnWidths.reduce((a: number, b: number) => a + b, 0);

  return types.map((str: any, index: number) => {
    const rawEvents = data[str] || [];

    const New_data: any[] = calculateOverlaps(rawEvents, types);

    const columnWidth = columnWidths[index];

    const currentColumnLeftOffset = columnWidths
      .slice(0, index)
      .reduce((a: number, b: number) => a + b, 0);

    const hasData = rawEvents.length > 0;

    const isLastTypeWithData = str === lastVisibleType;

    if (!rawEvents.length) return null;

    return (
      <div
        key={str}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="day-column"
        style={{
          width: `${columnWidth}px`,
          minWidth: `${columnWidth}px`,
          position: "relative",
          backgroundColor:
            isAnyColumnHovered && !isThisColumnHovered
              ? "rgba(0,0,0,0.05)"
              : "transparent",
          borderRight:
            hasData && isLastTypeWithData ? "2px solid #ddd" : "none",
        }}
      >
        {/* Grid Lines */}
        {Array.from({
          length: Math.ceil(height / (60 * PX_PER_MIN)) + 1,
        }).map((_, i) => (
          <div
            key={i}
            className="grid-line"
            style={{ top: `${i * 60 * PX_PER_MIN}px` }}
          />
        ))}

        {New_data.map((event, i) => {
          const start = timeToMins(event.start_time);

          const end = timeToMins(event.end_time);

          const top = (start - globalStartMins) * PX_PER_MIN;

          const cardHeight = (end - start) * PX_PER_MIN;

          const duration = end - start;

          const laneWidthPct = 100 / event.totalLanesCount;

          const leftOffset = event.laneIndex * laneWidthPct;

          const firstCatKey = Object.keys(event.categories || {})[0];

          const eventColor =
            event.categories?.[firstCatKey]?.color || color[event.type];

          const shouldBeGray = isAnyColumnHovered && !isThisColumnHovered;

          const Title =
            event.categories?.[firstCatKey]?.name || event.title || event.type;

          const isFull = event.space_type === "full";

          return (
            <div
              key={event.id || i}
              onClick={() =>
                setSelected({
                  id: event.id,
                  date: date,
                  type: event.type,
                })
              }
              className={cn("event-card cursor-pointer", isFull? "z-1 hover:z-[99]":"z-10")}
              style={{
                position: "absolute",
                top: `${top + GAP}px`,
                height: `${cardHeight - GAP * 2}px`,
                backgroundColor: shouldBeGray ? "#d1d5db" : eventColor,

                width: isFull
                  ? `${totalDayWidth - currentColumnLeftOffset - GAP}px`
                  : `calc(${laneWidthPct}% - ${GAP * 2}px)`,

                left: isFull ? `0px` : `calc(${leftOffset}% + ${GAP}px)`,
              }}
            >
              <div className="event-inner p-1 w-full h-full min-w-0 flex items-center justify-center">
                <div
                  className={cn(
                    "event-title text-[11px] text-center line-clamp-4",
                    cardHeight - GAP * 2 > 800
                      ? "-rotate-90"
                      : duration < 30
                        ? "truncate max-w-[70px]"
                        : "font-bold whitespace-normal break-words",
                  )}
                  style={{
                    color: shouldBeGray
                      ? "#fff"
                      : getContrastTextColor(eventColor),
                      width:cardHeight - GAP * 2 > 800 ?`${cardHeight - GAP * 2}px`:"auto"
                  }}
                >
                  {Title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  });
}

export default function EventGrid3_v2({
  programmeData,
}: {
  programmeData: GlobalProgrammeListResponse3_v2_Response_T;
  selectedCategories: string[];
}) {
  const [seleted, setSelected] = useState<{
    id: string;
    date: string;
    type: string;
  } | null>(null);
  const { startHour, endHour, globalStartMins } = useMemo(() => {
    let minMins = 1440; // End of day
    let maxMins = 0; // Start of day

    Object.entries(programmeData.data).forEach(([, events]) => {
      Object.entries(events).forEach(([, evs]) => {
        evs.forEach((ev) => {
          const evStartMins = timeToMins(ev.start_time);
          const evEndMins = timeToMins(ev.end_time);
          if (evStartMins < minMins) minMins = evStartMins;
          if (evEndMins > maxMins) maxMins = evEndMins;
        });
      });
    });

    // Floor the start hour and Ceil the end hour for clean padding
    const sHour = Math.floor(minMins / 60);
    const eHour = Math.ceil(maxMins / 60);

    return {
      startHour: sHour,
      endHour: eHour,
      globalStartMins: sHour * 60,
    };
  }, [programmeData]);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const timeLabels = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => `${startHour + i}:00`,
  );

  const gridHeight = (endHour - startHour) * 60 * PX_PER_MIN;

  return (
    <>
      <div className="calendar-outer-wrapper">
        <div className="calendar-scroll-container">
          {/* Fixed Top-Left */}
          <div className="corner-cell" />

          {/* Sticky Headers */}
          <div className="header-row">
            {programmeData.dates.map((date) => {
              const width = getDayWidth(
                programmeData.data[date],
                programmeData.types,
              );
              return (
                <div
                  key={date}
                  className="day-header capitalize"
                  style={{ width, minWidth: width }}
                >
                  {new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    timeZone: "UTC",
                  })}
                </div>
              );
            })}
          </div>

          {/* Sticky Time Gutter */}
          <div className="time-gutter">
            {timeLabels.map((time) => (
              <div key={time} className="time-label">
                <span>{time}</span>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="calendar-grid">
            {programmeData.dates.map((date) => (
              <DayColumn
                types={programmeData.types}
                setSelected={setSelected}
                key={date}
                data={programmeData.data[date]}
                date={date}
                globalStartMins={globalStartMins}
                height={gridHeight}
                isAnyColumnHovered={hoveredDate !== null}
                isThisColumnHovered={hoveredDate === date}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
              />
            ))}
          </div>
        </div>
      </div>
      {seleted && (
        <EventModal
          isOpen={Boolean(seleted)}
          onClose={() => setSelected(null)}
          data={seleted!}
        />
      )}
    </>
  );
}
