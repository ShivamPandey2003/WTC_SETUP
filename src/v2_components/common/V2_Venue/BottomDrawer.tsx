import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn, formatDateDisplay } from "@/lib/utils";
import {
  setSelectedFloor,
  setSelectedNode,
  setSelectedProgramme,
} from "@/redux/MapSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";

interface Props {
  isOpen: boolean;
  VenueId: string;
}

const BottomDrawer = ({ isOpen, VenueId }: Props) => {
  const { GlobalMap } = useSelector(
    (state: RootState) => state.Venue_Design_V2,
  );
  const { selectedNode } = useSelector((state: RootState) => state.Venue_Map);
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const programmeId = searchParams.get("programmeid");

  const CurrentItem = React.useMemo(() => {
    if (!VenueId) return null;

    const Map = GlobalMap.find((pre) => pre.id === VenueId);

    if (!Map) return null;

    const Shape = Map.map_list.find((pre) => pre.id === selectedNode);

    const data = programmeId
      ? Map.programmes.filter((pre) => pre.session_id === programmeId)
      : Map.programmes.filter(
          (pre) => pre.venue_id === `${VenueId}__${selectedNode}`,
        );

    if (!data) return null;

    return {
      data,
      shape: Shape,
      Map: Map,
    };
  }, [GlobalMap, programmeId, VenueId, selectedNode]);

  if (!CurrentItem) return;

  return (
    <Drawer
      open={isOpen}
      onClose={() => {
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
        dispatch(setSelectedNode(null));
      }}
    >
      <DrawerContent className="bg-white border-gray-300 shadow">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              {CurrentItem.Map.label} - {CurrentItem.shape?.name}
            </DrawerTitle>
          </DrawerHeader>
          <div
            className={cn(
              "mb-2 mx-4 cursor-pointer max-h-[35vh] overflow-auto",
            )}
          >
            {CurrentItem.data.map((value) => {
              return (
                <div
                  key={value.id}
                  className={cn(
                    "w-full flex-col items-start px-3 py-2 rounded-lg border transition-colors mb-2 border-gray-200 shadow",
                    "bg-gray-100 border-transparent text-gray-600 hover:bg-gray-100",
                  )}
                  onClick={() => {
                    dispatch(setSelectedNode(null));
                    dispatch(setSelectedFloor(null));
                    dispatch(setSelectedProgramme(null));
                    navigate(
                      `/programme?date=${value.start_date}&programmeid=${value.session_id}`,
                      { replace: true },
                    );
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
      </DrawerContent>
    </Drawer>
  );
};

export default BottomDrawer;
