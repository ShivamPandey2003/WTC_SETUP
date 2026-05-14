import { useCallback, useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage, Text, Image as KonvaImage } from "react-konva";
import { ACTIONS } from "@/data/Action";
import ShapesElement from "../V2_VenueDesign/Shapes";
import Konva from "konva";
import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
// import { useIsMobile } from "@/hooks/use-mobile";
import { isBase64Image } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router";
import { setSelectedFloor, setSelectedNode } from "@/redux/MapSlice";

interface prop {
  id: string;
}

const Map_V2 = ({ id }: prop) => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const {appConfig} = useSelector((state:RootState)=>state.Global_DesignSlice)
  const imageCache = useRef<Record<string, HTMLImageElement>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  // const isMobile = useIsMobile();
  const [, setImageTick] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const [FloorPlan, setFloorPlan] = useState<
    (MapT & { programmes: Programme[] }) | null
  >(null);
  const navigate = useNavigate();
  const [activeNode, setActiveNode] = useState<Konva.Shape | null>(null);
  const shapeID = searchParams.get("venueid");
  const { GlobalMap } = useSelector(
    (state: RootState) => state.Venue_Design_V2,
  );

  useEffect(() => {
    const value = GlobalMap.find((pre) => pre.id === id);
    if (!value) return;
    if (FloorPlan?.id !== value.id) {
      resetZoom()
      setSelectedId(null)
    }
    setFloorPlan(value);
  }, [id]);

  useEffect(() => {
    if (!FloorPlan) return;
    FloorPlan.map_list.forEach((shape) => {
      if (shape.type !== ACTIONS.IMAGE) return;

      if (!imageCache.current[shape.id]) {
        const img = new Image();
        img.src = isBase64Image((shape as ImageShape).image)
          ? (shape as ImageShape).image
          : `data:image/png;base64,${(shape as ImageShape).image}`;

        img.onload = () => {
          imageCache.current[shape.id] = img;
          setImageTick((t) => t + 1);
        };
      }
    });
  }, [FloorPlan]);

  useEffect(() => {
    if (!shapeID) {
      dispatch(setSelectedNode(null))
      return
    };

    dispatch(setSelectedNode(shapeID));
    const stage = stageRef.current;
    if (!stage) return;
    const node = stage.findOne(`#${shapeID}`) as Konva.Shape | null;
    if (!node) return;
    focusOnShape(node, shapeID);
  }, [shapeID, FloorPlan]);

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

    node.stroke(appConfig.color_schema.primary_color);
    node.strokeWidth(2);

    zoomToNode(node, 2.2);

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
  }, [searchParams]);

  function onClick(
    e: KonvaEventObject<MouseEvent, Node<NodeConfig>>,
    id: string,
  ) {
    const node = e.target as Konva.Shape;
    dispatch(setSelectedNode(id));
    setSelectedId(id);
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
    const params = new URLSearchParams(location.search);

    params.delete("programmeid");
    params.delete("venueid");
    params.delete("id");

    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      { replace: true },
    );
    dispatch(setSelectedNode(null));
    dispatch(setSelectedFloor(null));
    setActiveNode(null);
    setSelectedId(null);
    resetZoom();
  };

  return (
    <div
      className="w-full overflow-auto relative cursor-pointer"
      style={{
        maxHeight: "66vh",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Stage
        ref={stageRef}
        width={1200}
        height={600}
        // draggable={isMobile}
        // style={{ touchAction: "auto" }}
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
          {FloorPlan?.map_list.map((shape) => {
            switch (shape.type) {
              case ACTIONS.IMAGE: {
                const imgShape = shape as ImageShape;
                const img = imageCache.current[shape.id];
                if (!img) return null;
                return (
                  <KonvaImage
                    // opacity={selectedId ? 0.5 : 1}
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
                    selectedId={selectedId}
                    key={shape.id}
                    shape={shape}
                    isDraggable={false}
                    click={(e:any) => {
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
      {/* <TestMode
        id={tooltip?.id as string}
        x={tooltip?.x as number}
        y={tooltip?.y as number}
        filterId={id}
        onClose={closeTooltip}
        programmeId={searchParams.get("programmeid") as string}
      /> */}
    </div>
  );
};

export default Map_V2;
