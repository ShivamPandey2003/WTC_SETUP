import { useGetProgrammeList } from "@/api/global_api/global_api";
import Extra from "@/components/common/Programme/Extra";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import Titlabar from "@/components/global/Titlabar";
import { formatDate } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import { Loader } from "lucide-react";
import { useSelector } from "react-redux";

const Programme_page = () => {
  const { ProgrammeList, isPending, error } = useGetProgrammeList();
  const {
    conference_location,
    conference_end_date,
    conference_start_date,
    conference_title,
  } = useSelector((state: RootState) => state.Global_Slice);

  if (isPending) {
    return <div className="w-full h-[80vh] flex flex-col items-center justify-center">
      <Loader className="text-primary animate-spin" size={30}/>
      <p className="text-primary font-semibold text-lg">Sessions is loading...</p>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-[80vh]">
      <ErrorDisplay title="Programme Error" message={error.message}/>
    </div>;
  }

  if (!ProgrammeList || !ProgrammeList.data.response) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="mx-[7.5%]">
      <Titlabar
        title={conference_title}
        location={conference_location}
        date={`${formatDate(conference_start_date)} - ${formatDate(
          conference_end_date
        )}`}
        className="mb-8"
      />
      <div className="flex items-center justify-center">
      <Extra/>
      </div>
    </div>
  );
};

export default Programme_page;
