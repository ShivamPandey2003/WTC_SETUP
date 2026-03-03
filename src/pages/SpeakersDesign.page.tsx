import CustomTable from "@/components/common/Speaker_Design/CustomTable";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import Section from "@/components/global/Section";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import {
  Download,
  Loader,
  Plus,
  SquareArrowOutUpRight,
  Upload,
} from "lucide-react";
import React from "react";
import CreateModal from "@/components/common/Speaker_Design/CreateModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  setIsCreating,
  setSpeakerSettings,
  setUploadCSV,
} from "@/redux/SpeakerDesignSlice";
import {
  useGetSpeakerSetting,
  useSpeakerDownload,
  useUploadSpeakerCSV,
} from "@/api/speaker_design_api/speaker_design_api";
import { cn, normalizeLabel } from "@/lib/utils";
import { useSpeakerDesignUpdate } from "@/api/global_api/global_api";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import CSVModel from "@/components/global/CSVModel";

const SpeakersDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  const { isCreating, SpeakerSettings, uploadCSV } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const {
    SpeakerSettings: SpeakerSettingValues,
    isPending,
    error,
  } = useGetSpeakerSetting();
  const {downloadSpeaker, isdownloadPending} = useSpeakerDownload()
  const { UploadSpeakerCSV, isPending: isUploadSpeakerCSV } =
    useUploadSpeakerCSV();
  const dispatch = useDispatch<AppDispatch>();
  const { UpdateSpeakerDesign, isUpdateSpeakerDesignPending } =
    useSpeakerDesignUpdate();

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
          show={false}
          loading={isUpdateSpeakerDesignPending}
        />
        {Boolean(value === "Session Data") && (
          <div className="absolute right-10 flex items-center gap-4">
            <Button onClick={() => downloadSpeaker()} disabled={isdownloadPending} className="w-fit py-1 h-7">
              <Download />
              Download ALl
            </Button>
            <Button
              onClick={() => dispatch(setUploadCSV(true))}
              className="w-fit py-1 h-7"
            >
              <Upload />
              Upload CSV
            </Button>
            <Button
              onClick={() => dispatch(setIsCreating(true))}
              className="w-fit py-1 h-7"
            >
              <Plus />
              Add Speaker
            </Button>
          </div>
        )}
        <Tabs value={value} onValueChange={setValue}>
          <TabsList className="pl-80 xxs:pl-60 xs:pl-0">
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
            <div className="flex items-start gap-4">
              <Section
                title="Basic info"
                ClassName="w-full"
                onSave={() => UpdateSpeakerDesign()}
                show={true}
                loading={isUpdateSpeakerDesignPending}
              >
                <div className={cn("flex items-center gap-4 py-2")}>
                  <div className="text-sm font-medium w-[175px] shrink-0">
                    {"Tab Title"}
                  </div>
                  <div
                    className={cn(
                      "relative flex items-center gap-3 bg-[#1111110D] px-12 py-1 text-sm text-gray-600 rounded-[7px] text-center border border-transparent hover:border-gray-300 focus:border-[#318061] focus:outline-none focus:ring-1 focus:ring-[#318061] transition-colors",
                    )}
                  >
                    <input
                      type="text"
                      value={SpeakerSettings.speaker_tab}
                      onChange={(e) =>
                        dispatch(
                          setSpeakerSettings({
                            ...SpeakerSettings,
                            speaker_tab: e.target.value,
                          }),
                        )
                      }
                      className="focus:outline-none text-center bg-transparent"
                    />
                  </div>
                </div>
                {Object.entries(SpeakerSettings.speaker_info).map(
                  ([key, value], i) => (
                    <div className="flex items-center py-2 gap-8" key={i}>
                      <div className="w-40 text-sm font-medium">
                        {normalizeLabel(key)}
                      </div>
                      <ToggleSwitch
                        isOpen={Boolean(value)}
                        setIsOn={() =>
                          dispatch(
                            setSpeakerSettings({
                              ...SpeakerSettings,
                              speaker_info: {
                                ...SpeakerSettings.speaker_info,
                                [key]: !value,
                              },
                            }),
                          )
                        }
                      />
                    </div>
                  ),
                )}
              </Section>
              <Section title="Speaker Data" ClassName="w-full">
                <div className="text-sm text-gray-700 flex gap-1">
                  Data for info cards will be fetched from{" "}
                  <div
                    onClick={() => setValue("Session Data")}
                    className="text-primary hover:underline font-medium flex items-center cursor-pointer"
                  >
                    Speaker Data
                    <SquareArrowOutUpRight size={13} />
                  </div>{" "}
                  database.
                </div>
              </Section>
            </div>
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
      <CSVModel
        isOpen={uploadCSV}
        onClose={() => dispatch(setUploadCSV(false))}
        title="Speakers"
        isLoading={isUploadSpeakerCSV}
        onSubmit={UploadSpeakerCSV}
        description="Upload CSV file to create Speaker entries. CSV Columns: firstname, lastname, prefix, designation, company, bio, external_link, keyNote"
        path="/speakers_list.csv"
      />
    </div>
  );
};

export default SpeakersDesign_page;
