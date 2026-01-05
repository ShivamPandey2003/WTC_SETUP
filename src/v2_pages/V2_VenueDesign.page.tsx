import { ACTIONS, ActionsIcons } from "@/data/Action";
import ActionButton from "@/v2_components/common/V2_VenueDesign/ActionButton";
import {
  Layer,
  Rect,
  Stage,
  Transformer,
  Text,
  Image as KonvaImage,
} from "react-konva";
import { useCallback, useEffect, useRef, useState } from "react";
import type Konva from "konva";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  setAction,
  setSelectedId,
  setShapes,
} from "@/redux/venueDesignV2Slice";
import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { nanoid } from "nanoid";
import onPointerDownSwitch from "@/v2_components/common/V2_VenueDesign/AddShape";
import onPointerMoveSwitch from "@/v2_components/common/V2_VenueDesign/EditShape";
import ShapesElement from "@/v2_components/common/V2_VenueDesign/Shapes";
import TextEditor from "@/v2_components/common/V2_VenueDesign/TextArea";
import { Text as TextInstance } from "konva/lib/shapes/Text";
import { Lock, LockOpen } from "lucide-react";
import CanvaShapeEditor from "@/v2_components/common/V2_VenueDesign/CanvaShapeEditor";

const V2_VenueDesign_page = () => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const textRef = useRef<Konva.Text | null>(null);
  const isPaining = useRef<boolean>(false);
  const currentShapeId = useRef<string | null>(null);
  const imageCache = useRef<Record<string, HTMLImageElement>>({});

  const { action, Shapes, selectId } = useSelector(
    (state: RootState) => state.Venue_Design_V2
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [currentType, setCurrentType] = useState<string | null>(null);
  const [, setImageTick] = useState(0);
  const [textWidth, setTextWidth] = useState(200);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [currentTextNode, setCurrentTextNode] = useState<Konva.Text | null>(
    null
  );
  const [screenDrag, setScreenDrag] = useState<false | null>(null);

  const isDraggable = action === ACTIONS.SELECT;
  const isDrawing = action !== ACTIONS.SELECT;

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

  useEffect(() => {
    console.log(Shapes);
  }, [Shapes]);

  function onPointerUp() {
    isPaining.current = false;
  }

  function eraseShapeById(id: string) {
    dispatch(setShapes(Shapes.filter((shape) => shape.id !== id)));
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        dispatch(
          setShapes([
            ...Shapes,
            {
              type: ACTIONS.IMAGE,
              id: nanoid(),
              image: reader.result as string,
              x: 100,
              y: 100,
              width: img.width / 2,
              height: img.height / 2,
            },
          ])
        );
      };
    };

    reader.readAsDataURL(file);
  }

  function onPointerDown() {
    if (action === ACTIONS.SELECT) return;

    if (stageRef.current === null) return;

    const stage = stageRef.current;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    const { x, y } = pos;
    const id = nanoid();

    currentShapeId.current = id;
    isPaining.current = true;

    onPointerDownSwitch({ action, x, y, id, Shapes, dispatch });
  }

  function onPointerMove() {
    if (action === ACTIONS.SELECT || !isPaining.current) return;
    if (stageRef.current === null) return;
    if (currentShapeId.current === null) return;

    const stage = stageRef.current;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    const { x, y } = pos;

    onPointerMoveSwitch({
      action,
      x,
      y,
      id: currentShapeId.current,
      Shapes,
      dispatch,
    });
  }

  const handleWheel = (e: KonvaEventObject<WheelEvent, Node<NodeConfig>>) => {
    e.evt.preventDefault();
    if (stageRef.current === null) return;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    if (pointer === null) return;

    const scaleBy = 1.06;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    stage.scale({ x: newScale, y: newScale });

    stage.position({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });

    stage.batchDraw();
  };

  const handleTransform = useCallback(() => {
    const node = textRef.current;
    if (!node) return;
    const scaleX = node.scaleX();
    const newWidth = node.width() * scaleX;
    setTextWidth(newWidth);
    node.setAttrs({
      width: newWidth,
      scaleX: 1,
    });
  }, []);

  const handleTextDblClick = useCallback(
    (
      id: string,
      e:
        | KonvaEventObject<MouseEvent, Node<NodeConfig>>
        | KonvaEventObject<TouchEvent, Node<NodeConfig>>
    ) => {
      if (!transformerRef.current) return;
      const node = e.target;

      if (!(node instanceof TextInstance)) return;

      setEditingTextId(id);
      setCurrentTextNode(node); // ✅ now TS-safe
      setIsEditing(true);
      transformerRef.current.nodes([]);
    },
    []
  );

  const handleTextChange = useCallback(
    (newText: string) => {
      if (editingTextId) {
        dispatch(
          setShapes(
            Shapes.map((shape) =>
              shape.id === editingTextId ? { ...shape, text: newText } : shape
            )
          )
        );
      }
    },
    [editingTextId]
  );

  function onClick(
    e: KonvaEventObject<MouseEvent, Node<NodeConfig>>,
    id: string
  ) {
    const node = e.target;
    if (action === ACTIONS.ERASER) {
      transformerRef.current?.nodes([]);
      transformerRef.current?.getLayer()?.batchDraw();
      eraseShapeById(id);
    } else if (action === ACTIONS.SELECT) {
      if (!transformerRef.current) return;
      if (!node) return;
      dispatch(setSelectedId(id));
      setCurrentType(node.attrs.type || null);
      transformerRef.current.nodes([node]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }

  function OnDragEnd(
    e: KonvaEventObject<MouseEvent, Node<NodeConfig>>,
    id: string
  ) {
    const node = e.target;

    dispatch(
      setShapes(
        Shapes.map((s) =>
          s.id === id
            ? {
                ...s,
                x: node.x(),
                y: node.y(),
              }
            : s
        )
      )
    );
  }

  function OnTransformEnd(
    e: KonvaEventObject<Event, Node<NodeConfig>>,
    id: string
  ) {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // reset scale back to 1
    node.scaleX(1);
    node.scaleY(1);

    dispatch(
      setShapes(
        Shapes.map((s) =>
          s.id === id
            ? {
                ...s,
                x: node.x(),
                y: node.y(),
                width: Math.max(20, node.width() * scaleX),
                height: Math.max(20, node.height() * scaleY),
              }
            : s
        )
      )
    );
  }

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      {/*Controls */}
      <div className="absolute top-0 z-10 w-full py-2 ">
        <div className="flex justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border-border shadow-lg rounded-lg bg-white">
          {Object.entries(ACTIONS).map(([key, value]) => {
            switch (key) {
              case ACTIONS.IMAGE:
                return (
                  <button
                    key={key}
                    className={
                      action === ACTIONS.IMAGE
                        ? "bg-violet-300 p-1 rounded"
                        : "p-1 hover:bg-violet-100 rounded"
                    }
                  >
                    <label className="cursor-pointer">
                      🖼️
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload}
                      />
                    </label>
                  </button>
                );
              default:
                return (
                  <ActionButton
                    key={key}
                    Icon={ActionsIcons[key as keyof typeof ActionsIcons]?.icon}
                    action={action}
                    setAction={() => {
                      if (transformerRef.current)
                        transformerRef.current.nodes([]);
                      setCurrentTextNode(null);
                      dispatch(setAction(key));
                      dispatch(setSelectedId(null));
                    }}
                    ACTION={value}
                    size={ActionsIcons[key as keyof typeof ActionsIcons]?.size}
                  />
                );
            }
          })}
          <button
            className={"p-1 hover:bg-violet-100 rounded"}
            onClick={() =>
              setScreenDrag((pre) => (pre !== null ? null : false))
            }
          >
            {screenDrag === null ? <LockOpen /> : <Lock />}
          </button>
        </div>
      </div>
      {/* Canvas */}
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onWheel={handleWheel}
        onPointerUp={onPointerUp}
        draggable={screenDrag === null ? !isDrawing : screenDrag}
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
              if (transformerRef.current) transformerRef.current.nodes([]);
              setCurrentTextNode(null);
              dispatch(setSelectedId(null));
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
                    draggable={isDraggable}
                    onClick={(e) => onClick(e, imgShape.id)}
                    listening={true}
                    onDragEnd={(e) => OnDragEnd(e, imgShape.id)}
                    onTransformEnd={(e) => OnTransformEnd(e, imgShape.id)}
                  />
                );
              }
              case ACTIONS.TEXT: {
                const text = shape as TextShape;
                return (
                  <Text
                    key={text.id}
                    ref={textRef}
                    text={text.text}
                    x={text.x}
                    y={text.y}
                    fontSize={text.fontSize}
                    stroke={text.strokeColor}
                    strokeWidth={text.strokeWidth}
                    fill={text.fillColor}
                    onClick={(e) => onClick(e, text.id)}
                    draggable={isDraggable}
                    width={textWidth}
                    onDblClick={(e) => handleTextDblClick(text.id, e)}
                    onDblTap={(e) => handleTextDblClick(text.id, e)}
                    onTransform={handleTransform}
                    onDragEnd={(e) => OnDragEnd(e, text.id)}
                    visible={editingTextId !== text.id}
                  />
                );
              }
              default:
                return (
                  <ShapesElement
                    key={shape.id}
                    shape={shape}
                    isDraggable={isDraggable}
                    click={(e) => onClick(e, shape.id)}
                    dragEnd={(e) => OnDragEnd(e, shape.id)}
                    transformEnd={(e) => OnTransformEnd(e, shape.id)}
                  />
                );
            }
          })}
          {isEditing && currentTextNode && (
            <TextEditor
              textNode={currentTextNode}
              onChange={handleTextChange}
              onClose={() => {
                setIsEditing(false);
                setEditingTextId(null);
              }}
            />
          )}
          {!isEditing && (
            <Transformer
              ref={transformerRef}
              enabledAnchors={
                !(currentType === ACTIONS.ARROW || currentType === ACTIONS.LINE)
                  ? [
                      "top-left",
                      "top-right",
                      "bottom-left",
                      "bottom-right",
                      "middle-left",
                      "middle-right",
                      "top-center",
                      "bottom-center",
                    ]
                  : ["middle-left", "middle-right"]
              }
              boundBoxFunc={(_, newBox) => ({
                ...newBox,
                width: Math.max(30, newBox.width),
              })}
            />
          )}
        </Layer>
      </Stage>
      {selectId ? <CanvaShapeEditor id={selectId} /> : null}
    </div>
  );
};

export default V2_VenueDesign_page;
