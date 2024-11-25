"use client";
import React, { useRef } from "react";
import { type Editor } from "@tiptap/react";
import { BiImageAdd } from "react-icons/bi";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/app/services/firebase/firebase";

type Props = {
  editor: Editor | null;
  content: string;
};

const Toolbar = ({ editor, content }: Props) => {
  const addImageRef = useRef<HTMLInputElement>(null);
  if (!editor) {
    return null;
  }
  const auth = getAuth();
  const user = auth.currentUser; // Get the currently logged-in user

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      editor
        .chain()
        .focus()
        .setImage({ src: URL.createObjectURL(event.target.files[0]) })
        .run();
    }
  };
  const sendMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!content.trim()) return; // Avoid sending empty messages

    try {
      // Add a new message to the 'messages' collection
      await addDoc(collection(db, "messages"), {
        text: content,
        senderId: user?.uid || "Anonymous",
        timestamp: serverTimestamp(),
      });
      editor.commands.setContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  return (
    <div className="flex w-full flex-wrap items-start justify-between gap-5 rounded-tl-md rounded-tr-md border border-gray-700 px-4 py-3">
      <div className="control-group  w-full">
        <div className="w-full flex  justify-between">
          <div className="flex w-full flex-wrap items-center justify-start gap-5 lg:w-10/12">
            <button
              className="text-sky-400"
              onClick={() => editor.chain().focus().setHardBreak().run()}
            >
              Break
            </button>
            <button
              type="button"
              onClick={() =>
                addImageRef.current && addImageRef?.current.click()
              }
              className={`${
                editor.isActive("bulletList")
                  ? "rounded-lg bg-sky-700 p-2 text-white"
                  : "text-sky-400"
              }  `}
            >
              <BiImageAdd
                className={`${
                  editor.isActive("bulletList") ? "text-white" : ""
                }`}
                size={30}
              />{" "}
              <p className="absolute -top-7 rounded-md border border-white bg-white px-3 py-1 text-sm capitalize opacity-0 transition-all duration-300 group-hover:opacity-100">
                add image
              </p>
            </button>{" "}
          </div>{" "}
          <div className="self-end">
            <button
              onClick={sendMessage}
              className="border-red-400 text-white hover:bg-sky-400 px-6 py-1 rounded-md border"
            >
              send
            </button>{" "}
          </div>{" "}
        </div>
      </div>

      <div className="w-full text-start">
        <input
          ref={addImageRef}
          onChange={(e) => handleFileChange(e)}
          style={{}}
          type="file"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default Toolbar;
