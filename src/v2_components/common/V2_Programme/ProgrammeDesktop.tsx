import {
  useGetProgrammeList,
  useGetProgrammeList3_v2,
} from "@/api/global_api/global_api";
import EventModal from "@/components/common/Programme/EventModal";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getDateRange,
  getEarliestAndLatest,
  transformSessions,
} from "@/lib/extra";
import { groupIntoColumns } from "@/lib/GroupintoColumn";
import { setProgrammes, type ProgrammeRecord } from "@/redux/ExtraSlice";
import { setAll_Categories, setProgramme, setType } from "@/redux/GlobalSlice";
import type { AppDispatch } from "@/redux/store";
// import EventGrid2_v2 from "@/v2_components/common/V2_Programme/EventGrid2_v2";
import EventGrid3_v2 from "@/v2_components/common/V2_Programme/EventGrid3_v2";
// import EventGrid from "@/v2_components/common/V2_Programme/EventGrid";
// import EventGrid_V2 from "@/v2_components/common/V2_Programme/EventGrid_v2";
import { SearchBox } from "@/v2_components/global/Search/SearchBox";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router";

/** Desktop: day columns calendar grid. */
const ProgrammeDesktop = () => {
  const { ProgrammeList, isPending, error } = useGetProgrammeList();
  const [searchParams] = useSearchParams();
  const {
    ProgrammeList: ProgrammeList3_v2,
    isPending: isPendingNewList,
    error: errorNewList,
  } = useGetProgrammeList3_v2();
  // const [selectedCategories, setSelectedCategories] = useState<
  //   { name: string; value: string }[]
  // >([]);
  const dispatch = useDispatch<AppDispatch>();
  const [selected, setSelected] = useState<{
    id: string;
    date: string;
  } | null>(null);

  useEffect(()=>{
    const progammeId = searchParams.get("programmeid");
    const date = searchParams.get("date");

    if(!progammeId && !date) return;

    setSelected({
      id:progammeId as string,
      date:date as string,
    })

  },[searchParams])

  useEffect(() => {
    if (!ProgrammeList) return;

    const value: ProgrammeRecord = {
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      data: {},
    };

    const parseDate = (dateStr: string): Date => {
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, d); // Safe, no timezone issues
    };

    const formatYMD = (date: Date): string => {
      return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
    };

    const dates = ProgrammeList.data.response.programme.map((item) =>
      parseDate(item.start_date),
    );

    const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
    const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
    const Time = getEarliestAndLatest(ProgrammeList.data.response.programme);

    value.start_date = formatYMD(earliest);
    value.end_date = formatYMD(latest);
    value.start_time = Time.earliest;
    value.end_time = Time.latest;

    const dateRange = getDateRange(value.start_date, value.end_date);
    dateRange.forEach((item) => {
      const val = ProgrammeList.data.response.programme
        .filter((e) => e.start_date === item)
        .map((Datas) => {
          const detail = Object.entries(Datas.categories).map(([key, set]) => {
            return {
              id: key,
              name: set.name,
              color: set.color,
            };
          });
          if (detail.length === 0) return;
          return {
            session_id: Datas.id,
            SessionType: Datas.type,
            id: nanoid(),
            categoryId: detail[0].id,
            title: detail[0]?.name,
            color: detail[0]?.color,
            start_time: Datas.start_time,
            end_time: Datas.end_time,
            type: "normal",
          };
        });

      const result = transformSessions(val as any);
      const columns = result ? groupIntoColumns(result) : [];

      value.data = {
        [item]: columns,
        ...value.data,
      };
    });

    dispatch(setProgrammes(value));
    dispatch(setProgramme(ProgrammeList.data.response.programme));
    dispatch(setAll_Categories(ProgrammeList.data.response.all_categories));
    dispatch(setType(ProgrammeList.data.response.types));
  }, [ProgrammeList]);

  if (isPending || isPendingNewList) {
    // PX_PER_MIN=1.6, so 1 hour = 96px; start at 7:00
    const HOURS = Array.from({ length: 12 }, (_, i) => `${7 + i}:00`);
    const toTop = (h: number, m = 0) => (h * 60 + m - 420) * 1.6;
    const toH = (mins: number) => mins * 1.6;
    const GAP = 6;

    const days: { label: string; width: number; blocks: { t: number; h: number; l: number; w: number }[] }[] = [
      {
        label: "Fri 15 May",
        width: 200,
        blocks: [
          { t: toTop(9) + GAP,      h: toH(180) - GAP * 2, l: GAP,       w: 88 },
          { t: toTop(11) + GAP,     h: toH(90)  - GAP * 2, l: 106,        w: 88 },
          { t: toTop(12, 30) + GAP, h: toH(60)  - GAP * 2, l: GAP,       w: 188 },
        ],
      },
      {
        label: "Sat 16 May",
        width: 500,
        blocks: [
          { t: toTop(7) + GAP,      h: toH(390) - GAP * 2, l: GAP,       w: 88 },
          { t: toTop(9) + GAP,      h: toH(120) - GAP * 2, l: 106,        w: 88 },
          { t: toTop(10, 30) + GAP, h: toH(90)  - GAP * 2, l: 106,        w: 88 },
          { t: toTop(9) + GAP,      h: toH(180) - GAP * 2, l: 206,        w: 88 },
          { t: toTop(10) + GAP,     h: toH(120) - GAP * 2, l: 306,        w: 88 },
          { t: toTop(11) + GAP,     h: toH(150) - GAP * 2, l: 406,        w: 88 },
          { t: toTop(12, 30) + GAP, h: toH(60)  - GAP * 2, l: 106,        w: 388 },
        ],
      },
      {
        label: "Sun 17 May",
        width: 400,
        blocks: [
          { t: toTop(7) + GAP,      h: toH(390) - GAP * 2, l: GAP,       w: 88 },
          { t: toTop(9) + GAP,      h: toH(120) - GAP * 2, l: 106,        w: 88 },
          { t: toTop(11) + GAP,     h: toH(120) - GAP * 2, l: 106,        w: 88 },
          { t: toTop(8) + GAP,      h: toH(270) - GAP * 2, l: 206,        w: 88 },
          { t: toTop(10, 30) + GAP, h: toH(150) - GAP * 2, l: 306,        w: 88 },
          { t: toTop(12, 30) + GAP, h: toH(60)  - GAP * 2, l: 106,        w: 288 },
        ],
      },
      {
        label: "Mon 18 May",
        width: 300,
        blocks: [
          { t: toTop(7) + GAP,      h: toH(390) - GAP * 2, l: GAP,       w: 88 },
          { t: toTop(8) + GAP,      h: toH(60)  - GAP * 2, l: 206,        w: 88 },
          { t: toTop(9) + GAP,      h: toH(180) - GAP * 2, l: 206,        w: 88 },
          { t: toTop(11) + GAP,     h: toH(180) - GAP * 2, l: 106,        w: 88 },
          { t: toTop(11) + GAP,     h: toH(210) - GAP * 2, l: 206,        w: 88 },
        ],
      },
    ];

    return (
      <div className="px-4 mx-auto flex flex-col">
        {/* Search bar */}
        <div className="sm:flex justify-center gap-4 mb-6 w-full">
          <Skeleton className="w-72 h-9 rounded-full" />
        </div>

        {/* Calendar — same CSS classes as the real grid */}
        <div className="calendar-outer-wrapper">
          <div className="calendar-scroll-container">
            <div className="corner-cell" />

            <div className="header-row">
              {days.map(({ label, width }) => (
                <div key={label} className="day-header" style={{ width, minWidth: width }}>
                  <Skeleton className="w-20 h-4 rounded" />
                </div>
              ))}
            </div>

            <div className="time-gutter">
              {HOURS.map((h) => (
                <div key={h} className="time-label">
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {days.map(({ label, width, blocks }, di) => (
                <div
                  key={label}
                  className="day-column"
                  style={{
                    width,
                    minWidth: width,
                    borderRight: di < days.length - 1 ? "2px solid #ddd" : undefined,
                    height: HOURS.length * 96,
                  }}
                >
                  {HOURS.map((_, i) => (
                    <div key={i} className="grid-line" style={{ top: i * 96 }} />
                  ))}
                  {blocks.map((b, i) => (
                    <Skeleton
                      key={i}
                      className="absolute rounded-lg"
                      style={{ top: b.t, height: b.h, left: b.l, width: b.w }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || errorNewList) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay
          title="Programme Error"
          message={error?.message || "An unknown error occurred"}
        />
      </div>
    );
  }

  if (
    !ProgrammeList ||
    !ProgrammeList.data.response ||
    !ProgrammeList.data.response.programme.length ||
    !ProgrammeList3_v2 ||
    !ProgrammeList3_v2.response ||
    Object.keys(ProgrammeList3_v2.response).length === 0
  ) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <>
      <div className="px-4 mx-auto flex flex-col">
        <div className="sm:flex justify-center gap-4 mb-6 w-full">
          {/* {!isMobile && (
          <div className="p-1 bg-white w-fit rounded-full h-fit flex gap-1 shadow">
            <Button
              variant={currentTab === "Types" ? "default" : "ghost"}
              size={"sm"}
              className={cn("capitalize rounded-full p-2 w-28 h-6")}
              onClick={() => setCurrentTab("Types")}
            >
              Types
            </Button>
            <Button
              variant={currentTab === "Categories" ? "default" : "ghost"}
              size={"sm"}
              className={cn("capitalize rounded-full p-2 w-28 h-6")}
              onClick={() => setCurrentTab("Categories")}
            >
              Categories
            </Button>
          </div>
        )} */}
          <SearchBox handleSelect={setSelected} />
        </div>
        {/* <EventGrid selectedCategories={selectedCategories} /> */}
        {/* {currentTab === "Categories" ? ( */}
        <EventGrid3_v2
          programmeData={ProgrammeList3_v2.response}
          selectedCategories={[]}
        />
        {/* ) : ( */}
        {/* <EventGrid2_v2 programmeData={ProgrammeTypeList.response} /> */}
        {/* )} */}
        {(ProgrammeList.data.response.programme.length > 0 && selected) && (
          <EventModal
            isOpen={Boolean(selected)}
            onClose={() => setSelected(null)}
            data={selected!}
            ProgrammeData={ProgrammeList.data.response.programme}
          />
        )}
      </div>
    </>
  );
};

export default ProgrammeDesktop;
