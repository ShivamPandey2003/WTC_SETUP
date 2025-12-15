// import { useDeleteCategory } from "@/api/programme_design_api/Programme_design_api";
import { useProgrameDesignUpdate } from "@/api/global_api/global_api";
import { useGetSpeakerSetting } from "@/api/speaker_design_api/speaker_design_api";
import AddCategoryModel from "@/components/common/Programme_Design/AddCategoryModel";
import CreateModal from "@/components/common/Programme_Design/CreateModal";
import CustomTable from "@/components/common/Programme_Design/CustomTable";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import Section from "@/components/global/Section";
import TextStyleRow from "@/components/global/TextStyleRow";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import {
  cn,
  formatDate,
  getDatesInRangeFormatted,
  normalizeLabel,
} from "@/lib/utils";
import {
  setCategoryModal,
  setIsCreating,
  setSelectedDate,
} from "@/redux/ProgrammeDesignSlice";
import { setSpeakerSettings } from "@/redux/SpeakerDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  CalendarDays,
  Clock,
  Loader,
  Navigation,
  Plus,
  SquareArrowOutUpRight,
  X,
} from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProgrammeDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  // const {DeleteCategory, isDeleteCategoryPending} = useDeleteCategory()
  const { UpdateProgrammeDesign, isUpdateProgrammeDesignPending } =
    useProgrameDesignUpdate();
  const { isCreating, slectedDate } = useSelector(
    (state: RootState) => state.Programme_Design
  );
  const { SpeakerSettings } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice
  );
  const dispatch = useDispatch<AppDispatch>();
  const {
    SpeakerSettings: SettingsValue,
    isPending,
    error,
  } = useGetSpeakerSetting();
  const Dates = getDatesInRangeFormatted(
    SpeakerSettings.conference_start_date,
    SpeakerSettings.conference_end_date
  );

  useEffect(() => {
    const end = new Date(formatDate(SpeakerSettings.conference_end_date));
    const sel = new Date(slectedDate);

    if (end < sel) {
      dispatch(
        setSelectedDate(formatDate(SpeakerSettings.conference_end_date))
      );
    }
  }, [SpeakerSettings.conference_end_date, slectedDate, dispatch]);

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

  if (!SettingsValue || !SettingsValue.response) {
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
          Title="Programme Design"
          onSave={() => UpdateProgrammeDesign()}
          show={Boolean(value !== "Session Data")}
          loading={isUpdateProgrammeDesignPending}
        />
        {Boolean(value === "Session Data") && (
          <div className="absolute right-10 flex items-center gap-4">
            <div className="flex items-center gap-3">
              {Dates.map((date) => (
                <Button
                  onClick={() => dispatch(setSelectedDate(date))}
                  key={date}
                  variant={"ghost"}
                  className={cn(
                    "h-7",
                    date === slectedDate && "bg-border text-primary"
                  )}
                >
                  {date}
                </Button>
              ))}
            </div>
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
              Session Data
            </TabsTrigger>
          </TabsList>
          <TabsContent value="General Settings">
            <Section title="Basic info" ClassName="w-[80%]">
              <div className="grid sm:grid-cols-2 items-center">
                {Object.entries(SpeakerSettings)
                  .filter(([key]) => key.includes("conference"))
                  .map(([key, value], i) => (
                    <TextStyleRow
                      key={i}
                      label={normalizeLabel(key)}
                      value={String(value)}
                      onChange={(e) =>
                        dispatch(
                          setSpeakerSettings({ ...SpeakerSettings, [key]: e })
                        )
                      }
                      Icons={
                        key.includes("date")
                          ? CalendarDays
                          : key.includes("time")
                          ? Clock
                          : Navigation
                      }
                      classname={cn(key.includes("location") && "w-[400px]")}
                      containerClassname={cn(
                        key.includes("location") ? "col-span-2" : "col-span-1"
                      )}
                    />
                  ))}
              </div>
            </Section>
            <div className="flex items-start gap-4">
            <Section title="Session Configuration" ClassName="w-[38rem]">
              <div className="flex items-center py-2">
                <div className="w-40 text-sm font-medium">
                  {"Category Filters"}
                </div>
                <div className="flex items-center gap-4">
                  <p>Disabled</p>
                  <ToggleSwitch
                    isOpen={SpeakerSettings.category_filter}
                    setIsOn={() =>
                      dispatch(
                        setSpeakerSettings({
                          ...SpeakerSettings,
                          category_filter: !SpeakerSettings.category_filter,
                        })
                      )
                    }
                  />
                  <p>Enabled</p>
                </div>
              </div>
              <div className="flex items-center py-2">
                <div className="w-40 text-sm font-medium">
                  {"Category Filters"}
                </div>
                <div className="flex">
                  <div
                    className={cn(
                      "relative flex w-fit items-center gap-3 bg-[#1111110D] px-3 py-1 text-sm text-gray-600 rounded-[7px] text-center focus:border-[#318061] focus:outline-none focus:ring-1 focus:ring-[#318061] transition-colors"
                    )}
                  >
                    {SpeakerSettings.category_labels.map((str) => (
                      <div
                        key={str}
                        className="flex items-center gap-2 px-3 bg-white rounded-lg border border-transparent hover:border-gray-300"
                      >
                        {str}
                        <X size={18} />
                      </div>
                    ))}
                  </div>
                  <Button
                    variant={"link"}
                    onClick={() => dispatch(setCategoryModal(true))}
                  >
                    <Plus />
                    Add New
                  </Button>
                </div>
              </div>
            </Section>
            <Section title="Session Data">
              <p className="text-sm text-gray-700 flex gap-1">
                Data for info cards will be fetched from
                <a
                  href="#"
                  className="text-primary hover:underline font-medium flex items-center"
                >
                  Session Data
                  <SquareArrowOutUpRight size={13} />
                </a>
                database.
              </p>
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
      <AddCategoryModel />
    </div>
  );
};

export default ProgrammeDesign_page;
