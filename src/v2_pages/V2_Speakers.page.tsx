import { teamMembers } from "@/data/Speaker";
import SpeakerCard from "@/v2_components/common/V2_Speaker/SpeakerCard";

const V2_Speakers_page = () => {
  return (
    <div className="px-4 mx-auto flex gap-4 flex-wrap items-start justify-center sm:justify-start">
      {teamMembers.map((item, i) => (
        <SpeakerCard key={i} {...item} />
      ))}
    </div>
  );
};

export default V2_Speakers_page;
