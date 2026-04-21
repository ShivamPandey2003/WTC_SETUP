import EventModal from "@/components/common/Programme/EventModal";
import { cn, getContrastTextColor } from "@/lib/utils";
import { useMemo, useState } from "react";
import { color } from "./EventGrid2_v2";

/* ================= CONFIGURATION ================= */
const PX_PER_MIN = 1.6; // Vertical scale (1 hour = 120px)
const BASE_COL_WIDTH = 100; // Width of one lane
const GAP = 6; // Space between cards

const calculateOverlaps = (events: any[]) => {
  if (!events || events.length === 0) return [];

  // 1. PRE-PROCESS: Merge events with same start, end, and category
  const mergedMap = new Map();

  events.forEach((event) => {
    // Get the first category ID as the unique identifier for category
    const catId = Object.keys(event.categories || {})[0] || "no-cat";
    // Create a unique key for grouping
    const mergeKey = `${event.start_time}-${event.end_time}-${catId}`;

    if (mergedMap.has(mergeKey)) {
      const existing = mergedMap.get(mergeKey);
      // Avoid duplicate titles if necessary
      if (!existing.allTitles.includes(event.title)) {
        existing.allTitles.push(event.title);
      }
      // Optional: Store all IDs if you need to trigger multiple things on click
      existing.allIds.push(event.id);
    } else {
      mergedMap.set(mergeKey, {
        ...event,
        allTitles: [event.title], // Store titles in an array
        allIds: [event.id], // Store IDs in an array
      });
    }
  });

  // Convert back to array and sort by start time
  const processedEvents = Array.from(mergedMap.values()).sort(
    (a, b) => timeToMins(a.start_time) - timeToMins(b.start_time),
  );

  // 2. CALC LANES: Standard collision detection on the merged list
  const lanes: any[][] = [];

  processedEvents.forEach((event) => {
    let placed = false;
    const eventStart = timeToMins(event.start_time);

    for (let i = 0; i < lanes.length; i++) {
      const lastEventInLane = lanes[i][lanes[i].length - 1];
      if (eventStart >= timeToMins(lastEventInLane.end_time)) {
        lanes[i].push(event);
        event.laneIndex = i;
        placed = true;
        break;
      }
    }

    if (!placed) {
      event.laneIndex = lanes.length;
      lanes.push([event]);
    }
  });

  // 3. ATTACH TOTALS: Set the total lanes for width calculations
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
      const positioned = calculateOverlaps(events);
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
    const lastVisibleType = [...types].reverse().find(type => data[type]?.length > 0);
  return types.map((str: any) => {
    // 1. Get events for this track or default to empty array
    const rawEvents = data[str] || [];

    // 2. Calculate overlaps (Ensure calculateOverlaps handles empty arrays)
    const New_data: any[] = calculateOverlaps(rawEvents);

    // 3. Safe Width Calculation: Default to 1 lane if no events
    const totalLanes = New_data.length > 0 ? New_data[0].totalLanesCount : 1;
    const columnWidth = totalLanes * BASE_COL_WIDTH;

    const hasData = rawEvents.length > 0;
    const isLastTypeWithData = str === lastVisibleType;

    if (!rawEvents.length) return;

    return (
      <div
        key={str}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="day-column"
        style={{
          width: `${columnWidth}px`,
          minWidth: `${columnWidth}px`, // Added min-width to prevent shrinking
          position: "relative", // Ensure absolute events position correctly
          backgroundColor:
            isAnyColumnHovered && !isThisColumnHovered
              ? "rgba(0,0,0,0.05)"
              : "transparent",
          borderRight: hasData && isLastTypeWithData ? "2px solid #ddd" : "none"
        }}
      >
        {/* Render Grid Lines regardless of data */}
        {Array.from({
          length: Math.ceil(height / (60 * PX_PER_MIN)) + 1,
        }).map((_, i) => (
          <div
            key={i}
            className="grid-line"
            style={{ top: `${i * 60 * PX_PER_MIN}px` }}
          />
        ))}

        {/* 4. Render events if they exist */}
        {New_data.map((event, i) => {
          const start = timeToMins(event.start_time);
          const end = timeToMins(event.end_time);
          const top = (start - globalStartMins) * PX_PER_MIN;
          const cardHeight = (end - start) * PX_PER_MIN;
          const duration = end - start;

          const laneWidthPct = 100 / event.totalLanesCount;
          const leftOffset = event.laneIndex * laneWidthPct;
          // Safe Color Access
          const firstCatKey = Object.keys(event.categories || {})[0];
          const eventColor =
            event.categories?.[firstCatKey]?.color || color[event.type];
          const shouldBeGray = isAnyColumnHovered && !isThisColumnHovered;

          return (
            <div
              key={event.id || i}
              onClick={() => setSelected({ id: event.id, date: date, type:event.type })}
              className="event-card cursor-pointer"
              style={{
                top: `${top + GAP}px`,
                height: `${cardHeight - GAP * 2}px`, // Subtracted GAP for spacing
                width:
                  event.space_type === "full"
                    ? `calc(100% + ${columnWidth}px - 106px)`
                    : `calc(${laneWidthPct}% - ${GAP * 2}px)`,
                left:
                  event.space_type !== "full"
                    ? `calc(${leftOffset}% + ${GAP}px)`
                    : 0,
                backgroundColor: shouldBeGray ? "#d1d5db" : eventColor,
                position: "absolute", // CRITICAL for timeline rendering
                zIndex: event.space_type === "full" ? 3 : 10,
              }}
            >
              <div className="event-inner p-1">
                <div
                  className={cn(
                    "event-title text-[11px] font-bold",
                    duration < 30 && "truncate max-w-[70px]",
                  )}
                  style={{ color: getContrastTextColor(eventColor) }}
                >
                  {event.title}
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
    type:string
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
