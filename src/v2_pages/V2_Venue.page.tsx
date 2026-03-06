import { Button } from "@/components/ui/Button";
import {
  addToGoogleCalendar,
  cn,
  formatDate,
  formatForGoogleCalendar,
  normalizeLabel,
  normalizeTime,
} from "@/lib/utils";
import TextCard from "@/v2_components/common/V2_Venue/TextCard";
import { useEffect, useState } from "react";
// import MapText from "@/assets/Images/MapText.png";
import { Calendar, Link, Loader, Navigation } from "lucide-react";
import { useGetVenue } from "@/api/global_api/global_api";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import { Skeleton } from "@/components/ui/skeleton";
import Map_V2 from "@/v2_components/common/V2_Venue/Map_V2";
import { useSearchParams } from "react-router";
import { setSearchParams, setSearchParams2 } from "@/redux/GlobalSlice";
import { useGlobalV2GetFloorMapList } from "@/api/Venue_api/Venue_Design_api";
import { setTitle } from "@/redux/ModalSlice";

const apiKey = import.meta.env.VITE_REACT_GOOGLE_MAPS_API_KEY;

const V2_Venue_page = () => {
  const [currentTab, setCurrentTab] = useState<string>("getting there");
  const [selectedId, setSelectedId] = useState<string>("");
  const { V2_Global_FloorMapList, V2_Global_isFloorMapListPending } =
    useGlobalV2GetFloorMapList();
  const [searchParams] = useSearchParams();
  const { Venue, isPending, error } = useGetVenue();
  const dispatch = useDispatch<AppDispatch>();
  const {
    Venue: venue,
    conference_location,
    conference_end_date,
    conference_start_date,
    conference_start_time,
    conference_end_time,
    conference_title,
    searchParams: Params,
  } = useSelector((state: RootState) => state.Global_Slice);

  useEffect(() => {
    const venueId = searchParams.get("id");
    const shapeId = searchParams.get("venueid");
    if (venueId) {
      setCurrentTab("floor plan");
      dispatch(setSearchParams(venueId));
      dispatch(setSearchParams2(shapeId));
    }
  }, [searchParams]);

  function parseCoordinate(value: string): number {
    const num = parseFloat(value); // get numeric part
    const direction = value.replace(/[^NSEW]/g, ""); // detect N/S/E/W

    if (direction === "S" || direction === "W") {
      return -Math.abs(num);
    }
    return Math.abs(num);
  }

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${parseCoordinate(venue.getting_there.latitude)},${parseCoordinate(venue.getting_there.longitude)}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    if (
      V2_Global_FloorMapList?.response &&
      V2_Global_FloorMapList.response.length > 0
    ) {
      setSelectedId(V2_Global_FloorMapList.response[0].id);
    }
  }, [V2_Global_FloorMapList]);

  useEffect(() => {
    if (!Params) return;
    setSelectedId(Params);
  }, [Params]);

  useEffect(() => {
    dispatch(setTitle(null));
  }, []);

  if (isPending || V2_Global_isFloorMapListPending) {
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

  console.log(Venue)

  return (
    <div className="px-4 mx-auto pb-4">
      <div className="p-1 bg-white w-fit rounded-full flex gap-2 mb-4">
        <Button
          variant={currentTab === "getting there" ? "default" : "ghost"}
          className={cn("capitalize rounded-full p-2 w-28")}
          onClick={() => setCurrentTab("getting there")}
        >
          Getting There
        </Button>
        <Button
          variant={currentTab === "floor plan" ? "default" : "ghost"}
          className={cn("capitalize rounded-full p-2 w-28")}
          onClick={() => setCurrentTab("floor plan")}
        >
          floor Plan
        </Button>
      </div>
      {currentTab === "getting there" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="col-span-1 space-y-4">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
              <img
                src={Venue.response.bg_venue}
                alt="BG"
                className="w-full h-90 object-cover"
              />
            </div>
            <TextCard />
          </div>
          <div className="bg-white rounded-3xl h-fit overflow-hidden shadow-sm p-6">
            <LoadScriptNext
              loadingElement={<Skeleton className="w-full h-80 mb-8" />}
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
              <div className="flex justify-between mb-8">
                <div className="flex gap-6">
                  <Navigation strokeWidth={"1px"} />
                  <div>
                    <h3 className="text-lg font-bold">{conference_location}</h3>
                    {/* <p className="w-60 text-sm">
                      1001 Pl. Jean-Paul-Riopelle, Montréal, QC H2Y 0A3, Canada
                    </p> */}
                  </div>
                </div>
                <Button
                  onClick={openInGoogleMaps}
                  className="rounded-full bg-[#E5F6DD] text-[#666666] hover:bg-[#c9fcb0] hover:text-[#555555] text-sm w-36"
                >
                  Open in Maps
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-6">
                  <Calendar strokeWidth={"1px"} />
                  <div>
                    <h3 className="text-lg font-bold">
                      {`${formatDate(conference_start_date)} - ${formatDate(
                        conference_end_date,
                      )}`}
                    </h3>
                    <p className="w-60 text-sm">{`${normalizeTime(conference_start_time)} - ${normalizeTime(conference_end_time)}`}</p>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    addToGoogleCalendar({
                      title: conference_title,
                      start: formatForGoogleCalendar(
                        conference_start_date,
                        conference_start_time,
                      ),
                      end: formatForGoogleCalendar(
                        conference_end_date,
                        conference_end_time,
                      ),
                      location: conference_location,
                    })
                  }
                  className="rounded-full bg-[#E5F6DD] text-[#666666] hover:bg-[#c9fcb0] hover:text-[#555555] text-sm w-36"
                >
                  Add to calendar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {currentTab === "floor plan" && (
        <div className="w-full rounded-xl p-6 bg-white h-fit">
          <div className="flex items-center justify-between">
            <div className={cn("flex items-center gap-4")}>
              <div className="text-sm font-[500] w-[100px] shrink-0">
                {normalizeLabel("Floor Levels")}
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={selectedId as string}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="rounded outline-0 border border-gray-200 px-2 py-1 focus:border-primary mb-1 cursor-pointer"
                >
                  <option value="">{"Select an option"}</option>
                  {V2_Global_FloorMapList &&
                    V2_Global_FloorMapList.response.map((opt) => (
                      <option
                        key={opt.id}
                        value={opt.id}
                        className="cursor-pointer"
                      >
                        {opt.label}
                      </option>
                    ))}
                </select>
              </div>
              {V2_Global_FloorMapList?.response.find(
                (pre) => pre.id === selectedId,
              )?.iframe_url && (
                <a
                  target="_blank"
                  href={
                    V2_Global_FloorMapList?.response.find(
                      (pre) => pre.id === selectedId,
                    )?.iframe_url as string
                  }
                >
                  <Button className="capitalize" size={"sm"}>
                    Interactive Floor plan
                  </Button>
                </a>
              )}
            </div>
            <a
              href="/FloorPlan.pdf"
              target="_blank"
              className="flex items-center text-blue-600 gap-1"
            >
              <Link size={18} /> Floor Plan
            </a>
          </div>
          <div className="w-full">
            {V2_Global_FloorMapList?.response.find(
              (pre) => pre.id === selectedId,
            )?.image ? (
              <Map_V2 id={selectedId} />
            ) :(
              <iframe
                src={
                  V2_Global_FloorMapList?.response.find(
                    (pre) => pre.id === selectedId,
                  )?.iframe_url as string
                }
                className="w-full h-[65vh] mt-2"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default V2_Venue_page;
