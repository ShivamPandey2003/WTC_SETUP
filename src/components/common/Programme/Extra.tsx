import { generateTimeArray, getDateRange, getDayMonthRange } from "@/lib/extra";
import { cn } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import EventModal from "./EventModal";

const Extra = () => {
  const { Programmes } = useSelector((state: RootState) => state.ExtraSlice);
  const [seleted, setSelected] = React.useState<string|null>("")
  const [positions, setPositions] = React.useState<
    Record<string, { top: number; height: number }>
  >({});
  const ShortDates = getDayMonthRange(
    Programmes.start_date,
    Programmes.end_date
  );
  const Dates = getDateRange(Programmes.start_date, Programmes.end_date);
  const Times = generateTimeArray(Programmes.start_time, Programmes.end_time);

  const timeRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  function getPxDistance(start: string, end: string) {
    const startEl = timeRefs.current[start];
    const endEl = timeRefs.current[end];
    if (!startEl || !endEl) return null;

    const r1 = startEl.getBoundingClientRect();
    const r2 = endEl.getBoundingClientRect();

    return r2.top - r1.top;
  }

  React.useEffect(() => {
    const pos: Record<string, { top: number; height: number }> = {};

    Dates.forEach((date) => {
      Programmes.data[date].forEach((event) => {
        if (event.type === "normal" && event.start) {
          const height =
            getPxDistance(event.start.slice(0, 5), event.end.slice(0, 5)) ?? 0;
          const top =
            getPxDistance(
              Programmes.start_time.slice(0, 5),
              event.start.slice(0, 5)
            ) ?? 0;
          pos[event.id] = { top: top, height };
        } else if (event.type === "array" && event.Item) {
          event.Item.forEach((Combine) => {
            const height =
              getPxDistance(
                Combine?.start.slice(0, 5),
                Combine?.end.slice(0, 5)
              ) ?? 0;
            const top =
              getPxDistance(
                Programmes.start_time.slice(0, 5),
                Combine?.start.slice(0, 5)
              ) ?? 0;

            pos[event.id] = { top: top, height };
          });
        }
        //   else if (event.type === "extra" && event.start) {
        //     const top = getPxDistance(Dates[0], event.start) ?? 0;
        //     const height = getPxDistance(event.start, event.end) ?? 0;

        //     pos[event.id] = { top, height };
        //   }
      });
    });

    setPositions(pos);
  }, []);


  return (
    <div className="mt-5 flex gap-4">
      <div className="flex flex-col gap-2" style={{ marginTop: `12px` }}>
        <div />
        {Times.map((item) => (
          <div
            key={item}
            className="text-center text-gray-400"
            ref={(el) => {
              timeRefs.current[item] = el;
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex gap-0.5">
        {Dates.map((item, i) => (
          <React.Fragment key={i}>
            <div key={item} className="w-fit min-w-[150px]">
              <div className="text-center mb-1">{ShortDates[i]}</div>
              <div className="flex gap-0.5 w-full">
                <div className="flex flex-col gap-0.5 w-full relative">
                  {[...Programmes.data[item]]
                    .sort((a, b) => a.start.localeCompare(b.start))
                    .map((event, i) => {
                      if (event.type === "normal") {
                        return (
                          <div
                            key={event.id}
                            className={cn(
                              "text-white p-1 rounded flex items-center justify-center text-center text-sm absolute w-[150px] cursor-pointer"
                            )}
                            style={{
                              top: `${positions[event.id]?.top+i || 0}px`,
                              height: `${positions[event.id]?.height || 0}px`,
                              backgroundColor: event.color,
                            }}
                            onClick={()=>setSelected(event.session_id)}
                          >
                            {event.title}
                          </div>
                        );
                      } else if (event.type === "array" && event.Item) {
                        return (
                          <div key={event.id} className="flex gap-px absolute" style={{top: `${positions[event.id]?.top + i || 0}px`,}}>
                            {event.Item.map((row) => (
                              <div
                                key={row.id}
                                className={cn(
                                  "text-white p-1 rounded flex items-center justify-center text-center text-[9px] cursor-pointer"
                                )}
                                style={{
                                  height: `${positions[event.id]?.height || 0}px`,
                                  backgroundColor: row.color,
                                }}
                                onClick={()=>setSelected(row.session_id)}
                              >
                                {row.title}
                              </div>
                            ))}
                          </div>
                        );
                      }
                    })}
                </div>
                {/* {events.map((item) => {
                  if (item.type === "extra") {
                    return (
                      <div
                        className={cn(
                          "w-fit rounded flex items-center justify-center text-white",
                          item.bg
                        )}
                        style={{
                          marginTop: `${positions[item.id]?.top || 0}px`,
                          height: `${positions[item.id]?.height || 0}px`,
                        }}
                      >
                        <span className="rotate-90 inline-block text-xs">
                          ab
                        </span>
                      </div>
                    );
                  }
                })} */}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <EventModal isOpen={Boolean(seleted)} onClose={()=>setSelected(null)} id={seleted as string}/>
    </div>
  );
};

export default Extra;
