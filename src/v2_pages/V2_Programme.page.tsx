import { useGetProgrammeList } from "@/api/global_api/global_api";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { cn } from "@/lib/utils";
import EventGrid from "@/v2_components/common/V2_Programme/EventGrid";
import { Check, Loader } from "lucide-react";

const V2_Programme_page = () => {
  const { ProgrammeList, isPending, error } = useGetProgrammeList();

  if (isPending) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center">
        <Loader className="text-primary animate-spin" size={30} />
        <p className="text-primary font-semibold text-lg">
          Sessions is loading...
        </p>
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

  if (!ProgrammeList || !ProgrammeList.response) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="px-4 mx-auto">
      <div className="hidden sm:flex flex-wrap gap-4 items-center ml-16 mt-4 mb-6">
        {ProgrammeList.response.all_categories.map((item) => (
          <div
            key={item.name}
            className={cn(
              "flex items-center justify-center p-1 rounded-lg border min-w-20 w-fit gap-2 text-xs cursor-pointer"
            )}
            style={{
              background: item.color,
              borderColor: item.color,
              color: "white",
            }}
          >
            <Check size={15} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      <EventGrid />
    </div>
  );
};

export default V2_Programme_page;
