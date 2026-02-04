import { useGetSpeakersList } from "@/api/global_api/global_api";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";
// import { teamMembers } from "@/data/Speaker";
import SpeakerCard from "@/v2_components/common/V2_Speaker/SpeakerCard";
import SpeakerModal from "@/v2_components/common/V2_Speaker/SpeakerModal";
import { useState } from "react";

const V2_Speakers_page = () => {
  const [selectedId, setSelectedId]= useState<string|null>(null)
  const { SpeakersList, isPending, error } = useGetSpeakersList();

  if (isPending || !SpeakersList) {
    return (
      <div className="w-full mx-auto">
        <div className="px-4 flex gap-4 flex-wrap items-start justify-center sm:justify-start">
          {[1, 2, 3, 4, 5].map((val) => (
            <Skeleton key={val} className="w-[250px] h-80" />
          ))}
        </div>
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
    // flex gap-4 flex-wrap items-start justify-center
    // grid-cols-5 gap-6
    <div className="w-full mx-auto">
      <div className="p-4 flex gap-4 flex-wrap items-start justify-center sm:justify-start">
        {SpeakersList.response.map((item, i) => (
          <SpeakerCard key={i} {...item} onClick={()=>setSelectedId(item.speaker_id)} />
        ))}
      </div>
      <SpeakerModal data={SpeakersList.response} id={selectedId as string} isOpen={Boolean(selectedId)} onClose={()=>setSelectedId(null)}/>
    </div>
  );
};

export default V2_Speakers_page;
