import { useGetSpeakersList } from "@/api/global_api/global_api";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";
// import { teamMembers } from "@/data/Speaker";
import SpeakerCard from "@/v2_components/common/V2_Speaker/SpeakerCard";

const V2_Speakers_page = () => {
  const { SpeakersList, isPending, error } = useGetSpeakersList();

  if (isPending || !SpeakersList) {
    return (
      <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((val) => (
          <Skeleton key={val} className="w-[200px] h-60" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay title="Speakers Error" message={error.message} />
      </div>
    );
  }

  if (
    !SpeakersList ||
    !SpeakersList.response ||
    !SpeakersList.response.length
  ) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="px-4 mx-auto flex gap-4 flex-wrap items-start justify-center sm:justify-start">
      {SpeakersList.response.map((item, i) => (
        <SpeakerCard key={i} {...item} />
      ))}
    </div>
  );
};

export default V2_Speakers_page;
