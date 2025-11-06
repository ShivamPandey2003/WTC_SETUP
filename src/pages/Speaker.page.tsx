import { useGetSpeakersList } from "@/api/global_api/global_api";
import SpeakerCard from "@/components/common/Speaker/SpeakerCard";
import Titlabar from "@/components/global/Titlabar";
import { formatDate } from "@/lib/utils";

const Speaker_page = () => {
  const { SpeakersList, isPending, error } = useGetSpeakersList();

  if (isPending || !SpeakersList) {
    return;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="mx-[7.5%]">
      <Titlabar
        title={SpeakersList?.response.conference_title}
        location={SpeakersList?.response.conference_location}
        date={`${formatDate(
          SpeakersList?.response.conference_start_date
        )} - ${formatDate(SpeakersList?.response.conference_end_date)}`}
        className="mb-8"
      />
      <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
        {SpeakersList?.response.speaker_list.map((prop, index) => (
          <SpeakerCard key={index} {...prop} />
        ))}
      </div>
    </div>
  );
};

export default Speaker_page;
