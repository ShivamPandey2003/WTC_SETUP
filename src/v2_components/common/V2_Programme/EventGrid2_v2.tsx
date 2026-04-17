import EventModal from "@/components/common/Programme/EventModal";
import { cn } from "@/lib/utils";
import React, { useMemo, useState } from "react";

let color: Record<string, string> = {
  "e-poster": "#084F41",
  "technical track 2": "#1B967C",
  "technical track 1": "#E4F223",
  "technical track 3": "#F2B705",
  "technical track 4": "#F28D35",
  "technical track 5": "#C8553D",
  general: "#F2545B",
};
const PX_PER_MIN = 2; // Vertical scale (1 hour = 120px)
const BASE_COL_WIDTH = 100; // Width of one lane
const GAP = 6; // Space between cards

const calculateDayLayout = (dayEvents: ProgrammeTypeList[]) => {
  const groups = new Map();

  // 1. Grouping Logic
  dayEvents.forEach((event) => {
    // Safely extract category info
    const catData = event.type;

    const groupKey = `${event.start_time}-${event.end_time}-${catData}`;

    if (groups.has(groupKey)) {
      const existing = groups.get(groupKey)!;
      if (!existing.titles.includes(event.type)) {
        existing.titles.push(event.type);
      }
    } else {
      const [sh, sm] = event.start_time.split(":").map(Number);
      const [eh, em] = event.end_time.split(":").map(Number);

      groups.set(groupKey, {
        // id: event.sessionId,
        startMins: sh * 60 + sm,
        endMins: eh * 60 + em,
        start_time: event.start_time,
        end_time: event.end_time,
        titles: [event.type],
        categoryName: catData,
        catColor: color[catData] || "#1B967C",
        laneIndex: 0,
      });
    }
  });

  // Sort events by start time
  const groupedEvents = Array.from(groups.values()).sort(
    (a, b) => a.startMins - b.startMins,
  );

  // 2. Collision Detection (Lanes)
  const lanes: any[][] = [];

  groupedEvents.forEach((event) => {
    let placed = false;

    for (let i = 0; i < lanes.length; i++) {
      const lane = lanes[i];
      const lastInLane = lane[lane.length - 1];

      // If the event starts after or exactly when the last one in this lane ends
      if (event.startMins >= lastInLane.endMins) {
        lane.push(event);
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

  return {
    events: groupedEvents,
    totalLanes: Math.max(1, lanes.length),
  };
};

const timeToMins = (timeStr: string) => {
  const [h, m] = timeStr.split(":").map(Number);

  return h * 60 + m;
};

function DayColumn({
  data,
  globalStartMins,
  height,
  setSelected,
  date,
  isAnyColumnHovered,
  isThisColumnHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  data: any;
  globalStartMins: number;
  height: number;
  setSelected: React.Dispatch<
    React.SetStateAction<{
      id: string;
      date: string;
      type: string;
    } | null>
  >;
  date: string;
  isAnyColumnHovered: boolean;
  isThisColumnHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const columnWidth = data.totalLanes * BASE_COL_WIDTH;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="day-column"
      style={{
        width: columnWidth,
        minWidth: columnWidth,
        backgroundColor:
          isAnyColumnHovered && !isThisColumnHovered
            ? "rgba(0,0,0,0.02)"
            : "transparent",
      }}
    >
      {Array.from({ length: Math.ceil(height / (60 * PX_PER_MIN)) + 1 }).map(
        (_, i) => (
          <div
            key={i}
            className="grid-line"
            style={{ top: `${i * 60 * PX_PER_MIN}px` }}
          />
        ),
      )}

      {data.events.map((event: any) => {
        const durationMins = event.endMins - event.startMins;
        const top = (event.startMins - globalStartMins) * PX_PER_MIN;
        const height = (event.endMins - event.startMins) * PX_PER_MIN;
        const laneWidthPct = 100 / data.totalLanes;
        const leftPct = event.laneIndex * laneWidthPct;
        const shouldBeGray = isAnyColumnHovered && !isThisColumnHovered;

        return (
          <div
            key={event.id}
            onClick={() => setSelected({ id: event.id, date: date, type: event.categoryName })}
            className="event-card cursor-pointer"
            style={{
              top: `${top + GAP}px`,
              height: `${height - GAP * 2}px`,
              width: `calc(${laneWidthPct}% - ${GAP * 2}px)`,
              left: `calc(${leftPct}% + ${GAP}px)`,
              backgroundColor: shouldBeGray ? "gray" : event.catColor,
              fontSize: `${durationMins < 30 ? "7px" : "13px"}`,
              lineHeight: durationMins < 30 ? 1.2 : undefined,
            }}
          >
            <div className="event-inner">
              {/* <span className="event-time">{event.start_time} - {event.end_time}</span> */}
              <div
                className={cn(
                  "event-title max-w-[70px]",
                  durationMins < 30 && "truncate",
                  height - GAP * 2 > 1050 && "rotate-90",
                )}
              >
                {event.categoryName}
              </div>
              {/* {event.titles.map((title, i) => (
                <div key={i} className="event-title">{title}</div>
              ))} */}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function EventGrid2_v2({
  programmeData,
  selectedCategories,
}: {
  programmeData: ProgrammeTypeList[];
  selectedCategories: string[];
}) {
  const [seleted, setSelected] = useState<{
    id: string;
    date: string;
    type: string;
  } | null>(null);
  const { dates, startHour, endHour, globalStartMins } =
    useMemo(() => {
      const uniqueDates = [...new Set(programmeData.map((d) => d.date))].sort();

      let minMins = 1440; // End of day
      let maxMins = 0; // Start of day

      programmeData.forEach((event) => {
        const start = timeToMins(event.start_time);
        const end = timeToMins(event.end_time);
        if (start < minMins) minMins = start;
        if (end > maxMins) maxMins = end;
      });

      // Floor the start hour and Ceil the end hour for clean padding
      const sHour = Math.floor(minMins / 60);
      const eHour = Math.ceil(maxMins / 60);

      return {
        dates: uniqueDates,
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

    const layoutData = useMemo(() => {
      const map: any = {};
      dates.forEach((date) => {
        const dayEvents = programmeData
          .filter((e) => e.date === date)
        map[date] = calculateDayLayout(dayEvents);
      });
      return map;
    }, [dates, selectedCategories]);

  const gridHeight = (endHour - startHour) * 60 * PX_PER_MIN;

  return (
    <>
      <div className="calendar-outer-wrapper">
        <div className="calendar-scroll-container">
          {/* Fixed Top-Left */}
          <div className="corner-cell" />

          {/* Sticky Headers */}
          <div className="header-row">
            {dates.map((date) => {
                const width = layoutData[date].totalLanes * BASE_COL_WIDTH;
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
            {dates.map((date) => (
              <DayColumn
                setSelected={setSelected}
                key={date}
                data={layoutData[date]}
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
