import { Input } from "@/components/ui/Input";
import ColorSize from "@/data/Color&Size";
import { cn } from "@/lib/utils";
import type { AppDispatch, RootState } from "@/redux/store";
import { setMap } from "@/redux/venueDesignV2Slice";
import { Lock, LockOpen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

type prop = {
  id: string;
};

const CanvaShapeEditor = ({ id }: prop) => {
  const { id: SelectedId } = useParams<{ id: string }>();
  const { map } = useSelector((state: RootState) => state.Venue_Design_V2);
  const dispatch = useDispatch<AppDispatch>();

  const Shape = map
    .find((pre) => pre.id === SelectedId)
    ?.map_list.find((shape) => shape.id === id);

  return (
    <div className="absolute top-2/6 left-1 px-2">
      <div className="py-4 px-4 w-fit mx-auto border border-border shadow-lg rounded-lg bg-white">
        {!Shape ? (
          <div>Something is wrong</div>
        ) : Shape.type === "IMAGE" ? (
          <div>Image Don't Have Styles</div>
        ) : (
          <>
            {Shape.type !== "IMAGE" && Shape.type !== "TEXT" && (
              <div className="mb-6">
                <p className="text-xs mb-2 capitalize">Name</p>
                <div className="flex items-center gap-2">
                  <Input
                    className="outline-none border border-gray-200"
                    value={Shape.name ?? ""}
                    onChange={(e) =>
                      dispatch(
                        setMap(
                          map.map((pre) =>
                            pre.id === SelectedId
                              ? {
                                  ...pre,
                                  map_list: pre.map_list.map((shape) => {
                                    if (shape.id === id) {
                                      return { ...shape, name: e.target.value };
                                    }
                                    return shape;
                                  }),
                                }
                              : pre,
                          ),
                        ),
                      )
                    }
                  />
                </div>
              </div>
            )}
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
                        setMap(
                          map.map((pre) =>
                            pre.id === SelectedId
                              ? {
                                  ...pre,
                                  map_list: pre.map_list.map((shape) => {
                                    if (shape.id === id) {
                                      return { ...shape, strokeColor: color };
                                    }
                                    return shape;
                                  }),
                                }
                              : pre,
                          ),
                        ),
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
                      setMap(
                        map.map((pre) =>
                          pre.id === SelectedId
                            ? {
                                ...pre,
                                map_list: pre.map_list.map((shape) => {
                                  if (shape.id === id) {
                                    return {
                                      ...shape,
                                      strokeColor: e.target.value,
                                    };
                                  }
                                  return shape;
                                }),
                              }
                            : pre,
                        ),
                      ),
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
                      color === "#00000000" && "border border-border",
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      dispatch(
                        setMap(
                          map.map((pre) =>
                            pre.id === SelectedId
                              ? {
                                  ...pre,
                                  map_list: pre.map_list.map((shape) => {
                                    if (shape.id === id) {
                                      return {
                                        ...shape,
                                        fillColor: color,
                                      };
                                    }
                                    return shape;
                                  }),
                                }
                              : pre,
                          ),
                        ),
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
                      setMap(
                        map.map((pre) =>
                          pre.id === SelectedId
                            ? {
                                ...pre,
                                map_list: pre.map_list.map((shape) => {
                                  if (shape.id === id) {
                                    return {
                                      ...shape,
                                      fillColor: e.target.value,
                                    };
                                  }
                                  return shape;
                                }),
                              }
                            : pre,
                        ),
                      ),
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
                        setMap(
                          map.map((pre) =>
                            pre.id === SelectedId
                              ? {
                                  ...pre,
                                  map_list: pre.map_list.map((shape) => {
                                    if (shape.id === id) {
                                      return {
                                        ...shape,
                                        strokeWidth: value,
                                      };
                                    }
                                    return shape;
                                  }),
                                }
                              : pre,
                          ),
                        ),
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
                    setMap(
                      map.map((pre) =>
                        pre.id === SelectedId
                          ? {
                              ...pre,
                              map_list: pre.map_list.map((shape) => {
                                if (shape.id === id) {
                                  return {
                                    ...shape,
                                    locked: !Shape.locked,
                                  };
                                }
                                return shape;
                              }),
                            }
                          : pre,
                      ),
                    ),
                  )
                }
              >
                {Shape?.locked ? <Lock /> : <LockOpen />}
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
                  setMap(
                    map.map((pre) =>
                      pre.id === SelectedId
                        ? {
                            ...pre,
                            map_list: pre.map_list.map((shape) => {
                              if (shape.id === id) {
                                return {
                                  ...shape,
                                  fontSize: Number(e.target.value),
                                };
                              }
                              return shape;
                            }),
                          }
                        : pre,
                    ),
                  ),
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
