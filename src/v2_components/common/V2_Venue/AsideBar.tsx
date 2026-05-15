import { cn, formatDateDisplay } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router";

interface Props {
  VenueId: string;
}

const AsideBar = ({ VenueId }: Props) => {
  const { GlobalMap } = useSelector(
    (state: RootState) => state.Venue_Design_V2,
  );
  const { selectedNode } = useSelector((state: RootState) => state.Venue_Map);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const programmeId = searchParams.get("programmeid");

  const CurrentItem = React.useMemo(() => {
    if (!VenueId) return null;

    const Map = GlobalMap.find((pre) => pre.id === VenueId);

    if (!Map) return null;

    const Shape = Map.map_list.find((pre) => pre.id === selectedNode);

    const data = Map.programmes.filter(
      (pre) => pre.venue_id === `${VenueId}__${selectedNode}`,
    );

    if (!data) return null;

    return {
      data,
      shape: Shape,
      Map: Map,
    };
  }, [GlobalMap, programmeId, VenueId, selectedNode]);

  useEffect(() => {
      if (programmeId && selectedRef.current && listRef.current) {
        selectedRef.current.scrollIntoView({ block: "nearest" });
      }
    }, [programmeId]);

  if (!CurrentItem) return null;

  return (
    <div className="bg-white border border-border shadow-xl rounded-lg px-3 py-2 text-sm h-full">
      <div className="flex items-center gap-3 sm:gap-4 w-full mb-4">
        <p
          style={{
            color: "#318061",
          }}
          className="font-semibold min-w-fit text-xs sm:text-sm"
        >
          {CurrentItem.Map.label} - {CurrentItem.shape?.name}
        </p>

        <div
          className="w-full h-1 flex-1 rounded-full shadow-sm"
          style={{
            background: "#318061",
          }}
        />
      </div>
      <div ref={listRef} className={cn("mb-2 max-h-[58vh] overflow-auto")}>
        {CurrentItem.data.map((value) => {
          const isActive = value.session_id === programmeId;

          return (
            <div
              ref={isActive ? selectedRef : null}
              data-active={isActive}
              key={value.id}
              className={cn(
                "w-full flex-col items-start px-3 py-2 rounded-lg border transition-colors mb-2 bg-gray-50 shadow cursor-default",
                "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100",
                "data-[active=true]:bg-primary/10 data-[active=true]:border-primary/20 data-[active=true]:text-primary data-[active=true]:shadow-none",
              )}
              onClick={() => {
                const params = new URLSearchParams(location.search);

                params.set("programmeid", value.session_id);
                navigate(
                  {
                    pathname: location.pathname,
                    search: params.toString(),
                  },
                  { replace: true },
                );
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium opacity-60">
                  {formatDateDisplay(value.start_date)} /{" "}
                  {`${value.start_time.slice(0, 5)} – ${value.end_time.slice(0, 5)}`}
                </span>
                <span
                  onClick={() => {
                    navigate(
                      `/programme?date=${value.start_date}&programmeid=${value.session_id}`,
                      { replace: true },
                    );
                  }}
                  className="text-primary text-xs font-semibold underline capitalize underline-offset-2 cursor-pointer"
                >
                  view
                </span>
              </div>
              <div className="text-sm font-semibold line-clamp-2 whitespace-normal text-start mt-0.5">
                {value.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AsideBar;
