import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
// import { $setBlocksType } from "@lexical/selection";
// import { $createHeadingNode } from "@lexical/rich-text";
import { ImUnderline, ImBold, ImItalic  } from "react-icons/im";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();

  // const setHeading = (size: "h1" | "h2" | "h3") => {
  //   editor.update(() => {
  //     const selection = $getSelection();
  //     $setBlocksType(selection, () => $createHeadingNode(size));
  //   });
  // };

  return (
    <div className="flex gap-3 mb-3 border-b p-2 bg-white items-center rounded-t-[7px]">
      {/* <button onClick={() => setHeading("h1")} className="cursor-pointer font-bold text-gray-700">H1</button>
      <button onClick={() => setHeading("h2")} className="cursor-pointer font-bold text-gray-700">H2</button>
      <button onClick={() => setHeading("h3")} className="cursor-pointer font-bold text-gray-700">H3</button> */}

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} className="cursor-pointer text-gray-700"
      >
        <ImBold size={16}/>
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} className="cursor-pointer text-gray-700"
      >
        <ImItalic size={16}/>
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} className="cursor-pointer text-gray-700"
      >
        <ImUnderline size={18}/>
      </button>
    </div>
  );
}