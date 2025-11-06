import FLOOR_MAP from "@/assets/Images/FloorMap.png";
import Titlabar from "@/components/global/Titlabar";
import { formatDate } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const Floor_plan = () => {
  const { Venue } = useSelector((state: RootState) => state.Global_Slice);
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <img
        src={FLOOR_MAP}
        alt="Floor_Map"
        className="md:w-[500px] h-[500px] mb-4"
      />
      <Titlabar
        location={Venue.conference_location}
        date={`${formatDate(Venue.conference_start_date)} - ${formatDate(
          Venue.conference_end_date
        )}`}
      />
    </div>
  );
};

export default Floor_plan;
