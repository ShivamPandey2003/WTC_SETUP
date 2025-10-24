import CustomTable from "@/components/common/Programme_Design/CustomTable";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import GlobalModal from "@/components/global/GlobalModal";
import Section from "@/components/global/Section";
import TextStyleRow from "@/components/global/TextStyleRow";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { cn, getDatesInRangeFormatted } from "@/lib/utils";
import {
  CalendarDays,
  Clock,
  Navigation,
  Plus,
  SquareArrowOutUpRight,
  X,
} from "lucide-react";
import React from "react";

const ProgrammeDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  const Dates = getDatesInRangeFormatted("04-02-2026", "04-07-2026");
  const [select, setSelected] = React.useState<number>(0);
  const [isModel, setIsModel] = React.useState<boolean>(false);
  const Obj = {
    Title:"The effect of AI on tunnelling",
    Category:"Technical",
    Location:"Hall 10, Main Building",
    "Start Time":"9:00am EST",
    "End Time":"10:00am EST",
    Speakers:["Dr. Alex Johnson","Dr. Leila Capstone"],
    Attachments:["effect_of_ai_on_tunnelling.pdf", "effect_of_ai_on_tunnelling.ppt"],
    "External Link":"https://documents.company.com/the-effect-of-ai-on-tunnelling/index.html",
    Description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6 relative">
        <AdminTitlebar
          Title="Programme Design"
          onSave={() => {}}
          show={Boolean(value !== "Session Data")}
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
                    index === select && "bg-[#31806126] text-primary"
                  )}
                >
                  {date}
                </Button>
              ))}
            </div>
            <Button onClick={() => setIsModel(true)} className="w-[100px] py-1 h-7">
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
              className="text-[15px] font-[600] leading-[15px] px-0 mr-6"
            >
              General Settings
            </TabsTrigger>
            <TabsTrigger
              variant={"link"}
              value={"Session Data"}
              className="text-[15px] font-[600] leading-[15px] px-0"
            >
              Session Data
            </TabsTrigger>
          </TabsList>
          <TabsContent value="General Settings">
            <Section title="Basic info">
              <div className="flex items-center gap-20">
                <TextStyleRow
                  label="Conference Start Date"
                  value="Tuesday, April 02, 2026"
                  onChange={() => {}}
                  Icons={CalendarDays}
                />
                <TextStyleRow
                  label="Conference End Date"
                  value="Sunday, April 07, 2026"
                  onChange={() => {}}
                  Icons={CalendarDays}
                />
              </div>
              <div className="flex items-center gap-20">
                <TextStyleRow
                  label="Conference Start Time"
                  value="Tuesday, April 02, 2026"
                  onChange={() => {}}
                  Icons={Clock}
                />
                <TextStyleRow
                  label="Conference End Time"
                  value="06:00 AM EST"
                  onChange={() => {}}
                  Icons={Clock}
                />
              </div>
              <TextStyleRow
                label="Conference Location"
                value="The Convention Center, Montreal, QC"
                onChange={() => {}}
                Icons={Navigation}
                classname="w-[400px]"
              />
            </Section>
            <Section title="Session Configuration">
              <div className="flex items-center py-2">
                <div className="w-40 text-sm font-[500]">
                  {"Category Filters"}
                </div>
                <div className="flex items-center gap-4">
                  <p>Disabled</p>
                  <ToggleSwitch />
                  <p>Enabled</p>
                </div>
              </div>
              <div className="flex items-center py-2">
                <div className="w-40 text-sm font-[500]">
                  {"Category Filters"}
                </div>
                <div className="flex">
                  <div
                    className={cn(
                      "relative flex w-fit items-center gap-3 bg-[#1111110D] px-3 py-1 text-sm text-gray-600 rounded-[7px] text-center focus:border-[#318061] focus:outline-none focus:ring-1 focus:ring-[#318061] transition-colors"
                    )}
                  >
                    {["Technical", "Activity", "Open", "Lunch"].map((str) => (
                      <div key={str} className="flex items-center gap-2 px-3 bg-white rounded-[8px] border border-transparent hover:border-gray-300">
                        {str}
                        <X size={18} />
                      </div>
                    ))}
                  </div>
                  <Button variant={'link'}><Plus/>Add New</Button>
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
      <GlobalModal size="lg" isOpen={isModel} onClose={()=>setIsModel(false)} Title={`Add New Session for ${Dates[select]}`} Value={Obj}/>
    </div>
  );
};

export default ProgrammeDesign_page;
