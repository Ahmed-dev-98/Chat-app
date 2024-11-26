import { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
  DocumentData,
} from "firebase/firestore";
import { db, FIREBASE_COLLECTIONS } from "@/app/services/firebase/firebase";
import { IMessage } from "@/app/types/types";
import MyMessages from "@/shared/ui/my-messages";
import Receiver from "@/shared/ui/reciver";
import { getAuth } from "firebase/auth";
import { getChatRoomId } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

const ChatContent = () => {
  const [messages, setMessages] = useState<IMessage[] | DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const chatRef = useRef<HTMLDivElement>(null);
  const auth = getAuth();

  useEffect(() => {
    if (chatRef && chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      const recipientDocId = searchParams.get("id");
      if (!recipientDocId || !auth.currentUser) return;

      try {
        const recipientDoc = await getDoc(
          doc(db, FIREBASE_COLLECTIONS.USERS, recipientDocId)
        );
        if (!recipientDoc.exists()) return;

        const recipientUid = recipientDoc.data().uid;

        const chatRoomId = getChatRoomId(auth.currentUser.uid, recipientUid);

        const messagesQuery = query(
          collection(
            db,
            FIREBASE_COLLECTIONS.CHAT_ROOMS,
            chatRoomId,
            FIREBASE_COLLECTIONS.MESSAGES
          ),
          orderBy("timestamp")
        );

        const unsubscribe = onSnapshot(
          messagesQuery,
          (querySnapshot) => {
            const messagesData = querySnapshot.docs.map((doc) => doc.data());
            setMessages(messagesData);

            console.log(messagesData);
            
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching messages:", error);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching recipient UID:", error);
      }
    };

    fetchChatMessages();
  }, [auth.currentUser, searchParams.get("id")]);
  console.log(messages);

  return (
    <div
      ref={chatRef}
      className="w-full max-h-[80%] overflow-y-auto bg-[#0a141b] p-6 rounded-md shadow-lg flex flex-col gap-4"
    >
      {loading ? (
        <p>Loading...</p>
      ) : (
        messages.map((message, index) => {
          if (message.senderId === auth.currentUser?.uid) {
            return <MyMessages key={index} message={message} />;
          } else {
            return <Receiver key={index} message={message} />;
          }
        })
      )}
    </div>
  );
};

export default ChatContent;
