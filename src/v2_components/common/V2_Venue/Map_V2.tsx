import { useCallback, useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage, Text, Image as KonvaImage } from "react-konva";
import { ACTIONS } from "@/data/Action";
import ShapesElement from "../V2_VenueDesign/Shapes";
import Konva from "konva";
import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import TestMode from "./TestMode";
import { useGetFloorPlanV2 } from "@/api/global_api/global_api";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const Map_V2 = () => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const imageCache = useRef<Record<string, HTMLImageElement>>({});
  const [, setImageTick] = useState(0);
  const [activeNode, setActiveNode] = useState<Konva.Shape | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    id: string | null;
  } | null>(null);
  const { FloorPlan, isPending, error } = useGetFloorPlanV2();
  const { searchParams } = useSelector(
    (state: RootState) => state.Global_Slice,
  );

  useEffect(() => {
    FloorPlan?.response.floor_map_list.forEach((shape) => {
      if (shape.type !== ACTIONS.IMAGE) return;

      if (!imageCache.current[shape.id]) {
        const img = new Image();
        img.src = (shape as ImageShape).image;

        img.onload = () => {
          imageCache.current[shape.id] = img;
          setImageTick((t) => t + 1);
        };
      }
    });
  }, [FloorPlan]);

  useEffect(() => {
    if (!searchParams) return;

    const stage = stageRef.current;
    if (!stage) return;
    const node = stage.findOne(`#${searchParams}`) as Konva.Shape | null;
    if (!node) return;

    focusOnShape(node, searchParams);
  }, [searchParams, stageRef.current]);

  const getTooltipPosition = (node: Konva.Node) => {
    const stage = stageRef.current;
    if (!stage) return null;

    // 1. Visual bounding box AFTER zoom & pan
    const box = node.getClientRect({ relativeTo: stage });

    // 2. Top-center of the shape
    const point = {
      x: box.x + box.width / 2,
      y: box.y,
    };

    // 3. Canvas position in viewport
    const containerRect = stage.container().getBoundingClientRect();

    return {
      x: containerRect.left + point.x,
      y: containerRect.top + point.y - 12, // offset above
    };
  };

  const focusOnShape = (node: Konva.Shape, id: string) => {
    if (activeNode && activeNode !== node) {
      const prevColor = activeNode.getAttr("originalStroke");
      if (prevColor) {
        activeNode.stroke(prevColor);
        activeNode.strokeWidth(2);
      }
    }

    if (!node.getAttr("originalStroke")) {
      node.setAttr("originalStroke", node.stroke());
    }

    node.stroke("#2563eb");
    node.strokeWidth(2);

    zoomToNode(node, 1.6, () => {
      const pos = getTooltipPosition(node);
      if (pos) setTooltip({ ...pos, id });
    });

    setActiveNode(node);
  };

  const zoomToNode = useCallback(
    (node: Konva.Node, scale = 1.5, onFinish?: () => void) => {
      if (!stageRef.current) return;

      const stage = stageRef.current;
      const stageWidth = stage.width();
      const stageHeight = stage.height();

      const nodeBox = node.getClientRect({ relativeTo: stage });

      const nodeCenter = {
        x: nodeBox.x + nodeBox.width / 2,
        y: nodeBox.y + nodeBox.height / 2,
      };

      const newPos = {
        x: stageWidth / 2 - nodeCenter.x * scale,
        y: stageHeight / 2 - nodeCenter.y * scale,
      };

      stage.to({
        scaleX: scale,
        scaleY: scale,
        x: newPos.x,
        y: newPos.y,
        duration: 0.3,
        easing: Konva.Easings.EaseInOut,
        onFinish,
      });
    },
    [],
  );

  const resetZoom = useCallback(() => {
    if (!stageRef.current) return;

    const stage = stageRef.current;

    stage.to({
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
      duration: 0.3,
      easing: Konva.Easings.EaseInOut,
    });
  }, []);

  function onClick(
    e: KonvaEventObject<MouseEvent, Node<NodeConfig>>,
    id: string,
  ) {
    const node = e.target as Konva.Shape;
    focusOnShape(node, id);
  }

  const closeTooltip = () => {
    if (activeNode) {
      const original = activeNode.getAttr("originalStroke");
      if (original) {
        activeNode.stroke(original);
        activeNode.strokeWidth(2);
      }
      activeNode.getStage()?.batchDraw();
    }

    setTooltip(null);
    setActiveNode(null);
    resetZoom();
  };

  if (isPending) {
    return <Skeleton className="w-full h-[70vh]" />;
  }

  if (error) {
    return null;
  }

  if (!FloorPlan?.response.floor_map_list.length) {
    return null;
  }

  return (
    <div
      className="w-full overflow-auto relative"
      style={{
        maxHeight: "500px",
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-y pan-x",
      }}
    >
      <Stage
        ref={stageRef}
        width={1200}
        height={600}
        draggable={false}
        style={{ touchAction: "auto" }}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            height={window.innerHeight}
            width={window.innerWidth}
            fill="#ffffff"
            id="bg"
            onClick={() => {
              closeTooltip();
            }}
          />
          {FloorPlan.response.floor_map_list.map((shape) => {
            switch (shape.type) {
              case ACTIONS.IMAGE: {
                const imgShape = shape as ImageShape;
                const img = imageCache.current[shape.id];
                if (!img) return null;
                return (
                  <KonvaImage
                    key={imgShape.id}
                    image={img}
                    x={imgShape.x}
                    y={imgShape.y}
                    width={imgShape.width}
                    height={imgShape.height}
                    draggable={false}
                    onClick={() => {
                      // 🔥 reset zoom
                      // resetZoom();
                    }}
                    listening={false}
                  />
                );
              }
              case ACTIONS.TEXT: {
                const text = shape as TextShape;
                return (
                  <Text
                    key={text.id}
                    //   ref={textRef}
                    text={text.text}
                    x={text.x}
                    y={text.y}
                    fontSize={text.fontSize}
                    stroke={text.strokeColor}
                    strokeWidth={text.strokeWidth}
                    fill={text.fillColor}
                    onClick={() => {}}
                    draggable={false}
                    width={120}
                    listening={false}
                  />
                );
              }
              default:
                return (
                  <ShapesElement
                    key={shape.id}
                    shape={shape}
                    isDraggable={false}
                    click={(e) => {
                      onClick(e, shape.id);
                    }}
                    transformEnd={() => {}}
                    dragEnd={() => {}}
                  />
                );
            }
          })}
        </Layer>
      </Stage>
      <TestMode
        id={tooltip?.id as string}
        x={tooltip?.x as number}
        y={tooltip?.y as number}
        onClose={closeTooltip}
      />
    </div>
  );
};

export default Map_V2;
