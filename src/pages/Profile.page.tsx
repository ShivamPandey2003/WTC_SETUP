import { useGetProfile } from "@/api/Profile_api/Profile_api";
import ProfileForm from "@/components/common/Profile/ProfileForm";
import WTCBadge from "@/components/common/Profile/WTCBadge";
import Titlabar from "@/components/global/Titlabar";

const Profile_page = () => {

  const {Profile,isPending} = useGetProfile()

  if(isPending || !Profile){
    return
  }

  return (
    <div className="mx-[7.5%]">
      <Titlabar className="mb-6" />
      <div className="flex items-center justify-between">
        <ProfileForm />
        <div className="w-1/2 flex flex-col items-center">
          <p className="text-[#111111BF] mb-2">Your WTC Badge</p>
          <WTCBadge />
        </div>
      </div>
    </div>
  );
};

export default Profile_page;
