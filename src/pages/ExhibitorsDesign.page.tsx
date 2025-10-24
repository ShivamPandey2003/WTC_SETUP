import Custom_Text_Row from "@/components/common/Exhibitors_Design/Custom_Text_Row";
import CustomTable from "@/components/common/Exhibitors_Design/CustomTable";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import GlobalModal from "@/components/global/GlobalModal";
import Section from "@/components/global/Section";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { Plus } from "lucide-react";
import React from "react";
import Dummy from '@/assets/Images/Avatar10.png'

const ExhibitorsDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  const [isModel, setIsModel] = React.useState<boolean>(false);
  const Obj = {
    Logo:Dummy,
    Name: "Epiroc",
    Category: "Diamond",
    URL: "https://epiroc.com",
    Email: "info@epiroc.com",
    Attachments: [
      "effect_of_ai_on_tunnelling.pdf",
      "effect_of_ai_on_tunnelling.ppt",
    ],
    "Booth Location": "Booth 10.1",
    Info: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6 relative">
        <AdminTitlebar
          Title="Exhibitor Design"
          onSave={() => {}}
          show={Boolean(value !== "Session Data")}
        />
        {Boolean(value === "Session Data") && (
          <div className="absolute right-10 flex items-center gap-4">
            <Button
              onClick={() => setIsModel(true)}
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
              className="text-[15px] font-[600] leading-[15px] px-0 mr-6"
            >
              General Settings
            </TabsTrigger>
            <TabsTrigger
              variant={"link"}
              value={"Session Data"}
              className="text-[15px] font-[600] leading-[15px] px-0"
            >
              Exhibitor Data
            </TabsTrigger>
          </TabsList>
          <TabsContent value="General Settings">
            <Section title="Basic info">
              <div className="mb-16">
                <h2 className="text-[14px] font-[500] leading-[15px]">
                  Exhibitor Categories & Order
                </h2>
                <Custom_Text_Row
                  index="1"
                  value="Diamond Partners"
                  color="#CDB054"
                />
                <Custom_Text_Row
                  index="2"
                  value="Platinum Partners"
                  color="#BFCD54"
                />
                <Custom_Text_Row
                  index="3"
                  value="Gold Partners"
                  color="#CD8C54"
                />
                <Custom_Text_Row
                  index="4"
                  value="Silver Partners"
                  color="#CFC193"
                />
              </div>
              <div>
                <div className="flex items-center py-2">
                  <div className="w-40 text-sm font-[500] mr-8">
                    {"Open links in new tab"}
                  </div>
                  <ToggleSwitch />
                </div>
                <div className="flex items-center py-2">
                  <div className="w-40 text-sm font-[500] mr-8">
                    {"Allow email exposure"}
                  </div>
                  <ToggleSwitch />
                </div>
                <div className="flex items-center py-2">
                  <div className="w-40 text-sm font-[500] mr-8">
                    {"Booth Location Required"}
                  </div>
                  <ToggleSwitch />
                </div>
              </div>
            </Section>
          </TabsContent>
          <TabsContent value="Session Data">
            <CustomTable />
          </TabsContent>
        </Tabs>
      </div>
      <GlobalModal
        isOpen={isModel}
        onClose={() => setIsModel(false)}
        Title="Add New Exhibitor for WTC 2026"
        Value={Obj}
        roundededImg={false}
      />
    </div>
  );
};

export default ExhibitorsDesign_page;
