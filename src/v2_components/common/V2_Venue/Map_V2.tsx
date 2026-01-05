import { useCallback, useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage, Text, Image as KonvaImage } from "react-konva";
import Shapes from "@/data/TestData";
import { ACTIONS } from "@/data/Action";
import ShapesElement from "../V2_VenueDesign/Shapes";
import Konva from "konva";
import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import TestMode from "./TestMode";

const Map_V2 = () => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const imageCache = useRef<Record<string, HTMLImageElement>>({});
  const [, setImageTick] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeNode, setActiveNode] = useState<Konva.Shape | null>(null);

  useEffect(() => {
    Shapes.forEach((shape) => {
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
  }, [Shapes]);

  const zoomToNode = useCallback((node: Konva.Node, scale = 1.5) => {
    if (!stageRef.current) return;

    const stage = stageRef.current;

    const stageWidth = stage.width();
    const stageHeight = stage.height();

    // node absolute position
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
    });

    stage.position(newPos);
    stage.batchDraw();
  }, []);

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
    id: string
  ) {
    const node = e.target;
    zoomToNode(node, 1.6);
    if ((node as Konva.Shape).stroke) {
        (node as Konva.Shape).stroke("#2563eb");
      }
    setSelectedId(id);
    setActiveNode(node as Konva.Shape);
  }

  function closePopup() {
    if (activeNode) {
      // reset border
      activeNode.stroke("#000");
      activeNode.strokeWidth(2);
      activeNode.getStage()?.batchDraw();
    }
    setActiveNode(null);
    setSelectedId(null);
    resetZoom()
  }

  return (
    <div className="w-full overflow-auto max-h-[70vh]">
      <Stage
        ref={stageRef}
        width={1200}
        height={600}
        //   onPointerDown={onPointerDown}
        //   onPointerMove={onPointerMove}
        //   onWheel={handleWheel}
        //   onPointerUp={onPointerUp}
        draggable={false}
        onClick={() => {
          // 🔥 reset zoom
          //   resetZoom();
        }}
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
              resetZoom();
            }}
          />
          {Shapes.map((shape) => {
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
                      resetZoom();
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
      <TestMode id={selectedId} onClose={closePopup} />
    </div>
  );
};

export default Map_V2;
