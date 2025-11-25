import { useGetProfile } from "@/api/Profile_api/Profile_api";
import ProfileForm from "@/components/common/Profile/ProfileForm";
import WTCBadge from "@/components/common/Profile/WTCBadge";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import Titlabar from "@/components/global/Titlabar";
import { Loader } from "lucide-react";

const Profile_page = () => {

  const {Profile, isPending, error} = useGetProfile()

  if(isPending){
    return<div className="w-full h-[80vh] flex flex-col items-center justify-center">
      <Loader className="text-primary animate-spin" size={30}/>
      <p className="text-primary font-semibold text-lg">Profile  is loading...</p>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-[80vh]">
      <ErrorDisplay title="Exhibitors Error" message={error.message}/>
    </div>;
  }

  if (
    !Profile ||
    !Profile.response) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData/>
      </div>
    );
  }

  return (
    <div className="mx-[7.5%]">
      <Titlabar className="mb-6" />
      <div className="flex items-center justify-between">
        <ProfileForm />
        <div className="w-1/2 flex flex-col items-center">
          <p className="text-[#111111BF] mb-2">Your WTC Badge</p>
          <WTCBadge />
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default Profile_page;
