import { ACTIONS } from "@/data/Action";
import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { Arrow, Circle, Line, Rect, RegularPolygon, Star } from "react-konva";

type ShapesProps = {
  shape: Shape;
  isDraggable: boolean;
  click: (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => void;
};

const ShapesElement = ({ shape, isDraggable, click }: ShapesProps) => {
  switch (shape.type) {
    case ACTIONS.RECTANGLE: {
      const rect = shape as RectangleShape;
      return (
        <Rect
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          fill={rect.fillColor}
          stroke={rect.strokeColor ? rect.strokeColor : "#000000"}
          strokeWidth={rect.strokeWidth !== null ? rect.strokeWidth : 2}
          draggable={isDraggable}
          onClick={click}
          type={ACTIONS.RECTANGLE}
        />
      );
    }
    case ACTIONS.CIRCLE: {
      const circle = shape as CircleShape;
      return (
        <Circle
          x={circle.x}
          y={circle.y}
          radius={circle.radius}
          fill={circle.fillColor}
          stroke={circle.strokeColor ? circle.strokeColor : "#000000"}
          strokeWidth={circle.strokeWidth !== null ? circle.strokeWidth : 2}
          draggable={isDraggable}
          onClick={click}
          type={ACTIONS.CIRCLE}
        />
      );
    }
    case ACTIONS.ARROW: {
      const arrow = shape as ArrowShape;
      return (
        <Arrow
          points={arrow.points}
          stroke={"#000000"}
          strokeWidth={2}
          fill={arrow.fillColor}
          draggable={isDraggable}
          onClick={click}
          type={ACTIONS.ARROW}
        />
      );
    }
    case ACTIONS.LINE: {
      const line = shape as LineShape;
      return (
        <Line
          stroke={line.strokeColor ? line.strokeColor : "#000000"}
          points={line.points}
          draggable={isDraggable}
          onClick={click}
          strokeWidth={line.strokeWidth !== null ? line.strokeWidth : 2}
          fill={line.fillColor}
          type={ACTIONS.LINE}
        />
      );
    }
    case ACTIONS.STAR: {
      const star = shape as StarShape;
      return (
        <Star
          x={star.x}
          y={star.y}
          numPoints={star.numPoints}
          innerRadius={star.innerRadius}
          outerRadius={star.outerRadius}
          fill={star.fillColor}
          stroke={star.strokeColor ? star.strokeColor : "#000000"}
          strokeWidth={star.strokeWidth !== null ? star.strokeWidth : 2}
          draggable={isDraggable}
          onClick={click}
          type={ACTIONS.STAR}
        />
      );
    }
    case ACTIONS.POLYGON: {
      const polygon = shape as PolygonShape;
      return (
        <RegularPolygon
          x={polygon.x}
          y={polygon.y}
          sides={polygon.sides}
          radius={polygon.radius}
          fill={polygon.fillColor}
          stroke={polygon.strokeColor ? polygon.strokeColor : "#000000"}
          strokeWidth={polygon.strokeWidth !== null ? polygon.strokeWidth : 2}
          draggable={isDraggable}
          onClick={click}
          type={ACTIONS.POLYGON}
        />
      );
    }
    case ACTIONS.SCRIBBLE: {
      const pointShape = shape as PointShape;
      return (
        <Line
          points={pointShape.points}
          stroke={
            pointShape.isErasing
              ? "#ffff"
              : pointShape.strokeColor
              ? pointShape.strokeColor
              : "#000000"
          }
          strokeWidth={
            pointShape.isErasing
              ? 30
              : pointShape.strokeWidth !== null
              ? pointShape.strokeWidth
              : 2
          } // 🔥 bigger width as eraser
          globalCompositeOperation={
            pointShape.isErasing ? "destination-out" : "source-over"
          }
          lineCap="round"
          lineJoin="round"
          draggable={isDraggable && !pointShape.isErasing}
          onClick={click}
        />
      );
    }
    default:
      null;
      break;
  }
};

export default ShapesElement;
