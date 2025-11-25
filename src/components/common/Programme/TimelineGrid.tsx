import clsx from "clsx";
import SessionCard from "./SessionCard";
import { buildTimeline, toMin, type Placeholder } from "@/lib";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import NoData from "@/components/global/NoData";

export default function TimelineGrid() {
  const { selectedDate, filterData } = useSelector(
    (state: RootState) => state.Global_Slice
  );
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9;
    return {
      display: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`,
      startHour: hour,
      endHour: hour + 1,
      timeRange: `${hour}:00 - ${hour + 1}:00`,
    };
  });

  // console.log(filterData[selectedDate])

  const Data = buildTimeline(filterData[selectedDate]);

  function isSession(item: Programme | Placeholder): item is Programme {
    return "start_time" in item;
  }

  const filtered = timeSlots.filter((slot) =>
    filterData[selectedDate].some((event) => {
      const eventHour = parseInt(
        event.start_time.split(":")[0],
        10
      );
      return eventHour === slot.startHour;
    })
  );

  if (Object.keys(Data).length === 0) {
    return (
      <div className="flex items-center justify-center">
        <NoData />
      </div>
    );
  }

  return (
    <div>
      {filtered.map((t, index) => {
        const group = Data[index as keyof typeof Data] || [];
        return (
          <div key={t.display} className="flex h-[170px]">
            <div className="w-32 border-r border-gray-200">{t.display}</div>
            <div className="flex-1 relative border-t border-gray-200">
              {group.slice(0, 4).map((s, i) => {
                if (!isSession(s)) {
                  return null;
                }
                const TOP_MARGIN = roundMinutes(
                  Number(roundTime(s.start_time).split(":")[1])
                );
                return (
                  <div
                    key={i}
                    className={clsx(
                      "absolute right-0 w-[250px] z-50",
                      i === 0
                        ? "left-1"
                        : i === 1
                        ? `left-2/7`
                        : i === 2
                        ? "left-4/7"
                        : "left-6/7"
                    )}
                    style={{
                      top:
                        TOP_MARGIN === 0
                          ? "10px"
                          : TOP_MARGIN === 15
                          ? "40px"
                          : TOP_MARGIN === 30
                          ? "70px"
                          : "100px",
                      height: `${getDurationHeight(
                        s.start_time,
                        s.end_time
                      )}px`,
                    }}
                  >
                    <SessionCard
                      session={s}
                      className={`h-full max-h-[${getDurationHeight(
                        s.start_time,
                        s.end_time
                      )}px] py-1.5 px-2`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getDurationHeight(start: any, end: any) {
  return (toMin(end) - toMin(start)) * 2.5;
}

function roundMinutes(min: number): number {
  if (min < 5) return 0;
  if (min < 20) return 15;
  if (min < 35) return 30;
  if (min < 50) return 45;
  return 0;
}

function roundTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const rounded = roundMinutes(m);

  if (rounded === 60) {
    return `${String(h + 1).padStart(2, "0")}:00`;
  }

  return `${String(h).padStart(2, "0")}:${String(rounded).padStart(2, "0")}`;
}
