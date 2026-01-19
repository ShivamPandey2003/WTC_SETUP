import Custom_Text_Row from "@/components/common/Exhibitors_Design/Custom_Text_Row";
import CustomTable from "@/components/common/Exhibitors_Design/CustomTable";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import Section from "@/components/global/Section";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { Loader, Plus } from "lucide-react";
import React from "react";
import CreateModal from "@/components/common/Exhibitors_Design/CreateModal";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { setIsCreating, setUploadCSV } from "@/redux/ExhibitorSlice";
import {
  useCategoryList,
  useGeneralExhibitorsUpdate,
} from "@/api/global_api/global_api";
import { useGetSpeakerSetting } from "@/api/speaker_design_api/speaker_design_api";
import { setSpeakerSettings } from "@/redux/SpeakerDesignSlice";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import CSVModel from "@/components/global/CSVModel";
import { useUploadExhibitorsCSV } from "@/api/exhibitor_design_api/exhibitor_design_api";

const ExhibitorsDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  const {UploadExhibitorsCSV, isPending: isUploadPending} = useUploadExhibitorsCSV()
  const {} = useCategoryList();
  const {
    SpeakerSettings: SettingValue,
    isPending,
    error,
  } = useGetSpeakerSetting();
  const { isCreating, Categorys, uploadCSV } = useSelector(
    (state: RootState) => state.ExhibitorSlice,
  );
  const { SpeakerSettings } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const dispatch = useDispatch();
  const { GeneralExhibitorsUpdate, isGeneralExhibitorsUpdatePending } =
    useGeneralExhibitorsUpdate();

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

  if (!SettingValue || !SettingValue.response) {
    return (
      <div className="flex items-center justify-center h-screen">
        <NoData />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6 relative">
        <AdminTitlebar
          Title="Exhibitor Design"
          onSave={() => GeneralExhibitorsUpdate()}
          show={Boolean(value !== "Session Data")}
          loading={isGeneralExhibitorsUpdatePending}
        />
        {Boolean(value === "Session Data") && (
          <div className="absolute right-10 flex items-center gap-4">
            <Button
              onClick={() => dispatch(setUploadCSV(true))}
              className="w-fit py-1 h-7"
            >
              <Plus />
              import CSV
            </Button>
            <Button
              onClick={() => dispatch(setIsCreating(true))}
              className="w-[100px] py-1 h-7"
            >
              <Plus />
              Add New
            </Button>
          </div>
        )}
        <Tabs defaultValue={value} onValueChange={setValue} className="">
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
              Exhibitor Data
            </TabsTrigger>
          </TabsList>
          <TabsContent value="General Settings">
            <Section title="Basic info" ClassName="w-full">
              <div className="mb-16">
                <h2 className="text-[14px] font-medium leading-[15px]">
                  Exhibitor Categories & Order
                </h2>
                {Categorys.map((data, index) => (
                  <Custom_Text_Row
                    key={index}
                    index={String(index + 1)}
                    value={data.name}
                    color={data.color}
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center py-2">
                  <div className="w-40 text-sm font-medium mr-8">
                    {"Open links in new tab"}
                  </div>
                  <ToggleSwitch
                    isOpen={
                      SpeakerSettings.exhibitor_settings.open_link_new_tab
                    }
                    setIsOn={() =>
                      dispatch(
                        setSpeakerSettings({
                          ...SpeakerSettings,
                          exhibitor_settings: {
                            ...SpeakerSettings.exhibitor_settings,
                            open_link_new_tab:
                              !SpeakerSettings.exhibitor_settings
                                .open_link_new_tab,
                          },
                        }),
                      )
                    }
                  />
                </div>
                <div className="flex items-center py-2">
                  <div className="w-40 text-sm font-medium mr-8">
                    {"Allow email exposure"}
                  </div>
                  <ToggleSwitch
                    isOpen={
                      SpeakerSettings.exhibitor_settings.allow_email_exposure
                    }
                    setIsOn={() =>
                      dispatch(
                        setSpeakerSettings({
                          ...SpeakerSettings,
                          exhibitor_settings: {
                            ...SpeakerSettings.exhibitor_settings,
                            allow_email_exposure:
                              !SpeakerSettings.exhibitor_settings
                                .allow_email_exposure,
                          },
                        }),
                      )
                    }
                  />
                </div>
                <div className="flex items-center py-2">
                  <div className="w-40 text-sm font-medium mr-8">
                    {"Booth Location Required"}
                  </div>
                  <ToggleSwitch
                    isOpen={SpeakerSettings.exhibitor_settings.booth_location}
                    setIsOn={() =>
                      dispatch(
                        setSpeakerSettings({
                          ...SpeakerSettings,
                          exhibitor_settings: {
                            ...SpeakerSettings.exhibitor_settings,
                            booth_location:
                              !SpeakerSettings.exhibitor_settings
                                .booth_location,
                          },
                        }),
                      )
                    }
                  />
                </div>
              </div>
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
      <CSVModel
        isOpen={uploadCSV}
        onClose={() => dispatch(setUploadCSV(false))}
        title="Exhibitors"
        isLoading={isUploadPending}
        onSubmit={UploadExhibitorsCSV}
        description="Upload CSV file to create Exhibitor entries. CSV Columns: full_name, url, email, category, ads"
        path="/exhibitors_listing.csv"
      />
    </div>
  );
};

export default ExhibitorsDesign_page;
