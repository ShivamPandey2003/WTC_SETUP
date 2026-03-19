import { useGetProgrammeList } from "@/api/global_api/global_api";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getDateRange,
  getEarliestAndLatest,
  transformSessions,
} from "@/lib/extra";
import { cn } from "@/lib/utils";
import { setProgrammes, type ProgrammeRecord } from "@/redux/ExtraSlice";
import { setProgramme } from "@/redux/GlobalSlice";
import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch } from "@/redux/store";
import EventGrid from "@/v2_components/common/V2_Programme/EventGrid";
import { Check, Loader } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const V2_Programme_page = () => {
  const { ProgrammeList, isPending, error } = useGetProgrammeList();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

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
          return {
            session_id: Datas.id,
            id: nanoid(),
            categoryId: detail[0].id,
            title: detail[0]?.name,
            color: detail[0]?.color,
            start_time: Datas.start_time,
            end_time: Datas.end_time,
            type: "normal",
          };
        });
      value.data = {
        [item]: transformSessions(val as any),
        ...value.data,
      };
    });
    dispatch(setProgrammes(value));
    dispatch(setProgramme(ProgrammeList.data.response.programme));
  }, [ProgrammeList]);

  useEffect(() => {
    dispatch(setTitle(null));
  }, []);

  if (isPending) {
    return (
      <div className="w-full h-screen flex flex-col px-4">
        <Skeleton className="w-full h-[2rem] mb-4" />
        <Skeleton className="w-full h-[2rem]" />
        <div className="flex gap-4 mt-4">
          <Skeleton className="w-[8rem] h-full" />
          <div className="w-full h-[75vh] flex items-center justify-center">
            <Loader className="text-primary animate-spin" size={30} />
            <p className="text-primary font-semibold text-lg">
              Sessions is loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay title="Programme Error" message={error.message} />
      </div>
    );
  }

  if (
    !ProgrammeList ||
    !ProgrammeList.data.response ||
    !ProgrammeList.data.response.programme.length
  ) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="px-4 mx-auto">
      <div className="hidden sm:flex justify-between items-center ml-4 mt-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          {ProgrammeList.data.response.all_categories.map((item) => {
            const active = selectedCategories.includes(item.id);
            return (
              <div
                onClick={() => toggleCategory(item.id)}
                key={item.name}
                className={cn(
                  "flex items-center justify-center p-1 px-4 rounded-lg border min-w-20 w-fit gap-2 text-sm cursor-pointer",
                )}
                style={{
                  background: active ? "#B8B8B8" : item.color,
                  borderColor: active ? "#B8B8B8" : item.color,
                  color: active ? "#303030" : "white",
                }}
              >
                {!active && <Check size={15} />}
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
        <Button
          className="py-0 h-6 text-sm bg-primary text-white hover:text-white"
          size={"sm"}
          variant={"outline"}
          onClick={() => setSelectedCategories([])}
        >
          Clear Filters
        </Button>
      </div>
      <EventGrid selectedCategories={selectedCategories} />
    </div>
  );
};

export default V2_Programme_page;
