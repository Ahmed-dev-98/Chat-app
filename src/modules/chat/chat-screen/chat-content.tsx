import { useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import { useSearchParams } from "react-router-dom";
import { useMessages } from "@/hooks/useMessages";
import { FaLock } from "react-icons/fa6";
import MyMessages from "./_components/my-messages";
import Receiver from "./_components/reciver-messages";
import LoadingScreen from "@/shared/ui/loading";

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
  if (isLoading) return <LoadingScreen  />;
  return (
    <div
      ref={chatRef}
      className="w-full h-[80%] whatsAppBg overflow-y-auto bg-[#0a141b] p-6  shadow-lg flex flex-col gap-4"
    >
      {" "}
      <div className="bg-[#e1d992] gap-1 text-black font-bold p-4 flex justify-start w-[95%] lg:w-[70%] mx-auto items-start  rounded-md shadow-md">
        <FaLock className="text-black font-bold mt-1 min-w-[15px]" size={15} />
        <p className="text-sm font-bold text-center">
          Messages are end-to-end encrypted, no one outside of this chat can see
          , not even US can read them ,{" "}
          <span
            onClick={(e) =>
              ((e.target as HTMLElement).innerHTML =
                "i lied , i can read all your messages")
            }
            className="cursor-pointer hover:underline underline-offset-1 hover:text-blue-700 text-blue-500 font-medium"
          >
            Click to learn more
          </span>
        </p>
      </div>
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
