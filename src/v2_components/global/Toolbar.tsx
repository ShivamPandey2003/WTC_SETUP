import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, $getSelection } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";
import { Bold, Italic, Underline } from "lucide-react";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const setHeading = (size: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      $setBlocksType(selection, () => $createHeadingNode(size));
    });
  };

  return (
    <div className="flex gap-2 mb-3 border-b p-2 bg-white items-center">
      <button onClick={() => setHeading("h1")}>H1</button>
      <button onClick={() => setHeading("h2")}>H2</button>
      <button onClick={() => setHeading("h3")}>H3</button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <Bold size={18}/>
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <Italic size={18}/>
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        <Underline size={20}/>
      </button>
    </div>
  );
}