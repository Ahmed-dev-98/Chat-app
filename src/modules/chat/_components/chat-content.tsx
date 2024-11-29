import { useEffect, useRef } from "react";
import MyMessages from "@/shared/ui/my-messages";
import Receiver from "@/shared/ui/reciver";
import { getAuth } from "firebase/auth";
import { useSearchParams } from "react-router-dom";
import { useMessages } from "@/hooks/useMessages";

const ChatContent = () => {
  const [searchParams] = useSearchParams();
  const chatRef = useRef<HTMLDivElement>(null);
  const auth = getAuth();
  const { messages, isLoading } = useMessages(
    searchParams.get("id") as string,
    auth.currentUser?.uid as string
  );

  useEffect(() => {
    if (chatRef && chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (isLoading) return <div className="text-white">loading</div>;
  if (messages.length === 0) return <div className="text-white">no messages found</div>;
  return (
    <div
      ref={chatRef}
      className="w-full max-h-[80%] overflow-y-auto bg-[#0a141b] p-6 rounded-md shadow-lg flex flex-col gap-4"
    >
      {messages?.map((message, index) => {
        if (message.senderId === auth.currentUser?.uid) {
          return <MyMessages key={index} message={message} />;
        } else {
          return <Receiver key={index} message={message} />;
        }
      })}
    </div>
  );
};

export default ChatContent;
