import {
  useGetProgrammeList,
  useGetProgrammeList3_v2,
  useGetProgrammeTypeList,
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
import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch } from "@/redux/store";
// import EventGrid2_v2 from "@/v2_components/common/V2_Programme/EventGrid2_v2";
import EventGrid3_v2 from "@/v2_components/common/V2_Programme/EventGrid3_v2";
// import EventGrid from "@/v2_components/common/V2_Programme/EventGrid";
// import EventGrid_V2 from "@/v2_components/common/V2_Programme/EventGrid_v2";
import { SearchBox } from "@/v2_components/global/Search/SearchBox";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const V2_Programme_page = () => {
  const { ProgrammeList, isPending, error } = useGetProgrammeList();
  const {
    ProgrammeList: ProgrammeList3_v2,
    isPending: isPendingNewList,
    error: errorNewList,
  } = useGetProgrammeList3_v2();
  const {
    ProgrammeTypeList,
    isPending: isPendingType,
    error: errorType,
  } = useGetProgrammeTypeList();
  // const [selectedCategories, setSelectedCategories] = useState<
  //   { name: string; value: string }[]
  // >([]);
  const dispatch = useDispatch<AppDispatch>();
  const [selected, setSelected] = useState<{
    id: string;
    date: string;
  } | null>(null);

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

  useEffect(() => {
    dispatch(setTitle(null));
  }, []);

  if (isPending || isPendingType || isPendingNewList) {
    return (
      <div className="w-full flex flex-col px-4">
        {/* Navbar */}
        <div className="navbar flex justify-between px-4 py-2">
          <div className="left-header">
            <Skeleton className="w-[150px] h-7" />
          </div>
          <div className="right-header flex gap-4 mb-5">
            <Skeleton className="w-[200px] h-10" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
        {/* Search bar */}
        <div className="sm:flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Skeleton className="w-72 h-9 rounded-md" />
            <Skeleton className="w-9 h-9 rounded-md" />
          </div>
        </div>
        {/* Calendar grid */}
        <div className="flex gap-0 overflow-hidden">
          {/* Time column */}
          <div className="flex flex-col pt-8 gap-0 shrink-0 w-14">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-12 flex items-start justify-end pr-2">
                <Skeleton className="w-8 h-3 rounded" />
              </div>
            ))}
          </div>
          {/* Day columns */}
          {[
            [
              { top: 1, span: 3 },
              { top: 5, span: 2 },
            ],
            [
              { top: 0, span: 2 },
              { top: 0, span: 2, offset: true },
              { top: 3, span: 3 },
              { top: 7, span: 2 },
            ],
            [
              { top: 2, span: 4 },
              { top: 7, span: 3 },
            ],
          ].map((events, colIdx) => (
            <div
              key={colIdx}
              className="flex-1 flex flex-col min-w-0 border-l border-gray-100"
            >
              {/* Day header */}
              <div className="h-8 flex items-center justify-center mb-0 border-b border-gray-100">
                <Skeleton className="w-20 h-4 rounded" />
              </div>
              {/* Grid cells with event blocks */}
              <div className="relative">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-12 border-b border-gray-50" />
                ))}
                {events.map((ev, i) => (
                  <Skeleton
                    key={i}
                    className="absolute left-1 right-1 rounded-lg"
                    style={{
                      top: `${ev.top * 48}px`,
                      height: `${ev.span * 48 - 4}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || errorType || errorNewList) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay
          title="Programme Error"
          message={
            error?.message || errorType?.message || "An unknown error occurred"
          }
        />
      </div>
    );
  }

  if (
    !ProgrammeList ||
    !ProgrammeTypeList ||
    !ProgrammeTypeList.response.length ||
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
        <EventGrid3_v2 programmeData={ProgrammeList3_v2.response} selectedCategories={[]} />
      {/* ) : ( */}
        {/* <EventGrid2_v2 programmeData={ProgrammeTypeList.response} /> */}
      {/* )} */}
      {selected && (
        <EventModal
          isOpen={Boolean(selected)}
          onClose={() => setSelected(null)}
          data={selected!}
        />
      )}
    </div>
  );
};

export default V2_Programme_page;
