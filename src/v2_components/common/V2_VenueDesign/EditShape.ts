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

const onPointerMoveSwitch = ({
  action,
  x,
  y,
  id,
  Shapes,
  dispatch,
}: AddShapeProps) => {
  switch (action) {
    case ACTIONS.RECTANGLE:
      dispatch(
        setShapes(
          Shapes.map((shape) => {
            if (shape.id === id) {
              return {
                ...shape,
                width: x - (shape as RectangleShape).x,
                height: y - (shape as RectangleShape).y,
              };
            }
            return shape;
          })
        )
      );
      break;
    case ACTIONS.CIRCLE:
      dispatch(
        setShapes(
          Shapes.map((shape) => {
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
          })
        )
      );
      break;
    case ACTIONS.ARROW:
      dispatch(
        setShapes(
          Shapes.map((shape) => {
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
          })
        )
      );
      break;
    case ACTIONS.SCRIBBLE:
      dispatch(
        setShapes(
          Shapes.map((shape) => {
            if (shape.id === id) {
              return {
                ...shape,
                points: [...(shape as ScribbleShape).points, x, y],
              };
            }
            return shape;
          })
        )
      );
      break;
    case ACTIONS.ERASER:
      dispatch(
        setShapes(
          Shapes.map((shape) => {
            if (shape.id === id) {
              return {
                ...shape,
                points: [...(shape as ScribbleShape).points, x, y],
                isErasing: true,
              };
            }
            return shape;
          })
        )
      );
      break;
    case ACTIONS.LINE:
      dispatch(
        setShapes(
          Shapes.map((shape) => {
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
          })
        )
      );
      break;
    case ACTIONS.STAR:
      dispatch(
        setShapes(
          Shapes.map((shape) => {
            if (shape.id === id) {
              const newRadius = Math.sqrt(
                (x - (shape as StarShape).x) ** 2 +
                  (y - (shape as StarShape).y) ** 2
              );
              return {
                ...shape,
                innerRadius: newRadius * 0.5,
                outerRadius: newRadius,
              };
            }
            return shape;
          })
        )
      );
      break;
    case ACTIONS.POLYGON:
      dispatch(
        setShapes(
          Shapes.map((shape) => {
            if (shape.id === id) {
              const newRadius = Math.sqrt(
                (x - (shape as PolygonShape).x) ** 2 +
                  (y - (shape as PolygonShape).y) ** 2
              );
              return {
                ...shape,
                radius: newRadius,
              };
            }
            return shape;
          })
        )
      );
  }
};

export default onPointerMoveSwitch;
