import { useEffect, useState } from "react";
import { LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router";
import {
  useDeleteFloorLevel,
  useV2GetFloorMApList,
} from "@/api/Venue_api/Venue_Design_api";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import {
  setEditFloorLevelModal,
  setFloorLevelModal,
} from "@/redux/venueDesignV2Slice";
import { cn, normalizeLabel } from "@/lib/utils";
import AddFloorLevelModel from "./AddFloorLevelModel";
import EditFloorLevelModel from "./EditFloorLevel";

const Floor_Plan = () => {
  const [floorPlan, setFloorPlan] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const Navigate = useNavigate();
  const { V2_FloorMapList, V2_isFloorMapListPending } = useV2GetFloorMApList();
  const { DeleteFloorLevel, isPending } = useDeleteFloorLevel();

  const GoToDesign = () => {
    Navigate(`/venue-design/design-floor-plan/${selectedId}`);
  };

  useEffect(() => {
    if (V2_FloorMapList?.response && V2_FloorMapList.response.length > 0) {
      setSelectedId(V2_FloorMapList.response[0].id);
    }
  }, [V2_FloorMapList]);

  useEffect(() => {
    if (selectedId && V2_FloorMapList) {
      const value = V2_FloorMapList.response.find(
        (Pre) => Pre.id === selectedId,
      );

      if (value) {
        setFloorPlan(value.image);
      }
    }
  }, [selectedId]);

  return (
    <div className="w-full rounded-xl bg-white h-[78vh] p-4">
      <div className="mb-10">
        <div className="flex w-full items-center justify-between gap-4">
          {!V2_isFloorMapListPending ? (
            <div className="flex gap-4">
              <div className={cn("flex items-center gap-4 py-2")}>
                <div className="text-sm font-[500] w-[100px] shrink-0">
                  {normalizeLabel("Floor Levels")}
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={selectedId as string}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="rounded outline-0 border border-gray-200 px-2 py-1 focus:border-primary mb-1"
                  >
                    <option value="">{"Select an option"}</option>
                    {V2_FloorMapList &&
                      V2_FloorMapList.response.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={"link"}
                  onClick={() => dispatch(setFloorLevelModal(true))}
                >
                  <Plus size={16} />
                  Add
                </Button>
                <Button
                  variant={"link"}
                  onClick={() => dispatch(setEditFloorLevelModal(true))}
                >
                  <Pencil size={16} />
                  Edit selected floor
                </Button>
                <Button
                  disabled={isPending}
                  variant={"link"}
                  className={cn(!isPending && "text-[#B85555]")}
                  onClick={() => DeleteFloorLevel({ id: selectedId })}
                >
                  {!isPending ? (
                    <>
                      <Trash2 size={16} />
                      Delete selected floor
                    </>
                  ) : (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      processing
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <LoaderCircle className="animate-spin text-primary" />
            </div>
          )}
          <Button onClick={GoToDesign}>Go To Design Floor Plan</Button>
        </div>
        {V2_isFloorMapListPending ? (
          <Skeleton className="w-full h-[60vh]" />
        ) : (
          <img
            src={floorPlan ? floorPlan : ""}
            alt="Stage"
            className="object-contain w-full h-[60vh]"
          />
        )}
      </div>
      <AddFloorLevelModel />
      <EditFloorLevelModel id={selectedId} />
    </div>
  );
};

export default Floor_Plan;
