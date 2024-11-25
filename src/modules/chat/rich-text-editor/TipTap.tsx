/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEditor, EditorContent } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import HardBreak from "@tiptap/extension-hard-break";
import Highlight from "@tiptap/extension-highlight";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const Tiptap = ({ onChange, content }: any) => {
  const handleChange = (newContent: string) => {
    onChange(newContent);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      HardBreak.configure({
        HTMLAttributes: {
          class: "break-line",
        },
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-700 text-gray-400 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none break-words",
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (content && editor) {
      editor.chain().setContent(content).run();
    }
  }, [content]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full ">
      <Toolbar editor={editor} content={content} />

      <EditorContent
        editor={editor}
        content={content}
        style={{
          whiteSpace: "pre-wrap", // Ensures text wraps correctly
          wordWrap: "break-word", // Forces words to break when necessary
          overflowWrap: "break-word", // Prevents long words from overflowing
        }}
      />
    </div>
  );
};

export default Tiptap;
