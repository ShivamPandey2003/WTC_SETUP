import { cn, formatDate } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import { CalendarDays, Navigation, Search } from "lucide-react";
import { useSelector } from "react-redux";

const ExhibitorsTitlebar = () => {
  const { conference_location, conference_end_date, conference_start_date } =
    useSelector((state: RootState) => state.Global_Slice);
  return (
    <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row items-center justify-between">
      <h2 className="text-[20px] font-semibold leading-5">
        Exhibitors & Sponsors
      </h2>
      <div className="w-[250px] h-[30px] rounded-[5px] border border-[#0000001A] bg-[#D9D9D90D] flex items-center gap-2 px-2 py-2">
        <Search />
        <input
          className="w-full text-xs outline-none"
          placeholder="Search for an exhibitor or sponsor"
        />
      </div>
      <div className={cn("flex flex-col gap-2")}>
        <div className="flex items-center gap-2">
          <CalendarDays size={18} />
          <h3 className="font-medium">{`${formatDate(
            conference_start_date
          )} - ${formatDate(conference_end_date)}`}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Navigation size={18} color="black" fill="black" />
          <h3 className="font-medium">{conference_location}</h3>
        </div>
      </div>
    </div>
  );
};

export default ExhibitorsTitlebar;
