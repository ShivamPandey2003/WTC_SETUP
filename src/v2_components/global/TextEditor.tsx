import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot } from "lexical";
import { type EditorState } from "lexical";
import Toolbar from "./Toolbar";

function onError(error: Error) {
  console.error(error);
}

interface TextEditorProp {
  save: (e: string) => void;
  initialHtml?: string;
}

export default function TextEditor({ save, initialHtml }: TextEditorProp) {
  const initialConfig = {
    namespace: "Editor",
    theme: {},
    onError,
    nodes: [HeadingNode, QuoteNode],
    editorState: (editor: any) => {
      if (initialHtml) {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialHtml, "text/html");

        const nodes = $generateNodesFromDOM(editor, dom);

        editor.update(() => {
          const rootNode = $getRoot();
          rootNode.clear();
          rootNode.append(...nodes);
        });
      }
    },
  };

  const handleChange = (editorState: EditorState, editor: any) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor);
      save(html);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border border-gray-100 rounded-[7px] bg-[#1111110D] h-[53vh] w-full">
        <Toolbar />

        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none max-h-[44vh] custom-scrollbar overflow-auto p-3 min-w-[260px]" />
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
