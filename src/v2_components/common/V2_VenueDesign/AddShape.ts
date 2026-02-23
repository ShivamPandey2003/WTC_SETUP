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

const onPointerDownSwitch = ({
  action,
  x,
  y,
  id,
  fillColor = "#00000000",
  Map,
  selectedFloor,
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
                  map_list: [
                    ...pre.map_list,
                    {
                      type: ACTIONS.RECTANGLE,
                      id,
                      x,
                      y,
                      height: 20,
                      width: 20,
                      fillColor,
                      strokeColor: "#000000",
                      strokeWidth: 2,
                    },
                  ],
                }
              : pre,
          ),
        ),
      );
      break;
    case ACTIONS.CIRCLE:
      dispatch(
        setMap(
          Map.map((pre) =>
            pre.id === selectedFloor
              ? {
                  ...pre,
                  map_list: [
                    ...pre.map_list,
                    {
                      type: ACTIONS.CIRCLE,
                      id,
                      x,
                      y,
                      radius: 20,
                      fillColor,
                      strokeColor: "#000000",
                      strokeWidth: 2,
                    },
                  ],
                }
              : pre,
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
                  map_list: [
                    ...pre.map_list,
                    {
                      type: ACTIONS.ARROW,
                      id,
                      points: [x, y, x + 20, y + 20],
                      fillColor,
                      strokeColor: "#000000",
                      strokeWidth: 2,
                    },
                  ],
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
                  map_list: [
                    ...pre.map_list,
                    {
                      type: ACTIONS.SCRIBBLE,
                      id,
                      points: [x, y],
                      fillColor,
                      strokeColor: "#000000",
                      strokeWidth: 2,
                    },
                  ],
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
                  map_list: [
                    ...pre.map_list,
                    {
                      type: ACTIONS.SCRIBBLE,
                      id,
                      points: [x, y],
                      isErasing: true, // 🔥 mark as eraser stroke
                    },
                  ],
                }
              : pre,
          ),
        ),
      );
      break;
    case ACTIONS.TEXT:
      dispatch(
        setMap(
          Map.map((pre) =>
            pre.id === selectedFloor
              ? {
                  ...pre,
                  map_list: [
                    ...pre.map_list,
                    {
                      type: ACTIONS.TEXT,
                      id,
                      text: "you can write here",
                      x,
                      y,
                      width: 200,
                      fontSize: 20,
                      fillColor:
                        fillColor === "#00000000" ? "#000000" : fillColor,
                      isErasing: true, // 🔥 mark as eraser stroke
                    },
                  ],
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
                  map_list: [
                    ...pre.map_list,
                    {
                      type: ACTIONS.LINE,
                      id,
                      points: [x, y, x + 20, y + 20],
                      fillColor,
                      strokeColor: "#000000",
                      strokeWidth: 2,
                    },
                  ],
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
                  map_list: [
                    ...pre.map_list,
                    {
                      type: ACTIONS.STAR,
                      id,
                      x,
                      y,
                      innerRadius: 30,
                      outerRadius: 70,
                      numPoints: 5,
                      fillColor,
                      strokeColor: "#000000",
                      strokeWidth: 2,
                    },
                  ],
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
                  map_list: [
                    ...pre.map_list,
                    {
                      type: ACTIONS.POLYGON,
                      id: id,
                      x,
                      y,
                      sides: 6,
                      radius: 70,
                      fillColor,
                      strokeWidth: 2,
                      strokeColor: "#000000",
                    },
                  ],
                }
              : pre,
          ),
        ),
      );
      break;
  }
};

export default onPointerDownSwitch;
