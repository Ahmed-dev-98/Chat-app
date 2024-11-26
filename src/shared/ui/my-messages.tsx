import { IMessage } from "@/app/types/types";
import { DocumentData } from "firebase/firestore";

const MyMessages = ({ message }: { message: IMessage | DocumentData }) => {
  return (
    <div className="self-end flex flex-col gap-1 bg-[#005d4b] text-white px-4 py-2 rounded-xl shadow-md max-w-[50%] break-words  relative whitespace-pre-wrap">
      {message.image && (
        <img
          src={message.image}
          alt="message"
          className="w-full h-full object-cover rounded-lg"
        />
      )}
      <p className="text-sm text-white">{message.text}</p>
      <span className="text-xs ms-12 text-sky-200 self-end">10:45 AM</span>
    </div>
  );
};

export default MyMessages;
