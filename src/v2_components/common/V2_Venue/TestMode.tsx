import { cn, formatDateDisplay } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import { X } from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";

type prop = {
  x: number;
  y: number;
  id: string | null;
  onClose: () => void;
  filterId: string;
  programmeId?: string;
};

const TestMode = ({ id, x, y, onClose, filterId, programmeId }: prop) => {
  const { GlobalMap } = useSelector(
    (state: RootState) => state.Venue_Design_V2,
  );
  const navigate = useNavigate();
  const location = useLocation();

  const CurrentItem = useMemo(() => {
    if (!id || !filterId) return null;

    const Map = GlobalMap.find((pre) => pre.id === filterId);

    if (!Map) return null;

    const Shape = Map.map_list.find((pre) => pre.id === id);

    const data = programmeId
      ? Map.programmes.filter((pre) => pre.session_id === programmeId)
      : Map.programmes.filter((pre) => pre.venue_id === `${filterId}__${id}`);

    if (!data) return null;

    return {
      data,
      shape: Shape,
    };
  }, [GlobalMap, id, filterId]);

  if (!id || !filterId || !CurrentItem) {
    return null;
  }

  return (
    <div
      className="fixed z-50 bg-white border border-border shadow-xl rounded-lg px-3 py-2 text-sm"
      style={{
        left: x,
        top: y - 60,
        width: "325px",
        transform: "translateX(-50%)",
      }}
    >
      <div className="relative">
        {/* HEADER */}
        <div className="flex items-center gap-3 sm:gap-4 w-full mb-4">
          <p
            style={{
              color: "#318061",
            }}
            className="font-semibold min-w-fit text-xs sm:text-base"
          >
            {CurrentItem.shape?.name}
          </p>

          <div
            className="w-full h-1 rounded-full shadow-sm"
            style={{
              background: "#318061",
            }}
          />
          <X
            onClick={() => {
              const params = new URLSearchParams(location.search);

              params.delete("programmeid");
              params.delete("venueid");
              params.delete("id");

              navigate(
                {
                  pathname: location.pathname,
                  search: params.toString(),
                },
                { replace: true },
              );

              onClose();
            }}
          />
        </div>

        {/* CONTENT */}
        <div className={cn("mb-2 cursor-pointer max-h-[20vh] overflow-auto")}>
          {CurrentItem.data.map((value) => {
            return (
              <div
                key={value.id}
                className={cn(
                  "w-full flex-col items-start px-3 py-2 rounded-lg border transition-colors mb-2",
                  "data-[active=false]:bg-gray-50 data-[active=false]:border-transparent data-[active=false]:text-gray-600 hover:bg-gray-100",
                  "data-[active=true]:bg-primary/10 data-[active=true]:border-primary/20 data-[active=true]:text-primary data-[active=true]:shadow-none",
                )}
                onClick={()=>{
                  navigate(`/programme?date=${value.start_date}&programmeid=${value.session_id}`, {replace:true})
                }}
              >
                <span className="text-xs font-medium opacity-60">
                  {formatDateDisplay(value.start_date)} /{" "}
                  {`${value.start_time.slice(0, 5)} – ${value.end_time.slice(0, 5)}`}
                </span>
                <div className="text-sm font-semibold line-clamp-2 whitespace-normal text-start mt-0.5">
                  {value.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestMode;
