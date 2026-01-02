import Floor_Plan from "@/components/common/Venue_Design/Floor_Plan";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import Section from "@/components/global/Section";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Plus } from "lucide-react";
import React from "react";

const VenueDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6 relative">
        <AdminTitlebar
          Title="Venue Design"
          onSave={() => {}}
          show={Boolean(value !== "Session Data")}
        />
        {Boolean(value === "Session Data") && (
          <div className="absolute right-10 flex items-center gap-4">
            <Button onClick={() => {}} className="w-[100px] py-1 h-7">
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
              value={"Floor Plan"}
              className="text-[15px] font-semibold leading-[15px] px-0"
            >
              Floor Plan
            </TabsTrigger>
          </TabsList>
          <TabsContent value="General Settings">
            <Section title="WIP">
              <></>
            </Section>
          </TabsContent>
          <TabsContent value="Floor Plan">
            <Floor_Plan />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VenueDesign_page;
