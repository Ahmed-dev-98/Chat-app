import { useState } from "react";
import { serverTimestamp, getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/app/services/firebase/firebase";
import { useSearchParams } from "react-router-dom";
import {
  FIREBASE_COLLECTIONS,
  FIREBASE_STORAGE,
} from "@/app/constants/firebase-enums";
import firebaseService from "@/app/services/firebase/firebase.service";
import { Button } from "@/components/ui/button";
import { IoSend } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";

const ChatController = () => {
  const [message, setMessage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const getRecipientUid = async (
    recipientDocId: string
  ): Promise<string | null> => {
    try {
      const recipientDoc = await getDoc(
        doc(db, FIREBASE_COLLECTIONS.USERS, recipientDocId)
      );
      if (recipientDoc.exists()) {
        return recipientDoc.data().uid;
      } else {
        console.error("Recipient not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching recipient UID:", error);
      return null;
    }
  };

  const sendMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!message.trim() && !selectedImage) return;

    const recipientDocId = searchParams.get("id");
    if (!recipientDocId) {
      console.error("Recipient ID not provided");
      return;
    }
    setLoading(true);
    try {
      const recipientUid = await getRecipientUid(recipientDocId);
      if (!recipientUid || !user?.uid) return;

      let imageUrl;

      if (selectedImage) {
        imageUrl = await firebaseService.uploadMedia(
          user.uid,
          selectedImage,
          FIREBASE_STORAGE.MESSAGES
        );
      }

      await firebaseService.sendMessage(user?.uid, recipientUid, {
        text: message || null,
        image: imageUrl || null,
        senderId: user?.uid,
        timestamp: serverTimestamp(),
      });
      setLoading(false);
      setMessage("");
      setSelectedImage(null);
      setPreviewImage(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="max-h-[10%] border shadow-sm w-full flex justify-between p-4 items-center bg-[#ededed]">
      {/* Message Input */}{" "}
      <div className="h-full flex gap-2 items-center">
        {previewImage && (
          <img
            src={previewImage}
            alt="Selected preview"
            className="w-10 h-10 object-cover rounded-md"
          />
        )}
        <Button
          disabled={loading}
          variant={"ghost"}
          onClick={() => document.getElementById("upload-image")?.click()}
        >
          <GrAttachment />

          <input
            onChange={handleFileChange}
            id="upload-image"
            type="file"
            accept="image/*"
            className="hidden"
            multiple={false}
          />
        </Button>
      </div>
      <textarea
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        placeholder="Type your message..."
        className="resize-none max-h-[50px] bg-white  border-0 outline-none w-[99%] px-4 py-2 rounded-md   overflow-y-auto break-words"
      ></textarea>
      <Button
        disabled={loading}
        variant={"ghost"}
        onClick={(e) => sendMessage(e)}
      >
        <IoSend />
      </Button>
    </div>
  );
};
export default ChatController;
