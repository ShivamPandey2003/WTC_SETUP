import CustomTable from "@/components/common/Speaker_Design/CustomTable";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import GlobalModal from "@/components/global/GlobalModal";
import Section from "@/components/global/Section";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { Plus, SquareArrowOutUpRight } from "lucide-react";
import React from "react";
import Avatar from '@/assets/Images/Avatar1.png'

const SpeakersDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  const [isModel, setIsModel] = React.useState<boolean>(false);
  const Obj={
    Picture:Avatar,
    Name:"The effect of AI on tunnelling",
    Category:"Technical",
    Sessions:["Dr. Alex Johnson", "Dr. Leila Capstone"],
    Attachments:["effect_of_ai_on_tunnelling.pdf", "effect_of_ai_on_tunnelling.ppt"],
    LinkedIn:"https://documents.company.com/the-effect-of-ai-on-tunnelling/index.html",
    Bio:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting"
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6">
        <AdminTitlebar Title="Speakers Design" onSave={() => {}} show={Boolean(value !== "Session Data")} />
        {Boolean(value === "Session Data") && (
          <div className="absolute right-10 flex items-center gap-4">
            <Button onClick={() => setIsModel(true)} className="w-[100px] py-1 h-7">
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
      <GlobalModal isOpen={isModel} onClose={()=>setIsModel(false)} Title="Add New Speaker for WTC 2026" Value={Obj}/>
    </div>
  );
};

export default SpeakersDesign_page;
