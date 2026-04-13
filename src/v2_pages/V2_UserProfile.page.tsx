import { useGetProfile } from "@/api/Profile_api/Profile_api";
import ExhibitorForm from "@/components/common/Profile/ExhiitorForm";
import ProfileForm from "@/components/common/Profile/ProfileForm";
import SpeakerForm from "@/components/common/Profile/SpeakerForm";
import WTCBadge from "@/components/common/Profile/WTCBadge";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useState } from "react";

const V2_UserProfile_page = () => {
  const { Profile, isPending, error } = useGetProfile();
  const [value, setValue] = useState<"Profile" | "Speaker" | "Exhibitor">(
    "Profile",
  );

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
      <div className="mx-auto px-8 pb-4">
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-start justify-between gap-4",
            (Profile.response.speaker_info !== null ||
              Profile.response.exhibitor_info !== null) &&
            "mb-4",
          )}
        >
          <Tabs
            value={value}
            onValueChange={(e) => setValue(e as typeof value)}
            className="w-full"
          >
            <TabsList className="">
              <TabsTrigger
                variant={"link"}
                value={"Profile"}
                className="text-[15px] font-semibold leading-[15px] px-0 mr-6"
              >
                Profile
              </TabsTrigger>
              {Profile.response.speaker_info && <TabsTrigger
                variant={"link"}
                value={"Speaker"}
                className="text-[15px] font-semibold leading-[15px] px-0 mr-6"
              >
                Speaker
              </TabsTrigger>}
              {Profile.response.exhibitor_info && <TabsTrigger
                variant={"link"}
                value={"Exhibitor"}
                className="text-[15px] font-semibold leading-[15px] px-0"
              >
                Exhibitor
              </TabsTrigger>}
            </TabsList>
            <TabsContent value="Profile">
              <ProfileForm />
            </TabsContent>
            <TabsContent value="Speaker">
              <SpeakerForm />
            </TabsContent>
            <TabsContent value="Exhibitor">
              <ExhibitorForm />
            </TabsContent>
          </Tabs>
          <div className="sm:w-fit flex flex-col items-center mt-11">
            <WTCBadge />
          </div>
        </div>
      </div>
    </div>
  );
};

export default V2_UserProfile_page;
