import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db, FIREBASE_COLLECTIONS } from "@/app/services/firebase/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getChatRoomId } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

const ChatController = () => {
  const [message, setMessage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const auth = getAuth();
  const storage = getStorage();
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

    try {
      const recipientUid = await getRecipientUid(recipientDocId);
      if (!recipientUid || !user?.uid) return;

      let imageUrl = null;

      if (selectedImage) {
        const imageRef = ref(
          storage,
          `messages/${Date.now()}_${selectedImage.name}`
        );
        const uploadResult = await uploadBytes(imageRef, selectedImage);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }
      const chatRoomId = getChatRoomId(user?.uid, recipientUid);
      await addDoc(
        collection(
          db,
          FIREBASE_COLLECTIONS.CHAT_ROOMS,
          chatRoomId,
          FIREBASE_COLLECTIONS.MESSAGES
        ),
        {
          text: message || null,
          image: imageUrl || null,
          senderId: user?.uid,
          timestamp: serverTimestamp(),
        }
      );

      setMessage("");
      setSelectedImage(null);
      setPreviewImage(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="max-h-[20%] border shadow-sm w-full flex justify-between px-4 items-center bg-gray-800">
      {/* Message Input */}
      <textarea
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        placeholder="Type your message..."
        className="resize-none max-h-[300px] bg-transparent text-white border-0 outline-none w-[99%] px-4 py-2 rounded-lg   overflow-y-auto break-words"
      ></textarea>

      {/* Upload and Send Actions */}
      <div className="flex gap-4 justify-center items-center h-full w-[20%]">
        {/* Upload Section */}
        <div className="h-full flex gap-2 items-center">
          {previewImage && (
            <img
              src={previewImage}
              alt="Selected preview"
              className="w-10 h-10 object-cover rounded-md"
            />
          )}
          <button
            onClick={() => document.getElementById("upload-image")?.click()}
            className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg"
          >
            Upload
            <input
              onChange={handleFileChange}
              id="upload-image"
              type="file"
              accept="image/*"
              className="hidden"
              multiple={false}
            />
          </button>
        </div>

        {/* Send Section */}
        <button
          onClick={(e) => sendMessage(e)}
          className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};
export default ChatController;
