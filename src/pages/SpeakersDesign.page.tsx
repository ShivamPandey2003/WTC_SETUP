import CustomTable from "@/components/common/Speaker_Design/CustomTable";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import Section from "@/components/global/Section";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { Plus, SquareArrowOutUpRight } from "lucide-react";
import React from "react";
import CreateModal from "@/components/common/Speaker_Design/CreateModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setIsCreating } from "@/redux/SpeakerDesignSlice";

const SpeakersDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  const {isCreating} = useSelector((state:RootState)=>state.Speaker_DesignSlice)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6">
        <AdminTitlebar Title="Speakers Design" onSave={() => {}} show={Boolean(value !== "Session Data")} />
        {Boolean(value === "Session Data") && (
          <div className="absolute right-10 flex items-center gap-4">
            <Button onClick={()=>dispatch(setIsCreating(true))} className="w-[100px] py-1 h-7">
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
              className="text-[15px] font-[600] leading-[15px] px-0 mr-6"
            >
              General Settings
            </TabsTrigger>
            <TabsTrigger
              variant={"link"}
              value={"Session Data"}
              className="text-[15px] font-[600] leading-[15px] px-0"
            >
              Speaker Data
            </TabsTrigger>
          </TabsList>
          <TabsContent value="General Settings">
            <Section title="Basic info">
              <div className="flex items-center py-2">
                <div className="w-40 text-sm font-[500]">
                  {"Show Full Names"}
                </div>
                <ToggleSwitch />
              </div>
              <div className="flex items-center py-2">
                <div className="w-40 text-sm font-[500]">
                  {"Show Short Names"}
                </div>
                <ToggleSwitch />
              </div>
              <div className="flex items-center py-2">
                <div className="w-40 text-sm font-[500]">
                  {"Show LinkedIn Badge"}
                </div>
                <ToggleSwitch />
              </div>
              <div className="flex items-center py-2">
                <div className="w-40 text-sm font-[500]">
                  {"Show # of Sessions"}
                </div>
                <ToggleSwitch />
              </div>
              <div className="flex items-center py-2">
                <div className="w-40 text-sm font-[500]">
                  {"Show Bio"}
                </div>
                <ToggleSwitch />
              </div>
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
      <CreateModal isOpen={isCreating} onClose={()=>dispatch(setIsCreating(false))}/>
    </div>
  );
};

export default SpeakersDesign_page;
