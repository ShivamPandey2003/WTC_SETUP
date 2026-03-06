import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const TextCard = () => {
  const { Venue: venue } = useSelector(
    (state: RootState) => state.Global_Slice,
  );

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm min-h-[11rem]">
      {venue.getting_there.sub_title.trim() ? (
        <>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            {venue.getting_there.sub_title}
          </h1>
          <p className="text-gray-600 leading-relaxed text-sm">
            {venue.getting_there.description}
          </p>
        </>
      ) : (
        <div className="w-full flex items-center justify-center min-h-[8rem]">
          <p className="text-3xl font-bold mb-4 text-gray-900">No Data Found</p>
        </div>
      )}
    </div>
  );
};

export default TextCard;
