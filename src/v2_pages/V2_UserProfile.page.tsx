import { useGetProfile } from "@/api/Profile_api/Profile_api";
import ExhibitorForm from "@/components/common/Profile/ExhiitorForm";
import ProfileForm from "@/components/common/Profile/ProfileForm";
import SpeakerForm from "@/components/common/Profile/SpeakerForm";
import WTCBadge from "@/components/common/Profile/WTCBadge";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const V2_UserProfile_page = () => {
  const { Profile, isPending, error } = useGetProfile();

  if (isPending) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center">
        <Loader className="text-primary animate-spin" size={30} />
        <p className="text-primary font-semibold text-lg">
          Profile is loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay title="Exhibitors Error" message={error.message} />
      </div>
    );
  }

  if (!Profile || !Profile.response) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6">
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-start justify-between gap-4",
            (Profile.response.speaker_info !== null ||
              Profile.response.exhibitor_info !== null) &&
              "mb-4",
          )}
        >
          <ProfileForm />
          <div className="sm:w-fit flex flex-col items-center">
            <WTCBadge />
          </div>
        </div>
        <div className="">
          {Profile.response.speaker_info !== null && <SpeakerForm />}
          {Profile.response.exhibitor_info !== null && <ExhibitorForm />}
        </div>
      </div>
    </div>
  );
};

export default V2_UserProfile_page;
