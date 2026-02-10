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
  setUploadCSV,
} from "@/redux/ProgrammeDesignSlice";
import { setSpeakerSettings } from "@/redux/SpeakerDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader,
  Navigation,
  Plus,
  SquareArrowOutUpRight,
  Upload,
  X,
} from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpeakerCreateModal from "@/components/common/Speaker_Design/CreateModal";
import { setIsCreating as SetisSpeakerCreating } from "@/redux/SpeakerDesignSlice";
import CSVModel from "@/components/global/CSVModel";
import {
  useDeleteCategory,
  useGetCategoryAll,
  useUploadSessionsCSV,
} from "@/api/programme_design_api/Programme_design_api";

const ProgrammeDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { DeleteCategory, isDeleteCategoryPending } = useDeleteCategory();
  const { AllCategory, isPending: isCategoriesPending } = useGetCategoryAll();
  const { UpdateProgrammeDesign, isUpdateProgrammeDesignPending } =
    useProgrameDesignUpdate();
  const { UploadNewsCSV, isPending: isUploadSessionsCSV } =
    useUploadSessionsCSV();
  const { isCreating, slectedDate, uploadCSV } = useSelector(
    (state: RootState) => state.Programme_Design,
  );
  const { isCreating: isSpeakerCreating } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const { SpeakerSettings } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const dispatch = useDispatch<AppDispatch>();
  const {
    SpeakerSettings: SettingsValue,
    isPending,
    error,
  } = useGetSpeakerSetting();
  const Dates = getDatesInRangeFormatted(
    SpeakerSettings.conference_start_date,
    SpeakerSettings.conference_end_date,
  );

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const amount = 150; // px to scroll
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const end = new Date(formatDate(SpeakerSettings.conference_end_date));
    const sel = new Date(slectedDate);

    if (end < sel) {
      dispatch(
        setSelectedDate(formatDate(SpeakerSettings.conference_end_date)),
      );
    }
  }, [SpeakerSettings.conference_end_date, slectedDate, dispatch]);

  useEffect(() => {
    if (value !== "Session Data") return;

    const el = itemRefs.current[slectedDate];
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [slectedDate, value]);

  if (isPending || isCategoriesPending) {
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
          show={false}
          loading={isUpdateProgrammeDesignPending}
        />
        {Boolean(value === "Session Data") && (
          <div className="absolute right-10 top-23 flex items-center gap-4">
            <div className="w-full max-w-xl flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scroll("left")}
              >
                <ChevronLeft />
              </Button>
              <div className="overflow-hidden flex-1">
                <div
                  ref={scrollRef}
                  className="flex items-center gap-3 overflow-x-auto scroll-smooth"
                  style={{ scrollbarWidth: "none" }}
                >
                  {Dates.map((date) => (
                    <div
                      ref={(el) => {
                        itemRefs.current[date] = el;
                      }}
                      key={date}
                    >
                      <Button
                        onClick={() => dispatch(setSelectedDate(date))}
                        key={date}
                        variant={"ghost"}
                        className={cn(
                          "h-7 shrink-0",
                          date === slectedDate && "bg-border text-primary",
                        )}
                      >
                        {date}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scroll("right")}
              >
                <ChevronRight />
              </Button>
            </div>
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
              Add Session
            </Button>
          </div>
        )}
        <Tabs value={value} onValueChange={setValue} className="">
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
              Session Data
            </TabsTrigger>
          </TabsList>
          <TabsContent value="General Settings">
            <Section
              title="Basic info"
              ClassName="w-full"
              onSave={() => UpdateProgrammeDesign()}
              show={true}
              loading={isUpdateProgrammeDesignPending}
            >
              <div className="grid sm:grid-cols-2 items-center">
                <TextStyleRow
                  label={"Tab Title"}
                  value={SpeakerSettings.programme_tab}
                  onChange={(e) =>
                    dispatch(
                      setSpeakerSettings({
                        ...SpeakerSettings,
                        programme_tab: e,
                      }),
                    )
                  }
                  containerClassname="w-[25rem]"
                />
                {Object.entries(SpeakerSettings)
                  .filter(([key]) => key.includes("conference"))
                  .map(([key, value], i) => (
                    <TextStyleRow
                      key={i}
                      label={normalizeLabel(key)}
                      value={String(value)}
                      onChange={(e) =>
                        dispatch(
                          setSpeakerSettings({ ...SpeakerSettings, [key]: e }),
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
                        key.includes("location")
                          ? "col-span-2 w-[28.5rem]"
                          : "col-span-1 w-[25rem]",
                      )}
                    />
                  ))}
              </div>
            </Section>
            <div className="flex items-start gap-4">
              <Section
                title="Session Configuration"
                ClassName="w-3/5"
                onSave={() => UpdateProgrammeDesign()}
                show={true}
                loading={isUpdateProgrammeDesignPending}
              >
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
                          }),
                        )
                      }
                    />
                    <p>Enabled</p>
                  </div>
                </div>
                <div className="flex items-start justify-between py-2">
                  <div className="w-40 text-sm font-medium">
                    {"Category Filters"}
                  </div>
                  <div
                    className={cn(
                      "relative flex flex-wrap w-fit items-center gap-3 bg-[#1111110D] p-4 text-sm text-gray-600 rounded-[7px] text-center focus:border-[#318061] focus:outline-none focus:ring-1 focus:ring-[#318061] transition-colors",
                    )}
                  >
                    {/* {SpeakerSettings.category_labels */}
                    {AllCategory?.response
                      .filter((pre) => !Boolean(pre.type))
                      .map((str) => (
                        <button
                          key={str.id}
                          disabled={isDeleteCategoryPending}
                          className="flex items-center gap-4 px-3 bg-white rounded-lg border border-transparent hover:border-gray-300 cursor-pointer"
                        >
                          <span className="hover:text-primary font-semibold">
                            {str.name}
                          </span>
                          <X
                            size={18}
                            className="hover:text-primary"
                            onClick={() => DeleteCategory({ id: str.id })}
                          />
                        </button>
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
              </Section>
              <Section title="Session Data" ClassName="w-2/5">
                <div className="text-sm text-gray-700 flex gap-1">
                  Data for info cards will be fetched from
                  <div
                    onClick={() => setValue("Session Data")}
                    className="text-primary hover:underline font-medium flex items-center cursor-pointer"
                  >
                    Session Data
                    <SquareArrowOutUpRight size={13} />
                  </div>
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
      <SpeakerCreateModal
        isOpen={isSpeakerCreating}
        onClose={() => dispatch(SetisSpeakerCreating(false))}
      />
      <AddCategoryModel />
      <CSVModel
        isOpen={uploadCSV}
        onClose={() => dispatch(setUploadCSV(false))}
        title="Sessions"
        isLoading={isUploadSessionsCSV}
        onSubmit={UploadNewsCSV}
        description="Upload CSV file to create Sessions entries. CSV Columns: title, category, location, start_date, end_date, start_time, end_time, speakers, external_link, description"
        path="/session_entry.csv"
      />
    </div>
  );
};

export default ProgrammeDesign_page;
