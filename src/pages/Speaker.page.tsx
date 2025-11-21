import { useGetSpeakersList } from "@/api/global_api/global_api";
import SpeakerCard from "@/components/common/Speaker/SpeakerCard";
import Titlabar from "@/components/global/Titlabar";
import { formatDate } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
// import { formatDate } from "@/lib/utils";

const Speaker_page = () => {
  const { SpeakersList, isPending, error } = useGetSpeakersList();
  const {
    conference_location,
    conference_end_date,
    conference_start_date,
    conference_title,
  } = useSelector((state: RootState) => state.Global_Slice);

  if (isPending || !SpeakersList) {
    return;
  }

  if (error) {
    return <div>{error.message}</div>;
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
      <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
        {SpeakersList?.response.map((prop, index) => (
          <SpeakerCard key={index} image={prop.user_img} {...prop} />
        ))}
      </div>
    </div>
  );
};

export default Speaker_page;
