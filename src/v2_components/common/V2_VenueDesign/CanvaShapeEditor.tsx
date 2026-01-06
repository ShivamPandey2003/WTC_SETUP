import ColorSize from "@/data/Color&Size";
import { cn } from "@/lib/utils";
import type { AppDispatch, RootState } from "@/redux/store";
import { setShapes } from "@/redux/venueDesignV2Slice";
import { Lock, LockOpen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

type prop = {
  id: string;
};

const CanvaShapeEditor = ({ id }: prop) => {
  const { Shapes } = useSelector((state: RootState) => state.Venue_Design_V2);
  const dispatch = useDispatch<AppDispatch>();

  const Shape = Shapes.find((pre) => pre.id === id);

  return (
    <div className="absolute top-2/6 left-1 px-2">
      <div className="py-4 px-4 w-fit mx-auto border border-border shadow-lg rounded-lg bg-white">
        {!Shape ? (
          <div>Something is wrong</div>
        ) : Shape.type === "IMAGE" ? (
          <div>Image Don't Have Styles</div>
        ) : (
          <>
            <div className="flex flex-col mb-6">
              <label htmlFor="color" className="text-xs mb-2 capitalize">
                Stroke
              </label>
              <div className="flex items-center gap-2">
                {ColorSize.Stroke.display.map((color) => (
                  <span
                    key={color}
                    className={`w-5 h-5 inline-block rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary`}
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      dispatch(
                        setShapes(
                          Shapes.map((pre) =>
                            pre.id === id ? { ...pre, strokeColor: color } : pre
                          )
                        )
                      )
                    }
                  />
                ))}
                <input
                  type="color"
                  id="color"
                  name="color"
                  list="color-presets"
                  value={Shape.strokeColor}
                  onChange={(e) =>
                    dispatch(
                      setShapes(
                        Shapes.map((pre) =>
                          pre.id === id
                            ? { ...pre, strokeColor: e.target.value }
                            : pre
                        )
                      )
                    )
                  }
                />
              </div>
              <datalist id="color-presets">
                {ColorSize.Stroke.list.map((color) => (
                  <option key={color} value={color} />
                ))}
              </datalist>
            </div>
            <div className="flex flex-col mb-6">
              <label htmlFor="color" className="text-xs mb-2 capitalize">
                Background
              </label>
              <div className="flex items-center gap-2">
                {ColorSize.Background.display.map((color) => (
                  <span
                    key={color}
                    className={cn(
                      `w-5 h-5 inline-block rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary`,
                      color === "#00000000" && "border border-border"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      dispatch(
                        setShapes(
                          Shapes.map((pre) =>
                            pre.id === id ? { ...pre, fillColor: color } : pre
                          )
                        )
                      )
                    }
                  />
                ))}
                <input
                  type="color"
                  id="color"
                  name="color"
                  list="color-presets"
                  value={Shape.fillColor}
                  onChange={(e) =>
                    dispatch(
                      setShapes(
                        Shapes.map((pre) =>
                          pre.id === id
                            ? { ...pre, fillColor: e.target.value }
                            : pre
                        )
                      )
                    )
                  }
                />
              </div>
              <datalist id="color-presets">
                {ColorSize.Background.list.map((color) => (
                  <option key={color} value={color} />
                ))}
              </datalist>
            </div>
            <div className="mb-6">
              <p className="text-xs mb-2 capitalize">Stroke Width</p>
              <div className="flex items-center gap-2">
                {Object.entries(ColorSize.Stroke_Width).map(([key, value]) => (
                  <p
                    key={key}
                    onClick={() =>
                      dispatch(
                        setShapes(
                          Shapes.map((pre) =>
                            pre.id === id ? { ...pre, strokeWidth: value } : pre
                          )
                        )
                      )
                    }
                    className=" cursor-pointer text-sm bg-white w-8 h-6 border border-border text-center rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary uppercase"
                  >
                    {key}
                  </p>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-xs mb-2 capitalize">Lock</p>
              <div
                onClick={() =>
                  dispatch(
                    setShapes(
                      Shapes.map((pre) =>
                        pre.id === id ? { ...pre, locked: !pre.locked } : pre
                      )
                    )
                  )
                }
              >
                {Shapes.find((pre) => pre.id === id)?.locked ? (
                  <Lock />
                ) : (
                  <LockOpen />
                )}
              </div>
            </div>
          </>
        )}
        {Shape && Shape.type === "TEXT" && (
          <div className="flex flex-col">
            <label htmlFor="" className="text-xs mb-2 capitalize">
              Text Size
            </label>
            <input
              type="Text"
              pattern="[0-9]{0,2}"
              inputMode="numeric"
              value={(Shape as TextShape).fontSize}
              className="px-2 outline-none border border-border rounded-md bg-gray-200"
              onChange={(e) =>
                dispatch(
                  setShapes(
                    Shapes.map((pre) =>
                      pre.id === id
                        ? ({
                            ...pre,
                            fontSize: Number(e.target.value),
                          } as TextShape)
                        : pre
                    )
                  )
                )
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvaShapeEditor;
