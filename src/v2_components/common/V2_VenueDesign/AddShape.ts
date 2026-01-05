import { ACTIONS } from "@/data/Action";
import type { AppDispatch } from "@/redux/store";
import { setShapes } from "@/redux/venueDesignV2Slice";

type AddShapeProps = {
  action: string;
  x: number;
  y: number;
  id: string;
  fillColor?: string;
  Shapes: Shape[];
  dispatch: AppDispatch;
};

const onPointerDownSwitch = ({
  action,
  x,
  y,
  id,
  fillColor = "#00000000",
  Shapes,
  dispatch,
}: AddShapeProps) => {
  switch (action) {
    case ACTIONS.RECTANGLE:
      dispatch(
        setShapes([
          ...Shapes,
          {
            type: ACTIONS.RECTANGLE,
            id,
            x,
            y,
            height: 20,
            width: 20,
            fillColor,
            strokeColor:"#000000",
            strokeWidth:2
          },
        ])
      );
      break;
    case ACTIONS.CIRCLE:
      dispatch(
        setShapes([
          ...Shapes,
          {
            type: ACTIONS.CIRCLE,
            id,
            x,
            y,
            radius: 20,
            fillColor,
            strokeColor:"#000000",
            strokeWidth:2
          },
        ])
      );
      break;

    case ACTIONS.ARROW:
      dispatch(
        setShapes([
          ...Shapes,
          {
            type: ACTIONS.ARROW,
            id,
            points: [x, y, x + 20, y + 20],
            fillColor,
            strokeColor:"#000000",
            strokeWidth:2
          },
        ])
      );
      break;
    case ACTIONS.SCRIBBLE:
      dispatch(
        setShapes([
          ...Shapes,
          {
            type: ACTIONS.SCRIBBLE,
            id,
            points: [x, y],
            fillColor,
            strokeColor:"#000000",
            strokeWidth:2
          },
        ])
      );
      break;
    case ACTIONS.ERASER:
      dispatch(
        setShapes([
          ...Shapes,
          {
            type: ACTIONS.SCRIBBLE,
            id,
            points: [x, y],
            isErasing: true, // 🔥 mark as eraser stroke
          },
        ])
      );
      break;
    case ACTIONS.TEXT:
      dispatch(
        setShapes([
          ...Shapes,
          {
            type: ACTIONS.TEXT,
            id,
            text: "you can write here",
            x,
            y,
            width: 200,
            fontSize: 20,
            fillColor: fillColor === "#00000000" ? "#000000" : fillColor,
            isErasing: true, // 🔥 mark as eraser stroke
          },
        ])
      );
      break;
    case ACTIONS.LINE:
      dispatch(
        setShapes([
          ...Shapes,
          {
            type: ACTIONS.LINE,
            id,
            points: [x, y, x + 20, y + 20],
            fillColor,
            strokeColor:"#000000",
            strokeWidth:2
          },
        ])
      );
      break;
    case ACTIONS.STAR:
      dispatch(
        setShapes([
          ...Shapes,
          {
            type: ACTIONS.STAR,
            id,
            x,
            y,
            innerRadius: 30,
            outerRadius: 70,
            numPoints: 5,
            fillColor,
            strokeColor:"#000000",
            strokeWidth:2
          },
        ])
      );
      break;
    case ACTIONS.POLYGON:
      dispatch(
        setShapes([
          ...Shapes,
          {
            type: ACTIONS.POLYGON,
            id: id,
            x,
            y,
            sides: 6,
            radius: 70,
            fillColor,
            strokeWidth: 2,
            strokeColor:"#000000"
          },
        ])
      );
  }
};

export default onPointerDownSwitch;
