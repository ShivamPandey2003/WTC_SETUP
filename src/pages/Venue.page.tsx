import Floor_plan from "@/components/common/Venue/Floor_plan";
import Getting_there from "@/components/common/Venue/Getting_there";
import Travel_Information from "@/components/common/Venue/Travel_Information";
import Visa_Information from "@/components/common/Venue/Visa_Information";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

const Venue_page = () => {
  return (
    <div className="p-4">
      <Tabs defaultValue="Getting there">
        <TabsList className="mb-4">
          <TabsTrigger value="Getting there">Getting there</TabsTrigger>
          <TabsTrigger value="Floor Plan">Floor Plan</TabsTrigger>
          <TabsTrigger value="Visa Information">Visa Information</TabsTrigger>
          <TabsTrigger value="Travel Information">
            Travel Information
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Getting there">
          <Getting_there />
        </TabsContent>

        <TabsContent value="Floor Plan" className="w-full">
          <Floor_plan/>
        </TabsContent>

        <TabsContent value="Visa Information" className="w-full flex justify-center">
          <Visa_Information/>
        </TabsContent>

        <TabsContent value="Travel Information" className="w-full flex justify-center">
          <Travel_Information/>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Venue_page;
