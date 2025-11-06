import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const Visa_Information = () => {

  const { Venue } = useSelector((state: RootState) => state.Global_Slice);

  return (
    <div className=" container">
      <h1 className="text-2xl font-bold mb-3">
        {Venue.visa_info.title}
      </h1>
      <h3 className="text-lg font-[500] mb-3">
        {Venue.visa_info.sub_title}
      </h3>
      <p>
        {Venue.visa_info.description}
      </p>
    </div>
  );
};

export default Visa_Information;
