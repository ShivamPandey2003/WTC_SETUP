import { ACTIONS } from "@/data/Action";
import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { Arrow, Circle, Line, Rect, RegularPolygon, Star } from "react-konva";

type ShapesProps = {
  selectedId: string | null;
  shape: Shape;
  isDraggable: boolean;
  click: (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => void;
  dragEnd: (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => void;
  transformEnd: (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => void;
};

const ShapesElement = ({
  selectedId,
  shape,
  isDraggable,
  click,
  dragEnd,
  transformEnd,
}: ShapesProps) => {
  switch (shape.type) {
    case ACTIONS.RECTANGLE: {
      const rect = shape as RectangleShape;
      return (
        <Rect
        // opacity={(selectedId && selectedId !== shape.id)?0.5:1}
          id={rect.id}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          fill={rect.fillColor}
          stroke={
            (selectedId && selectedId !== shape.id)
              ? "#B2BEB5"
              : rect.strokeColor
                ? rect.strokeColor
                : "#000000"
          }
          strokeWidth={rect.strokeWidth !== null ? rect.strokeWidth : 2}
          draggable={isDraggable}
          onClick={click}
          type={ACTIONS.RECTANGLE}
          onDragEnd={dragEnd}
          onTransformEnd={transformEnd}
        />
      );
    }
    case ACTIONS.CIRCLE: {
      const circle = shape as CircleShape;
      return (
        <Circle
          id={circle.id}
          x={circle.x}
          y={circle.y}
          radius={circle.radius}
          fill={circle.fillColor}
          stroke={
            (selectedId && selectedId !== shape.id)
              ? "#B2BEB5"
              : circle.strokeColor
                ? circle.strokeColor
                : "#000000"
          }
          strokeWidth={circle.strokeWidth !== null ? circle.strokeWidth : 2}
          draggable={isDraggable}
          onClick={click}
          type={ACTIONS.CIRCLE}
          onDragEnd={dragEnd}
          onTransformEnd={transformEnd}
        />
      );
    }
    case ACTIONS.ARROW: {
      const arrow = shape as ArrowShape;
      return (
        <Arrow
          id={arrow.id}
          points={arrow.points}
          stroke={"#000000"}
          strokeWidth={2}
          fill={arrow.fillColor}
          draggable={isDraggable}
          onClick={click}
          type={ACTIONS.ARROW}
          onDragEnd={dragEnd}
          onTransformEnd={transformEnd}
        />
      );
    }
    case ACTIONS.LINE: {
      const line = shape as LineShape;
      return (
        <Line
          id={line.id}
          stroke={
            (selectedId && selectedId !== shape.id)
              ? "#B2BEB5"
              : line.strokeColor
                ? line.strokeColor
                : "#000000"
          }
          points={line.points}
          draggable={isDraggable}
          onClick={click}
          strokeWidth={line.strokeWidth !== null ? line.strokeWidth : 2}
          fill={line.fillColor}
          type={ACTIONS.LINE}
          onDragEnd={dragEnd}
          onTransformEnd={transformEnd}
        />
      );
    }
    case ACTIONS.STAR: {
      const star = shape as StarShape;
      return (
        <Star
          id={star.id}
          x={star.x}
          y={star.y}
          numPoints={star.numPoints}
          innerRadius={star.innerRadius}
          outerRadius={star.outerRadius}
          fill={star.fillColor}
         stroke={
            (selectedId && selectedId !== shape.id)
              ? "#B2BEB5"
              : star.strokeColor
                ? star.strokeColor
                : "#000000"
          }
          strokeWidth={star.strokeWidth !== null ? star.strokeWidth : 2}
          draggable={isDraggable}
          onClick={click}
          type={ACTIONS.STAR}
          onDragEnd={dragEnd}
          onTransformEnd={transformEnd}
        />
      );
    }
    case ACTIONS.POLYGON: {
      const polygon = shape as PolygonShape;
      return (
        <RegularPolygon
          id={polygon.id}
          x={polygon.x}
          y={polygon.y}
          sides={polygon.sides}
          radius={polygon.radius}
          fill={polygon.fillColor}
         stroke={
            (selectedId && selectedId !== shape.id)
              ? "#B2BEB5"
              : polygon.strokeColor
                ? polygon.strokeColor
                : "#000000"
          }
          strokeWidth={polygon.strokeWidth !== null ? polygon.strokeWidth : 2}
          draggable={isDraggable}
          onClick={click}
          type={ACTIONS.POLYGON}
          onDragEnd={dragEnd}
          onTransformEnd={transformEnd}
        />
      );
    }
    case ACTIONS.SCRIBBLE: {
      const pointShape = shape as PointShape;
      return (
        <Line
          id={pointShape.id}
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
          onDragEnd={dragEnd}
          onTransformEnd={transformEnd}
        />
      );
    }
    default:
      null;
      break;
  }
};

export default ShapesElement;
