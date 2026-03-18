import { cn } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import dummy from "@/assets/Images/Dummy.png";

type prop = {
  x: number;
  y: number;
  id: string | null;
  onClose: () => void;
  filterId: string;
};

const TestMode = ({ id, x, y, onClose, filterId }: prop) => {
  const { GlobalMap } = useSelector(
    (state: RootState) => state.Venue_Design_V2,
  );

  const CurrentItem = useMemo(() => {
    if (!id || !filterId) return null;

    const Map = GlobalMap.find((pre) => pre.id === filterId);

    if (!Map) return null;

    const data = Map.programmes.find((pre) => pre.id === id);

    if (!data) return null;

    return data;
  }, [GlobalMap, id, filterId]);

  if (!id || !filterId || !CurrentItem) {
    return null;
  }

  return (
    <div
      className="fixed z-50 bg-white border border-border shadow-lg rounded-md px-3 py-2 text-sm"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="relative w-2xs">
        {[1].map((no, i) => (
          <div
            key={no}
            className={cn(
              "flex items-center gap-2 mb-2 cursor-pointer",
              i === 0 ? "border-none" : "border-b border-border",
            )}
          >
            <img
              src={CurrentItem.bg_image ?? dummy}
              alt={CurrentItem.title}
              className="w-12 h-12"
            />
            <div>
              <p>{CurrentItem.title}</p>
              <p className="text-xs line-clamp-1 ">{CurrentItem.description}</p>
            </div>
          </div>
        ))}

        <button className="mt-2 text-xs text-blue-600" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TestMode;
