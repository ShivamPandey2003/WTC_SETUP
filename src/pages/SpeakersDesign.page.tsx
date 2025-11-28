import CustomTable from "@/components/common/Speaker_Design/CustomTable";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import Section from "@/components/global/Section";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { Loader, Plus, SquareArrowOutUpRight } from "lucide-react";
import React from "react";
import CreateModal from "@/components/common/Speaker_Design/CreateModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setIsCreating, setSpeakerSettings } from "@/redux/SpeakerDesignSlice";
import { useGetSpeakerSetting } from "@/api/speaker_design_api/speaker_design_api";
import { normalizeLabel } from "@/lib/utils";
import { useSpeakerDesignUpdate } from "@/api/global_api/global_api";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";

const SpeakersDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  const { isCreating, SpeakerSettings } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice
  );
  const {SpeakerSettings:SpeakerSettingValues, isPending, error} = useGetSpeakerSetting();
  const dispatch = useDispatch<AppDispatch>();
  const {UpdateSpeakerDesign, isUpdateSpeakerDesignPending} = useSpeakerDesignUpdate();

  if (isPending) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Loader className="text-primary animate-spin" size={30} />
        <p className="text-primary font-semibold text-lg">
          Please wait data is loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ErrorDisplay title="News Feed Error" message={error.message} />
      </div>
    );
  }

  if (!SpeakerSettingValues || !SpeakerSettingValues.response) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6">
        <AdminTitlebar
          Title="Speakers Design"
          onSave={() => UpdateSpeakerDesign()}
          show={Boolean(value !== "Session Data")}
          loading={isUpdateSpeakerDesignPending}
        />
        {Boolean(value === "Session Data") && (
          <div className="absolute right-10 flex items-center gap-4">
            <Button
              onClick={() => dispatch(setIsCreating(true))}
              className="w-[100px] py-1 h-7"
            >
              <Plus />
              Add New
            </Button>
          </div>
        )}
        <Tabs defaultValue={value} onValueChange={setValue}>
          <TabsList className="mb-4 pl-80 xxs:pl-60 xs:pl-0">
            <TabsTrigger
              variant={"link"}
              value={"General Settings"}
              className="text-[15px] font-semibold leading-[15px] px-0 mr-6"
            >
              General Settings
            </TabsTrigger>
            <TabsTrigger
              variant={"link"}
              value={"Session Data"}
              className="text-[15px] font-semibold leading-[15px] px-0"
            >
              Speaker Data
            </TabsTrigger>
          </TabsList>
          <TabsContent value="General Settings">
            <Section title="Basic info">
              {Object.entries(SpeakerSettings.speaker_info)
                .map(([key, value], i) => (
                  <div className="flex items-center py-2" key={i}>
                    <div className="w-40 text-sm font-medium">
                      {normalizeLabel(key)}
                    </div>
                    <ToggleSwitch
                      isOpen={Boolean(value)}
                      setIsOn={() =>
                        dispatch(
                          setSpeakerSettings({
                            ...SpeakerSettings,
                            [key]: !value,
                          })
                        )
                      }
                    />
                  </div>
                ))}
            </Section>
            <Section title="Speaker Data">
              <p className="text-sm text-gray-700 flex gap-1">
                Data for info cards will be fetched from{" "}
                <a
                  href="#"
                  className="text-primary hover:underline font-medium flex items-center"
                >
                  Speaker Data
                  <SquareArrowOutUpRight size={13} />
                </a>{" "}
                database.
              </p>
            </Section>
          </TabsContent>
          <TabsContent value="Session Data">
            <CustomTable />
          </TabsContent>
        </Tabs>
      </div>
      <CreateModal
        isOpen={isCreating}
        onClose={() => dispatch(setIsCreating(false))}
      />
    </div>
  );
};

export default SpeakersDesign_page;
