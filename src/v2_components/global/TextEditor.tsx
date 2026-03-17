import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { $generateHtmlFromNodes } from "@lexical/html";
import { type EditorState } from "lexical";
import Toolbar from "./Toolbar";

function onError(error: Error) {
  console.error(error);
}

interface TextEditorProp {
    save:(e:string)=>void;
}

export default function TextEditor({save}:TextEditorProp) {
  const initialConfig = {
    namespace: "Editor",
    theme: {},
    onError,
    nodes: [HeadingNode, QuoteNode],
  };

  const handleChange = (editorState: EditorState, editor: any) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor);
      save(html)
      console.log("HTML OUTPUT:", html);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border border-gray-100 rounded-[7px] bg-[#1111110D] max-w-[260px]">
        <Toolbar />

        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none min-h-[150px] p-3 min-w-[260px]" />
          }
          // placeholder={<div className="text-gray-400">Start typing...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
      </div>
    </LexicalComposer>
  );
}