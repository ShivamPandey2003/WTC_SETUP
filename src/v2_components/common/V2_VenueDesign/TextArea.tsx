import { useEffect, useRef } from "react";
import Konva from "konva";
import { Html } from "react-konva-utils";

type TextAreaProps = {
  textNode: Konva.Text;
  onClose: () => void;
  onChange: (value: string) => void;
};

const TextArea = ({ textNode, onClose, onChange }: TextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const stage = textNode.getStage();
    if (!stage) return;

    const textPosition = textNode.absolutePosition();
    // const stageBox = stage.container().getBoundingClientRect();

    const areaPosition = {
      x: textPosition.x,
      y: textPosition.y,
    };
    textarea.value = textNode.text();

    textarea.style.position = "absolute";
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${textNode.width() - textNode.padding() * 2}px`;
    textarea.style.height = `${
      textNode.height() - textNode.padding() * 2 + 5
    }px`;

    textarea.style.fontSize = `${textNode.fontSize()}px`;
    textarea.style.lineHeight = String(textNode.lineHeight());
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill() as string;

    textarea.style.border = "none";
    textarea.style.padding = "0";
    textarea.style.margin = "0";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.transformOrigin = "left top";

    const rotation = textNode.rotation();
    if (rotation) {
      textarea.style.transform = `rotateZ(${rotation}deg)`;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 3}px`;

    textarea.focus();

    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target !== textarea) {
        onChange(textarea.value);
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onChange(textarea.value);
        onClose();
      }

      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleInput = () => {
      const scale = textNode.getAbsoluteScale().x;
      textarea.style.width = `${textNode.width() * scale}px`;
      textarea.style.height = "auto";
      textarea.style.height = `${
        textarea.scrollHeight + textNode.fontSize()
      }px`;
    };

    textarea.addEventListener("keydown", handleKeyDown);
    textarea.addEventListener("input", handleInput);

    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });

    return () => {
      textarea.removeEventListener("keydown", handleKeyDown);
      textarea.removeEventListener("input", handleInput);
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [textNode, onChange, onClose]);

  return (
    <textarea
      ref={textareaRef}
      style={{
        minHeight: "1em",
        position: "absolute",
      }}
    />
  );
};

type TextEditorProps = TextAreaProps;

const TextEditor = (props: TextEditorProps) => {
  return (
    <Html>
      <TextArea {...props} />
    </Html>
  );
};

export default TextEditor;
