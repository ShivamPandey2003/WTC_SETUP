import { useGetProfile } from "@/api/Profile_api/Profile_api";
import ProfileForm from "@/components/common/Profile/ProfileForm";
import WTCBadge from "@/components/common/Profile/WTCBadge";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
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
        <div className="flex items-start justify-between gap-4">
          <ProfileForm />
          <div className="w-fit flex flex-col items-center">
            <WTCBadge />
            <p></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default V2_UserProfile_page;
