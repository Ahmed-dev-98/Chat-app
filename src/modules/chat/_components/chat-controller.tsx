/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Tiptap from "../rich-text-editor/TipTap";

const ChatController = ({
  setContent,
  content,
}: {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}) => {

  const handleContentChange = (content: any) => {
    setContent(content);
  };

  return (
    <div className="h-[190px] border shadow-sm w-full  ">
      <Tiptap
        content={content}
        onChange={(newContent: string) => handleContentChange(newContent)}
      />
    </div>
  );
};

export default ChatController;
