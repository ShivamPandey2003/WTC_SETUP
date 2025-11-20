// import { useDeleteCategory } from "@/api/programme_design_api/Programme_design_api";
import { useProgrameDesignUpdate } from "@/api/global_api/global_api";
import { useGetSpeakerSetting } from "@/api/speaker_design_api/speaker_design_api";
import AddCategoryModel from "@/components/common/Programme_Design/AddCategoryModel";
import CreateModal from "@/components/common/Programme_Design/CreateModal";
import CustomTable from "@/components/common/Programme_Design/CustomTable";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import Section from "@/components/global/Section";
import TextStyleRow from "@/components/global/TextStyleRow";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { cn, getDatesInRangeFormatted, normalizeLabel } from "@/lib/utils";
import { setCategoryModal, setIsCreating } from "@/redux/ProgrammeDesignSlice";
import { setSpeakerSettings } from "@/redux/SpeakerDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  CalendarDays,
  Clock,
  Navigation,
  Plus,
  SquareArrowOutUpRight,
  X,
} from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const ProgrammeDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  const Dates = getDatesInRangeFormatted("04-02-2026", "04-07-2026");
  // const {DeleteCategory, isDeleteCategoryPending} = useDeleteCategory()
  const {UpdateProgrammeDesign, isUpdateProgrammeDesignPending} = useProgrameDesignUpdate()
  const [select, setSelected] = React.useState<number>(0);
  const { isCreating } = useSelector(
    (state: RootState) => state.Programme_Design
  );
  const { SpeakerSettings } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice
  );
  const dispatch = useDispatch<AppDispatch>();
  const {} = useGetSpeakerSetting();

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
              {Dates.map((date, index) => (
                <Button
                  onClick={() => setSelected(index)}
                  key={date}
                  variant={"ghost"}
                  className={cn(
                    "h-7",
                    index === select && "bg-border text-primary"
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
            <Section title="Basic info">
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
            <Section title="Session Configuration">
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
                  <Button variant={"link"} onClick={() => dispatch(setCategoryModal(true))}>
                    <Plus />
                    Add New
                  </Button>
                </div>
              </div>
            </Section>
            <Section title="Session Data">
              <p className="text-sm text-gray-700 flex gap-1">
                Data for info cards will be fetched from{" "}
                <a
                  href="#"
                  className="text-primary hover:underline font-medium flex items-center"
                >
                  Session Data
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
      <AddCategoryModel/>
    </div>
  );
};

export default ProgrammeDesign_page;
