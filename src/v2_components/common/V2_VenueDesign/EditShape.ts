import { ACTIONS } from "@/data/Action";
import type { AppDispatch } from "@/redux/store";
import { setMap } from "@/redux/venueDesignV2Slice";

type AddShapeProps = {
  action: string;
  x: number;
  y: number;
  id: string;
  fillColor?: string;
  Map: MapT[];
  dispatch: AppDispatch;
  selectedFloor: string;
};

const onPointerMoveSwitch = ({
  action,
  x,
  y,
  id,
  selectedFloor,
  Map,
  dispatch,
}: AddShapeProps) => {
  switch (action) {
    case ACTIONS.RECTANGLE:
      dispatch(
        setMap(
          Map.map((pre) =>
            pre.id === selectedFloor
              ? {
                  ...pre,
                  map_list: pre.map_list.map((shape) => {
                    if (shape.id === id) {
                      return {
                        ...shape,
                        width: x - (shape as RectangleShape).x,
                        height: y - (shape as RectangleShape).y,
                      };
                    }
                    return shape;
                  }),
                }
              : pre,
          ),
        ),
      );
      break;
    case ACTIONS.CIRCLE:
      dispatch(
        dispatch(
          setMap(
            Map.map((pre) =>
              pre.id === selectedFloor
                ? {
                    ...pre,
                    map_list: pre.map_list.map((shape) => {
                      if (shape.id === id) {
                        return {
                          ...shape,
                          radius:
                            ((y - (shape as CircleShape).y) ** 2 +
                              (x - (shape as CircleShape).x) ** 2) **
                            0.5,
                        };
                      }
                      return shape;
                    }),
                  }
                : pre,
            ),
          ),
        ),
      );
      break;
    case ACTIONS.ARROW:
      dispatch(
        setMap(
          Map.map((pre) =>
            pre.id === selectedFloor
              ? {
                  ...pre,
                  map_list: pre.map_list.map((shape) => {
                    if (shape.id === id) {
                      return {
                        ...shape,
                        points: [
                          (shape as ArrowShape).points[0],
                          (shape as ArrowShape).points[1],
                          x,
                          y,
                        ],
                      };
                    }
                    return shape;
                  }),
                }
              : pre,
          ),
        ),
      );
      break;
    case ACTIONS.SCRIBBLE:
      dispatch(
        setMap(
          Map.map((pre) =>
            pre.id === selectedFloor
              ? {
                  ...pre,
                  map_list: pre.map_list.map((shape) => {
                    if (shape.id === id) {
                      return {
                        ...shape,
                        points: [...(shape as ScribbleShape).points, x, y],
                      };
                    }
                    return shape;
                  }),
                }
              : pre,
          ),
        ),
      );
      break;
    case ACTIONS.ERASER:
      dispatch(
        setMap(
          Map.map((pre) =>
            pre.id === selectedFloor
              ? {
                  ...pre,
                  map_list: pre.map_list.map((shape) => {
                    if (shape.id === id) {
                      return {
                        ...shape,
                        points: [...(shape as ScribbleShape).points, x, y],
                        isErasing: true,
                      };
                    }
                    return shape;
                  }),
                }
              : pre,
          ),
        ),
      );
      break;
    case ACTIONS.LINE:
      dispatch(
        setMap(
          Map.map((pre) =>
            pre.id === selectedFloor
              ? {
                  ...pre,
                  map_list: pre.map_list.map((shape) => {
                    if (shape.id === id) {
                      return {
                        ...shape,
                        points: [
                          (shape as LineShape).points[0],
                          (shape as LineShape).points[1],
                          x,
                          y,
                        ],
                      };
                    }
                    return shape;
                  }),
                }
              : pre,
          ),
        ),
      );
      break;
    case ACTIONS.STAR:
      dispatch(
        setMap(
          Map.map((pre) =>
            pre.id === selectedFloor
              ? {
                  ...pre,
                  map_list: pre.map_list.map((shape) => {
                    if (shape.id === id) {
                      const newRadius = Math.sqrt(
                        (x - (shape as StarShape).x) ** 2 +
                          (y - (shape as StarShape).y) ** 2,
                      );
                      return {
                        ...shape,
                        innerRadius: newRadius * 0.5,
                        outerRadius: newRadius,
                      };
                    }
                    return shape;
                  }),
                }
              : pre,
          ),
        ),
      );
      break;
    case ACTIONS.POLYGON:
      dispatch(
        setMap(
          Map.map((pre) =>
            pre.id === selectedFloor
              ? {
                  ...pre,
                  map_list: pre.map_list.map((shape) => {
                    if (shape.id === id) {
                      const newRadius = Math.sqrt(
                        (x - (shape as PolygonShape).x) ** 2 +
                          (y - (shape as PolygonShape).y) ** 2,
                      );
                      return {
                        ...shape,
                        radius: newRadius,
                      };
                    }
                    return shape;
                  }),
                }
              : pre,
          ),
        ),
      );
  }
};

export default onPointerMoveSwitch;
