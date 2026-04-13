import React from "react";
// import Programmes from "@/data/Programmes";
import { generateTimeArray, getDateRange, type OutputItem } from "@/lib/extra";
import { cn, convertToDate, Height_OBJ } from "@/lib/utils";
import { formatDates_V2 } from "@/lib";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import EventModal from "@/components/common/Programme/EventModal";

type Props = {
  selectedCategories: string[];
};

const EventGrid = ({ selectedCategories }: Props) => {
  const { Programmes } = useSelector((state: RootState) => state.ExtraSlice);
  const Dates = getDateRange(Programmes.start_date, Programmes.end_date);
  const Times = generateTimeArray(Programmes.start_time, Programmes.end_time);
  const timeRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const [seleted, setSelected] = React.useState<{
    id: string;
    date: string;
  } | null>(null);
  // const [selectedCategory, setSelectedCategory] = React.useState<string | null | string[]>(null);
  const [positions, setPositions] = React.useState<
    Record<string, { top: number; height: number }>
  >({});
  const DateList = formatDates_V2(Dates);

  function getPxDistance(start: string, end: string) {
    const startEl = timeRefs.current[start];
    const endEl = timeRefs.current[end];
    if (startEl && endEl) {
      const r1 = startEl.getBoundingClientRect();
      const r2 = endEl.getBoundingClientRect();
      return r2.top - r1.top;
    }

    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const diff = toMinutes(end) - toMinutes(start);
    const PX_PER_MINUTE = 2;

    return diff * PX_PER_MINUTE;
  }

  const eventHasFilteredCategory = (event: OutputItem, filters: string[]) => {
    if (filters.length === 0) return true;

    if (event.type === "array") {
      return event.Item.some((e) => !filters.includes(e.categoryId));
    }

    return !filters.includes(String(event.categoryId));
  };

  React.useLayoutEffect(() => {
    const pos: Record<string, { top: number; height: number }> = {};

    Dates.forEach((date) => {
      Programmes.data[date as keyof typeof Programmes.data].forEach((e) => {
        e.forEach((event) => {
          if (
            event.type === "normal" ||
            (event.type === "extra" && event.start)
          ) {
            const height =
              getPxDistance(event.start.slice(0, 5), event.end.slice(0, 5)) ??
              0;
            const top =
              getPxDistance(
                Programmes.start_time.slice(0, 5),
                event.start.slice(0, 5),
              ) ?? 0;
            pos[event.id] = { top: top, height };
          } else if (event.type === "array" && event.Item) {
            event.Item.forEach((Combine) => {
              const height =
                getPxDistance(
                  Combine?.start.slice(0, 5),
                  Combine?.end.slice(0, 5),
                ) ?? 0;
              const top =
                getPxDistance(
                  Programmes.start_time.slice(0, 5),
                  Combine?.start.slice(0, 5),
                ) ?? 0;

              pos[event.id] = { top: top, height };
            });
          } else if (event.type === "merge" && event.start) {
            const height =
              getPxDistance(event.start.slice(0, 5), event.end.slice(0, 5)) ??
              0;
            const top =
              getPxDistance(
                Programmes.start_time.slice(0, 5),
                event.start.slice(0, 5),
              ) ?? 0;
            pos[event.id] = { top: top, height };
          }
          //   else if (event.type === "extra" && event.start) {
          //     const top = getPxDistance(Dates[0], event.start) ?? 0;
          //     const height = getPxDistance(event.start, event.end) ?? 0;

          //     pos[event.id] = { top, height };
          //   }
        });
      });
    });

    setPositions(pos);
  }, [Programmes]);

  return (
    <div className="overflow-auto max-h-[calc(100vh-130px)]">
      <div
        className="grid"
        style={{ gridTemplateColumns: "auto auto", width: "max-content" }}
      >
        {/* Corner: sticky top-left, covers intersection */}
        <div className="sticky top-0 left-0 z-[60] bg-[#F2F2F2] border-r border-gray-400 px-4" />

        {/* Date headers: sticky top, scrolls horizontally with content */}
        <div className="sticky top-0 z-40 flex bg-[#F2F2F2] pl-4">
          {DateList.map((item, i) => {
            const date = convertToDate(item);
            const columns = Programmes.data[date];
            const height =
              Height_OBJ[columns?.length as keyof typeof Height_OBJ] || "200";
            return (
              <div
                key={i}
                className="text-center border-r px-1 border-r-gray-300"
                style={{ minWidth: `${height}px` }}
              >
                <h3>
                  {item.weekday}, {item.dayMonth}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Time column: sticky left, scrolls vertically with content */}
        <div className="sticky left-0 z-50 flex flex-col space-y-4 px-4 border-r border-gray-400 bg-[#F2F2F2]">
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

        {/* Event grid */}
        <div className="flex pl-4">
          {Dates.map((item, i) => {
            const columns = Programmes.data[item];
            const extraColumn = columns.find((col) =>
              col?.every((item) => item.type === "extra"),
            );
            const normalColumns = columns.filter((col) => col !== extraColumn);
            const columnCount = normalColumns.length || 1;
            const columnWidth = 100 / columnCount;
            const height =
              Height_OBJ[columns?.length as keyof typeof Height_OBJ] || "200";

            return (
              <React.Fragment key={i}>
                <div
                  key={item}
                  className="relative border-r px-1 border-r-gray-300"
                  style={{ minWidth: `${height}px` }}
                >
                  <div className="flex gap-1">
                    {normalColumns.map((event, i) => {
                      return (
                        <div
                          key={i}
                          className="flex flex-col gap-0.5 relative"
                          style={{
                            height: Times.length * 40,
                            width: `${columnWidth}%`,
                          }}
                        >
                          {[...event]
                            .sort((a, b) => a.start.localeCompare(b.start))
                            .filter((event) =>
                              eventHasFilteredCategory(
                                event,
                                selectedCategories,
                              ),
                            )
                            .map((event, i) => {
                              if (event.type === "normal") {
                                return (
                                  <div
                                    key={event.id}
                                    className={cn(
                                      "text-white p-1 rounded-xl flex items-center justify-center text-center text-sm absolute w-full cursor-pointer",
                                    )}
                                    style={{
                                      top: `${positions[event.id]?.top + i * 4 || 0
                                        }px`,
                                      height: `${positions[event.id]?.height || 0}px`,
                                      backgroundColor: event.color,
                                    }}
                                    onClick={() => {
                                      setSelected({
                                        id: event.session_id,
                                        date: item,
                                      });
                                      // setSelectedCategory(event.title);
                                    }}
                                  >
                                    {event.title}
                                  </div>
                                );
                              } else if (event.type === "array" && event.Item) {
                                return (
                                  <div
                                    key={event.id}
                                    className="flex gap-1 absolute"
                                    style={{
                                      top: `${positions[event.id]?.top + i * 2 + 6 ||
                                        0
                                        }px`,
                                    }}
                                  >
                                    {event.Item.map((row) => (
                                      <div
                                        key={row.id}
                                        className={cn(
                                          "text-white p-1 rounded-xl flex items-center justify-center text-center text-[9px] cursor-pointer",
                                        )}
                                        style={{
                                          width: `${90 / event.Item.length}%`,
                                          height: `${positions[event.id]?.height || 0
                                            }px`,
                                          backgroundColor: row.color,
                                        }}
                                        onClick={() =>
                                          setSelected({
                                            id: Array.isArray(row.session_id)
                                              ? row.session_id[0]
                                              : row.session_id,
                                            date: item,
                                          })
                                        }
                                      >
                                        {row.title}
                                      </div>
                                    ))}
                                  </div>
                                );
                              } else if (event.type === "merge") {
                                return (
                                  <div
                                    key={event.id}
                                    className={cn(
                                      "text-white p-1 rounded-xl flex items-center justify-center text-center text-sm absolute w-full cursor-pointer",
                                    )}
                                    style={{
                                      top: `${positions[event.id]?.top + i * 4 || 0
                                        }px`,
                                      height: `${positions[event.id]?.height || 0}px`,
                                      backgroundColor: event.color,
                                    }}
                                    onClick={() =>
                                      setSelected({
                                        id: event.session_id[0],
                                        date: item,
                                      })
                                    }
                                  >
                                    {event.title}
                                  </div>
                                );
                              }
                            })}
                        </div>
                      );
                    })}
                    {extraColumn &&
                      [...extraColumn]
                        .sort((a, b) => a.start.localeCompare(b.start))
                        .map((c) => {
                          if (c.type === "extra") {
                            return (
                              <div
                                key={c.id}
                                className={cn(
                                  "rounded-xl flex w-[30px] items-center justify-center text-white cursor-pointer",
                                )}
                                style={{
                                  marginTop: `${positions[c.id]?.top + i * 4 || 0
                                    }px`,
                                  height: `${positions[c.id]?.height || 0}px`,
                                  backgroundColor: c.color,
                                }}
                                onClick={() =>
                                  setSelected({
                                    id: c.session_id,
                                    date: item,
                                  })
                                }
                              >
                                <span className="rotate-90 inline-block text-xs">
                                  {c.title}
                                </span>
                              </div>
                            );
                          }
                        })}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {seleted && (
        <EventModal
          isOpen={Boolean(seleted)}
          onClose={() => setSelected(null)}
          data={seleted!}
        />
      )}
    </div>
  );
};

export default EventGrid;
