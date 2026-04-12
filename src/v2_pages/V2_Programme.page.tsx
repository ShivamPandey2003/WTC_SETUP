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
import { groupIntoColumns } from "@/lib/GroupintoColumn";
import { setProgrammes, type ProgrammeRecord } from "@/redux/ExtraSlice";
import { setProgramme } from "@/redux/GlobalSlice";
import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch } from "@/redux/store";
import EventGrid from "@/v2_components/common/V2_Programme/EventGrid";
import MultiSelect from "@/v2_components/global/MultiSelect";
import { Loader, X } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const V2_Programme_page = () => {
  const { ProgrammeList, isPending, error } = useGetProgrammeList();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();

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
  }, [ProgrammeList]);

  useEffect(() => {
    dispatch(setTitle(null));
  }, []);

  if (isPending) {
    return (
      <div className="w-full h-screen flex flex-col px-4">
        <Skeleton className="w-full h-8 mb-4" />
        <Skeleton className="w-full h-8" />
        <div className="flex gap-4 mt-4">
          <Skeleton className="w-32 h-full" />
          <div className="w-full h-[75vh] flex items-center justify-center">
            <Loader className="text-primary animate-spin" size={30} />
            <p className="text-primary font-semibold text-lg">
              Loading programme, please wait...
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
    <div className="px-4 mx-auto flex flex-col">
      <div className="hidden sm:flex gap-4 sm:justify-center mb-6 w-full">
        <div className="flex items-center w-fit-content gap-2">
          <MultiSelect
            options={ProgrammeList.data.response.all_categories.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Search categories..."
          />
          <Button
              className="py-0 text-sm bg-primary text-white hover:text-white"
              size={"sm"}
              variant={"outline"}
              disabled={selectedCategories.length === 0}
              onClick={() => setSelectedCategories([])}
            >
              <X />
            </Button>
        </div>
      </div>
      <EventGrid selectedCategories={selectedCategories} />
    </div>
  );
};

export default V2_Programme_page;
