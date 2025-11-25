import { useGetVenue } from "@/api/global_api/global_api";
import Floor_plan from "@/components/common/Venue/Floor_plan";
import Getting_there from "@/components/common/Venue/Getting_there";
import Travel_Information from "@/components/common/Venue/Travel_Information";
import Visa_Information from "@/components/common/Venue/Visa_Information";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Loader } from "lucide-react";

const Venue_page = () => {
  const { Venue, isPending, error } = useGetVenue();

  if (isPending) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center">
        <Loader className="text-primary animate-spin" size={30} />
        <p className="text-primary font-semibold text-lg">
          Venue details is loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay title="Venue Error" message={error.message} />
      </div>
    );
  }

  if (!Venue || !Venue.response) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="mx-[7.5%]">
      <Tabs defaultValue="Getting there">
        <TabsList className="mb-4 pl-49 xs:pl-0">
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
          <Floor_plan />
        </TabsContent>

        <TabsContent
          value="Visa Information"
          className="w-full flex justify-center"
        >
          <Visa_Information />
        </TabsContent>

        <TabsContent
          value="Travel Information"
          className="w-full flex justify-center"
        >
          <Travel_Information />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Venue_page;
