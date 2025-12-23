import { Button } from "@/components/ui/Button";
import { cn, formatDate } from "@/lib/utils";
import TextCard from "@/v2_components/common/V2_Venue/TextCard";
import { useState } from "react";
import BG from "@/assets/Images/BG.jpg";
// import MapText from "@/assets/Images/MapText.png";
import { Calendar, Link, Loader, Navigation } from "lucide-react";
import Stage from "@/assets/Images/FloorPlan.png";
import { useGetVenue } from "@/api/global_api/global_api";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import { Skeleton } from "@/components/ui/skeleton";

const apiKey = import.meta.env.VITE_REACT_GOOGLE_MAPS_API_KEY;

const V2_Venue_page = () => {
  const [currentTab, setCurrentTab] = useState<string>("getting there");
  const { Venue, isPending, error } = useGetVenue();
  const {
    Venue: venue,
    conference_location,
    conference_end_date,
    conference_start_date,
  } = useSelector((state: RootState) => state.Global_Slice);

  function parseCoordinate(value: string): number {
    const num = parseFloat(value); // get numeric part
    const direction = value.replace(/[^NSEW]/g, ""); // detect N/S/E/W

    if (direction === "S" || direction === "W") {
      return -Math.abs(num);
    }
    return Math.abs(num);
  }

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
    <div className="px-4 mx-auto">
      <div className="p-1 bg-white w-fit rounded-full flex gap-2 mb-4">
        <Button
          variant={currentTab === "getting there" ? "default" : "ghost"}
          className={cn("capitalize rounded-full p-2 w-[7rem]")}
          onClick={() => setCurrentTab("getting there")}
        >
          Getting There
        </Button>
        <Button
          variant={currentTab === "floor plan" ? "default" : "ghost"}
          className={cn("capitalize rounded-full p-2 w-[7rem]")}
          onClick={() => setCurrentTab("floor plan")}
        >
          floor Plan
        </Button>
      </div>
      {currentTab === "getting there" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="col-span-1 space-y-4">
            <TextCard />
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
              <img src={BG} alt="BG" className="w-full h-90 object-cover" />
            </div>
          </div>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm p-6">
            <LoadScriptNext
              loadingElement={
                <Skeleton className="w-full h-[20rem] mb-8" />
              }
              googleMapsApiKey={apiKey}
            >
              <GoogleMap
                mapContainerClassName="w-full h-[20rem] mb-8"
                center={{
                  lat: parseCoordinate(venue.getting_there.latitude),
                  lng: parseCoordinate(venue.getting_there.longitude),
                }}
                options={{
                  disableDefaultUI: true,
                }}
                zoom={12}
              >
                <Marker
                  position={{
                    lat: parseCoordinate(venue.getting_there.latitude),
                    lng: parseCoordinate(venue.getting_there.longitude),
                  }}
                />
              </GoogleMap>
            </LoadScriptNext>
            {/* <img
              src={MapText}
              alt="MapText"
              className="w-full h-[20rem] object-cover object-top mb-8"
            /> */}
            <div className="h-1/2">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-6">
                  <Navigation strokeWidth={"1px"} />
                  <div>
                    <h3 className="text-lg font-bold">{conference_location}</h3>
                    <p className="w-[15rem] text-sm">
                      1001 Pl. Jean-Paul-Riopelle, Montréal, QC H2Y 0A3, Canada
                    </p>
                  </div>
                </div>
                <Button className="rounded-full bg-[#E5F6DD] text-[#666666] hover:bg-[#c9fcb0] hover:text-[#555555] text-sm w-[9rem]">
                  Open in Maps
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-6">
                  <Calendar strokeWidth={"1px"} />
                  <div>
                    <h3 className="text-lg font-bold">
                      {`${formatDate(conference_start_date)} - ${formatDate(
                        conference_end_date
                      )}`}
                    </h3>
                    <p className="w-[15rem] text-sm">07:30 AM - 17:30 PM</p>
                  </div>
                </div>
                <Button className="rounded-full bg-[#E5F6DD] text-[#666666] hover:bg-[#c9fcb0] hover:text-[#555555] text-sm w-[9rem]">
                  Add to calendar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {currentTab === "floor plan" && (
        <div className="w-full rounded-xl p-6 bg-white">
          <img
            src={Stage}
            alt="Stage"
            className="object-contain w-full h-[70vh]"
          />
          <a href="/FloorPlan.pdf" target="_blank" className="flex items-center text-blue-600"><Link size={18}/> Floor Plan</a>
        </div>
      )}
    </div>
  );
};

export default V2_Venue_page;
