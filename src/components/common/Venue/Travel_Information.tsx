import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const Travel_Information = () => {

  const { Venue } = useSelector((state: RootState) => state.Global_Slice);

  return (
    <div className=" container">
      <h2 className="text-2xl font-[700] mb-4">
        {Venue.travel_info.title}
      </h2>
      <p>
        {Venue.travel_info.description}
      </p>
    </div>
  );
};

export default Travel_Information;
