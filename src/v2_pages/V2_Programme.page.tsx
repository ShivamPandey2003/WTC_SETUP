import { useGetProgrammeList } from "@/api/global_api/global_api";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch } from "@/redux/store";
import EventGrid from "@/v2_components/common/V2_Programme/EventGrid";
import { Check, Loader } from "lucide-react";
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

  if (!ProgrammeList || !ProgrammeList.response || !ProgrammeList.response.programme.length) {
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
        {ProgrammeList.response.all_categories.map((item) => {
          const active = selectedCategories.includes(item.id);
          return (
            <div
              onClick={() => toggleCategory(item.id)}
              key={item.name}
              className={cn(
                "flex items-center justify-center p-1 rounded-lg border min-w-20 w-fit gap-2 text-xs cursor-pointer",
              )}
              style={{
                background: item.color,
                borderColor: item.color,
                color: "white",
              }}
            >
              {!active && <Check size={15} />}
              <span>{item.name}</span>
            </div>
          );
        })}
        </div>
        <Button
          className="py-0 h-6 text-sm hover:text-white"
          size={"sm"}
          variant={"outline"}
          onClick={() => setSelectedCategories([])}
        >
          Clear All
        </Button>
      </div>
      <EventGrid selectedCategories={selectedCategories} />
    </div>
  );
};

export default V2_Programme_page;
