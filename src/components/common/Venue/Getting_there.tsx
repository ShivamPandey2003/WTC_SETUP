// import MAP from "@/assets/Images/Map.png";
import Titlabar from "@/components/global/Titlabar";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import { Skeleton } from "@/components/ui/skeleton";

const apiKey = import.meta.env.VITE_REACT_GOOGLE_MAPS_API_KEY;

const Getting_there = () => {
  const { Venue, conference_location, conference_end_date, conference_start_date } = useSelector((state: RootState) => state.Global_Slice);

  function parseCoordinate(value: string): number {
    const num = parseFloat(value); // get numeric part
    const direction = value.replace(/[^NSEW]/g, ""); // detect N/S/E/W

    if (direction === "S" || direction === "W") {
      return -Math.abs(num);
    }
    return Math.abs(num);
  }

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center gap-4">
      <div className="lg:w-1/2">
        <h2 className="text-2xl mb-2 font-bold">
          {Venue.getting_there.sub_title}
        </h2>
        <LoadScriptNext
          loadingElement={<Skeleton className="w-full h-[400px] mb-4 lg:hidden" />}
          googleMapsApiKey={apiKey}
        >
          <GoogleMap
            mapContainerClassName="lg:hidden w-full h-[400px] mb-4"
            center={{
              lat: parseCoordinate(Venue.getting_there.latitude),
              lng: parseCoordinate(Venue.getting_there.longitude),
            }}
            options={{
              disableDefaultUI: true,
            }}
            zoom={12}
          >
            <Marker
              position={{
                lat: parseCoordinate(Venue.getting_there.latitude),
                lng: parseCoordinate(Venue.getting_there.longitude),
              }}
            />
          </GoogleMap>
        </LoadScriptNext>
        {/* <img src={MAP} alt="MAP" className=" lg:hidden w-full h-[400px] mb-4" /> */}
        <p className="text-md">{Venue.getting_there.description}</p>
        {/* <p className="mb-2 text-md">
          Welcome to the second largest French-speaking metropolis in the world,
          a city where hospitality has a very French tone.
        </p>
        <p className="mb-2 text-md">
          Apart from the French language, don’t be surprised to hear more than
          30 languages spoken in the streets of this culturally rich and diverse
          city. Such is the urban mosaic of this vibrant metropolis located on
          an island in the St. Lawrence River. Here, the “joie de vivre” is
          synonymous with festivals, gastronomy, music, history, museums,
          tarmacs, street artists and espresso bars.
        </p>
        <p className="mb-2 text-md">
          Montreal is known as the hub of creativity and innovation in the
          development of the arts, multimedia and software, and is a leader in
          scientific research. Its four universities attract a dynamic student
          population. This city of culture and creativity offers its visitors a
          range of exciting options to choose from – dance, theatre, music,
          lectures, shopping, gastronomy, outdoor recreation… or simply soaking
          up its unique atmosphere.
        </p> */}
      </div>
      <div className="w-full lg:w-1/2">
        {/* <img
          src={MAP}
          alt="MAP"
          className=" hidden lg:block w-[900px] h-[400px] mb-4"
        /> */}
        <LoadScriptNext
          loadingElement={<Skeleton className="w-full h-[400px] mb-4" />}
          googleMapsApiKey={apiKey}
        >
          <GoogleMap
            mapContainerClassName="hidden lg:block w-full h-[400px] mb-4"
            center={{
              lat: parseCoordinate(Venue.getting_there.latitude),
              lng: parseCoordinate(Venue.getting_there.longitude),
            }}
            options={{
              disableDefaultUI: true,
            }}
            zoom={12}
          >
            <Marker
              position={{
                lat: parseCoordinate(Venue.getting_there.latitude),
                lng: parseCoordinate(Venue.getting_there.longitude),
              }}
            />
          </GoogleMap>
        </LoadScriptNext>
        <Titlabar
          location={conference_location}
          date={`${formatDate(conference_start_date)} - ${formatDate(
            conference_end_date
          )}`}
          className="justify-center xl:text-lg mb-4 w-full"
        />
        <div className="flex items-center w-full justify-center gap-[50px] sm:gap-[100px] md:gap-[130px]">
          <div>
            <Button variant={"link"}>Add to calendar</Button>
            <Button variant={"link"}>Notify me</Button>
          </div>
          <div>
            <Button variant={"link"}>Send to phone</Button>
            <Button variant={"link"}>Open in maps</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Getting_there;
