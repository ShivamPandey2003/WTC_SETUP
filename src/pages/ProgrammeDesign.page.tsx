// import { useDeleteCategory } from "@/api/programme_design_api/Programme_design_api";
import { useProgrameDesignUpdate } from "@/api/global_api/global_api";
import { useGetSpeakerSetting } from "@/api/speaker_design_api/speaker_design_api";
import AddCategoryModel from "@/components/common/Programme_Design/AddCategoryModel";
import CreateModal from "@/components/common/Programme_Design/CreateModal";
import CustomTable from "@/components/common/Programme_Design/CustomTable";
import AdminTitlebar from "@/components/global/AdminTitlebar";
// import ErrorDisplay from "@/components/global/ErrorDisplay";
// import NoData from "@/components/global/NoData";
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
  Download,
  Loader,
  Navigation,
  Plus,
  SquareArrowOutUpRight,
  Upload,
} from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpeakerCreateModal from "@/components/common/Speaker_Design/CreateModal";
import { setIsCreating as SetisSpeakerCreating } from "@/redux/SpeakerDesignSlice";
import CSVModel from "@/components/global/CSVModel";
import {
  useDeleteCategory,
  useGetCategoryAll,
  useSessionDownload,
  useUploadSessionsCSV,
} from "@/api/programme_design_api/Programme_design_api";
import Custom_Text_Row from "@/components/common/Exhibitors_Design/Custom_Text_Row";
import DeleteModal from "@/components/global/DeleteModel";
import { setDeletingCategory } from "@/redux/ExhibitorSlice";
import { setResponseModal } from "@/redux/ModalSlice";
import ErrorModal from "@/components/global/ErrorModal";

const ProgrammeDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const {
    // SpeakerSettings: SettingsValue,
    isPending,
    // error,
  } = useGetSpeakerSetting();
  const { DeleteCategory, isDeleteCategoryPending } = useDeleteCategory();
  const { AllCategory, isPending: isCategoriesPending } = useGetCategoryAll();
  const { UpdateProgrammeDesign, isUpdateProgrammeDesignPending } =
    useProgrameDesignUpdate();
  const { downloadSession, isdownloadPending } = useSessionDownload();
  const { UploadNewsCSV, isPending: isUploadSessionsCSV } =
    useUploadSessionsCSV();
  const {
    isCreating,
    slectedDate,
    uploadCSV,
    session = [],
  } = useSelector((state: RootState) => state.Programme_Design);
  const { isCreating: isSpeakerCreating, SpeakerSettings } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );

  const { responseModal, responseData } = useSelector(
    (state: RootState) => state.model,
  );

  const { deletingCategory } = useSelector(
    (state: RootState) => state.ExhibitorSlice,
  );
  const dispatch = useDispatch<AppDispatch>();
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
    const start = new Date(formatDate(SpeakerSettings.conference_start_date));
    const sel = new Date(slectedDate);

    if (start > sel) {
      dispatch(
        setSelectedDate(formatDate(SpeakerSettings.conference_start_date)),
      );
    }

    if (end < sel) {
      dispatch(
        setSelectedDate(formatDate(SpeakerSettings.conference_end_date)),
      );
    }
  }, [SpeakerSettings.conference_end_date, dispatch]);

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

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <ErrorDisplay title="News Feed Error" message={error.message} />
  //     </div>
  //   );
  // }

  // if (!SettingsValue || !SettingsValue.response) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <NoData />
  //     </div>
  //   );
  // }

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
          <div className="absolute right-10 top-24 flex items-center gap-4">
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
                          date === slectedDate
                            ? "bg-primary text-white hover:bg-primary hover:text-white"
                            : "hover:bg-primary/10 hover:text-primary/80 hover:border hover:border-green-700 border border-gray-100",
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
            {session.length > 0 && (
              <Button
                onClick={() => downloadSession()}
                disabled={isdownloadPending}
                className="w-fit py-1 h-7 bg-green-50/50 border border-green-700 text-green-700 hover:text-white"
                title="Download Programme Data"
              >
                <Download />
              </Button>
            )}
            <Button
              onClick={() => dispatch(setUploadCSV(true))}
              className="w-fit py-1 h-7 bg-green-50/50 border border-green-700 text-green-700 hover:text-white"
              title="Upload Programme Data"
            >
              <Upload />
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
              Programme Data
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
                  .filter(
                    ([key]) =>
                      key.includes("conference") || key.includes("pdf"),
                  )
                  .sort(([a], [b]) => {
                    if (a.includes("location")) return 1; // move to end
                    if (b.includes("location")) return -1;
                    return 0;
                  })
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
                    {"Category Active"}
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
                <div className="py-2">
                  <div className="w-40 text-sm font-medium mb-4">
                    {"Category Filters"}
                  </div>
                  <div className="">
                    {AllCategory?.response
                      .filter((pre) => !Boolean(pre.type))
                      .map((data, index) => (
                        <Custom_Text_Row
                          type={data.type}
                          key={index}
                          id={data.id}
                          index={String(index + 1)}
                          value={data.name}
                          color={data.color}
                        />
                      ))}
                    <Button
                      onClick={() => dispatch(setCategoryModal(true))}
                      className="mt-4"
                      variant={"link"}
                    >
                      + Add category
                    </Button>
                  </div>
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
            {slectedDate && (
              <div className="text-sm pb-1 w-full text-gray-500">
                Showing programme data for {slectedDate}
              </div>
            )}
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
      <DeleteModal
        isOpen={Boolean(deletingCategory)}
        onClose={() => dispatch(setDeletingCategory(null))}
        onConfirm={() => DeleteCategory({ id: deletingCategory as string })}
        isDeleting={isDeleteCategoryPending}
      />
      <CSVModel
        CSV_MODULE="session_csv"
        isOpen={uploadCSV}
        onClose={() => dispatch(setUploadCSV(false))}
        title="Sessions"
        isLoading={isUploadSessionsCSV}
        onSubmit={UploadNewsCSV}
        description="Upload CSV file to create Sessions entries. CSV Columns: title, category, location, start_date, end_date, start_time, end_time, speakers, external_link, description"
        path="/programme.xlsx"
        type={{ ATTACHMENT: 3, IMAGE: 6 }}
        ImageDescription="Upload a ZIP file containing pdf for Sessions entries. The pdf file names should match the corresponding Image IDs."
      />
      {responseModal && (
        <ErrorModal
          isOpen={responseModal}
          onClose={() => dispatch(setResponseModal(false))}
          data={responseData}
        />
      )}
    </div>
  );
};

export default ProgrammeDesign_page;
