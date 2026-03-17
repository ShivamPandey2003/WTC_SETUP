import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  FORMAT_TEXT_COMMAND,
  $isRangeSelection,
  $createParagraphNode,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import { ImUnderline, ImBold, ImItalic } from "react-icons/im";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    blockType: "paragraph",
  });

  const setHeading = (size: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) return;

      $setBlocksType(selection, () => $createHeadingNode(size));
    });
  };

  const setParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!selection) return;

      $setBlocksType(selection, () => $createParagraphNode());
    });
  };

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) return;

        const bold = selection.hasFormat("bold");
        const italic = selection.hasFormat("italic");
        const underline = selection.hasFormat("underline");

        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getTopLevelElementOrThrow();

        let blockType = "paragraph";

        if ($isHeadingNode(element)) {
          blockType = element.getTag(); // ✅ safe now
        } else {
          blockType = element.getType(); // paragraph, quote, etc.
        }

        setActiveFormats({
          bold,
          italic,
          underline,
          blockType,
        });
      });
    });
  }, [editor]);

  return (
    <div className="flex gap-2 mb-3 border-b p-2 bg-white items-center rounded-t-[7px]">
      <button
        onClick={setParagraph}
        className={cn("cursor-pointer font-bold text-gray-700 w-6 rounded", activeFormats.blockType === "paragraph" && "bg-gray-300")}
      >
        P
      </button>
      <button
        onClick={() => setHeading("h1")}
        className={cn("cursor-pointer font-bold text-gray-700 w-6 rounded", activeFormats.blockType === "h1" && "bg-gray-300")}
      >
        H1
      </button>
      <button
        onClick={() => setHeading("h2")}
        className={cn("cursor-pointer font-bold text-gray-700 w-6 rounded", activeFormats.blockType === "h2" && "bg-gray-300")}
      >
        H2
      </button>
      <button
        onClick={() => setHeading("h3")}
        className={cn("cursor-pointer font-bold text-gray-700 w-6 rounded", activeFormats.blockType === "h3" && "bg-gray-300")}
      >
        H3
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className={cn("cursor-pointer text-gray-700 p-1 rounded", activeFormats.bold && "bg-gray-300")}
      >
        <ImBold size={16} />
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className={cn("cursor-pointer text-gray-700 p-1 rounded", activeFormats.italic && "bg-gray-300")}
      >
        <ImItalic size={16} />
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className={cn("cursor-pointer text-gray-700 p-1 rounded", activeFormats.underline && "bg-gray-300")}
      >
        <ImUnderline size={18} />
      </button>
    </div>
  );
}
