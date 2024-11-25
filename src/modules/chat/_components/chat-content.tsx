import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/app/services/firebase/firebase";
import { IMessage } from "@/app/types/types";

const ChatContent = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    // Reference the 'messages' collection and order by timestamp
    const messagesCollection = collection(db, "messages");
    const q = query(messagesCollection, orderBy("timestamp", "asc"));

    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Document ID
        ...doc.data(), // Document data
      }));
      console.log(messagesData, "messages");

      setMessages(messagesData as IMessage[]); // Update the state with the latest messages
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className="h-full w-full ">
      <div
        id=""
        className="tiptap h-full w-full  rounded-md  !bg-transparent p-3 !text-white"
      >
        {messages.map((message, index) => (
          <div key={message.id || index}>{parse(message.text)}</div>
        ))}
      </div>
    </div>
  );
};

export default ChatContent;
