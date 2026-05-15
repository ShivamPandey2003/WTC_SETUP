import { Button } from "@/components/ui/Button";
import {
  addToGoogleCalendar,
  cn,
  formatDate,
  formatDateDisplay,
  formatForGoogleCalendar,
  normalizeLabel,
  normalizeTime,
} from "@/lib/utils";
import TextCard from "@/v2_components/common/V2_Venue/TextCard";
import React, { useEffect, useState } from "react";
import { Calendar, Link, Navigation } from "lucide-react";
import { useGetVenue } from "@/api/global_api/global_api";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import { Skeleton } from "@/components/ui/skeleton";
import Map_V2 from "@/v2_components/common/V2_Venue/Map_V2";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import { setSearchParams } from "@/redux/GlobalSlice";
import { useGlobalV2GetFloorMapList } from "@/api/Venue_api/Venue_Design_api";
import { setTitle } from "@/redux/ModalSlice";
import AsideBar from "@/v2_components/common/V2_Venue/AsideBar";
import {
  setSelectedFloor,
  setSelectedNode,
  setSelectedProgramme,
} from "@/redux/MapSlice";
import { useIsMobile } from "@/hooks/use-mobile";
import SingleSelect from "@/v2_components/global/SingleSelect";

const apiKey = import.meta.env.VITE_REACT_GOOGLE_MAPS_API_KEY;

const V2_Venue_page = () => {
  const [currentTab, setCurrentTab] = useState<string>("getting there");
  const [selectedId, setSelectedId] = useState<string>("");
  const { V2_Global_FloorMapList, V2_Global_isFloorMapListPending } =
    useGlobalV2GetFloorMapList();
  const [searchParams] = useSearchParams();
  const { Venue, isPending, error } = useGetVenue();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const venueId = searchParams.get("id");
  const programmeId = searchParams.get("programmeid");
  const isMobile = useIsMobile();

  const { GlobalMap } = useSelector(
    (state: RootState) => state.Venue_Design_V2,
  );

  const {
    Venue: venue,
    conference_location,
    conference_end_date,
    conference_start_date,
    conference_start_time,
    conference_end_time,
    conference_title,
  } = useSelector((state: RootState) => state.Global_Slice);
  const { selectedNode } = useSelector((state: RootState) => state.Venue_Map);

  useEffect(() => {
    if (venueId) {
      setCurrentTab("floor plan");
      dispatch(setSearchParams(venueId));
      setSelectedId(venueId);
    }
  }, [venueId]);

  const CurrentItem = React.useMemo(() => {
    if (!selectedId) return null;

    const Map = GlobalMap.find((pre) => pre.id === selectedId);

    if (!Map) return null;

    const Shape = Map.map_list.find((pre) => pre.id === selectedNode);

    const data = Map.programmes.filter(
      (pre) => pre.venue_id === `${selectedId}__${selectedNode}`,
    );

    if (!data) return null;

    const selected = data.find((pre) => pre.session_id === programmeId);

    return {
      data,
      shape: Shape,
      Map: Map,
      selectedProgramme: selected,
    };
  }, [GlobalMap, programmeId, selectedId, selectedNode]);

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
      V2_Global_FloorMapList.response.length > 0 &&
      !selectedId &&
      !venueId
    ) {
      setSelectedId(V2_Global_FloorMapList.response[0].id);
    }
  }, [V2_Global_FloorMapList]);

  useEffect(() => {
    dispatch(setTitle(null));
  }, []);

  if (isPending || V2_Global_isFloorMapListPending) {
    return (
      <div className="px-4 mx-auto pb-4">
        {/* Tab buttons */}
        <div className="p-1 bg-white w-fit rounded-full flex gap-2 mb-4">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="col-span-1 space-y-4">
            {/* Venue image */}
            <Skeleton className="w-full h-90 rounded-3xl" />
            {/* Text card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-3">
              <Skeleton className="h-7 w-40 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
            </div>
          </div>

          {/* Right column */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm p-6 space-y-6">
            {/* Map */}
            <Skeleton className="w-full h-[20rem] rounded-xl" />
            {/* Location row */}
            <div className="flex items-center justify-between">
              <div className="flex gap-6 items-center">
                <Skeleton className="h-6 w-6 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-52 rounded" />
                  <Skeleton className="h-4 w-36 rounded" />
                </div>
              </div>
              <Skeleton className="h-9 w-36 rounded-full" />
            </div>
            {/* Date row */}
            <div className="flex items-center justify-between">
              <div className="flex gap-6 items-center">
                <Skeleton className="h-6 w-6 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-56 rounded" />
                  <Skeleton className="h-4 w-28 rounded" />
                </div>
              </div>
              <Skeleton className="h-9 w-36 rounded-full" />
            </div>
          </div>
        </div>
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
          onClick={() => {
            setCurrentTab("floor plan");
          }}
        >
          floor Plan
        </Button>
      </div>
      {currentTab === "getting there" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="col-span-1 space-y-4">
            <div
              className={cn(
                "bg-white rounded-3xl overflow-hidden shadow-sm",
                Venue.response.bg_venue ? "bg-white" : "bg-gray-300 h-90",
              )}
            >
              {typeof Venue?.response?.bg_venue === "string" &&
                Venue.response.bg_venue.trim() !== "" && (
                  <img
                    src={Venue.response.bg_venue}
                    alt="BG"
                    className="w-full h-90 object-cover"
                  />
                )}
            </div>
            <TextCard />
          </div>
          <div className="bg-white rounded-3xl h-fit overflow-hidden shadow-sm p-6">
            {venue?.getting_there?.latitude &&
            venue?.getting_there?.longitude &&
            venue?.getting_there?.latitude.trim() &&
            venue?.getting_there?.longitude.trim() ? (
              <>
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
                    zoom={14}
                  >
                    <Marker
                      position={{
                        lat: parseCoordinate(venue.getting_there.latitude),
                        lng: parseCoordinate(venue.getting_there.longitude),
                      }}
                    />
                  </GoogleMap>
                </LoadScriptNext>
                <div className="h-1/2">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 justify-between mb-8">
                    <div className="flex gap-6">
                      <Navigation strokeWidth={"1px"} />
                      <div>
                        <h3 className="text-lg font-bold">
                          {conference_location}
                        </h3>
                      </div>
                    </div>
                    <Button
                      onClick={openInGoogleMaps}
                      className="rounded-full bg-[#E5F6DD] text-[#666666] hover:bg-[#c9fcb0] hover:text-[#555555] text-sm w-36"
                    >
                      Open in Maps
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:items-center justify-between">
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
              </>
            ) : (
              <Skeleton className="min-h-[69vh] shadow rounded-xl bg-gray-300" />
            )}
          </div>
        </div>
      )}
      {currentTab === "floor plan" && (
        <div className="w-full rounded-xl p-6 bg-white h-fit">
          <div className="flex items-start sm:items-center gap-2">
            <div
              className={cn(
                "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 w-1/2",
              )}
            >
              <div className="text-sm font-[500] w-[100px] shrink-0">
                {normalizeLabel("Floor Level")}
              </div>
              <div className="flex items-center gap-4 w-full">
                <SingleSelect
                  selected={selectedId as string}
                  onChange={(e) => {
                    dispatch(setSelectedNode(null));
                    const params = new URLSearchParams(location.search);

                    params.delete("programmeid");
                    params.delete("venueid");
                    params.set("id", e as string);

                    navigate(
                      {
                        pathname: location.pathname,
                        search: params.toString(),
                      },
                      { replace: true },
                    );
                    setSelectedId(e as string);
                  }}
                  options={
                    V2_Global_FloorMapList?.response.map((item) => ({
                      label: item.label,
                      value: item.id,
                    })) || []
                  }
                  placeholder="Floor Level"
                  className={cn("w-full sm:w-[200px] text-xs")}
                  capitalize
                />
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
            {typeof venue?.attachment === "string" &&
              venue?.attachment.trim() !== "" && (
                <a
                  href={venue.attachment}
                  target="_blank"
                  className="flex items-center text-blue-600 gap-1"
                >
                  <Link size={18} /> Floor Plan
                </a>
              )}
            {isMobile && selectedNode && (
              <div
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 w-1/2",
                )}
              >
                <div className="text-sm font-[500] w-[100px] shrink-0">
                  {normalizeLabel("Room")}
                </div>
                <SingleSelect
                  onChange={(e) => {
                    dispatch(setSelectedNode(e));
                    const params = new URLSearchParams(location.search);

                    params.delete("programmeid");
                    params.set("venueid", e as string);

                    navigate(
                      {
                        pathname: location.pathname,
                        search: params.toString(),
                      },
                      { replace: true },
                    );
                  }}
                  selected={selectedNode}
                  placeholder="Rooms"
                  options={
                    CurrentItem?.Map.map_list
                      .filter(
                        (i) => !["IMAGE", "TEXT", "SCRIBBLE"].includes(i.type),
                      )
                      .map((item) => ({
                        label: item.name || "",
                        value: item.id || "",
                      })) ?? []
                  }
                  className="w-full text-xs"
                  capitalize
                />
              </div>
            )}
          </div>
          {isMobile && selectedNode && (
            <div className="mb-2">
              <div className="text-sm font-[500] w-[100px] shrink-0">
                {normalizeLabel("Sessions")}
              </div>
              <SingleSelect
                onChange={(e) => {
                  const STR = e?.split("__");
                  dispatch(setSelectedNode(null));
                  dispatch(setSelectedFloor(null));
                  dispatch(setSelectedProgramme(null));
                  navigate(
                    `/programme?date=${STR?.[1]}&programmeid=${STR?.[0]}`,
                    { replace: true },
                  );
                }}
                selected={
                  CurrentItem?.selectedProgramme
                    ? `${CurrentItem.selectedProgramme.session_id}__${CurrentItem.selectedProgramme.start_date}`
                    : null
                }
                placeholder="Sessions"
                options={
                  CurrentItem?.data.map((item) => ({
                    label: item.title,
                    value: `${item.session_id}__${item.start_date}`,
                    start_time: `${formatDateDisplay(item.start_date)} / ${item.start_time}`,
                    end_time: item.end_time,
                  })) ?? []
                }
                className="w-full text-xs"
                capitalize
                Url
              />
            </div>
          )}
          <div className="w-full flex">
            {!isMobile && selectedNode && (
              <div className="w-[25%] h-[66vh] transition-all duration-200">
                <AsideBar VenueId={selectedId} />
              </div>
            )}
            {V2_Global_FloorMapList?.response &&
            V2_Global_FloorMapList?.response.length === 0 ? (
              <div className="w-full h-[65vh] mt-2 flex items-center justify-center">
                <NoData />
              </div>
            ) : V2_Global_FloorMapList?.response.find(
                (pre) => pre.id === selectedId,
              )?.image ? (
              <Map_V2 id={selectedId} />
            ) : (
              <iframe
                src={
                  V2_Global_FloorMapList?.response.find(
                    (pre) => pre.id === selectedId,
                  )?.iframe_url as string
                }
                className="w-full h-[65vh] mt-2"
              />
            )}
            {/* {isMobile && selectedNode && (
              <BottomDrawer isOpen={Boolean(isMobile && selectedNode)} VenueId={selectedId} />
            )} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default V2_Venue_page;
