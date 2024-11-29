import { IMessage } from "@/app/types/types";
import { formatLastSeen } from "@/lib/utils";
import { DocumentData } from "firebase/firestore";

const Receiver = ({ message }: { message: IMessage | DocumentData }) => {


  return (
    <div className="self-start flex flex-col gap-1 bg-[#1f2c34] px-4 py-2 rounded-md shadow-md max-w-[50%] break-words  whitespace-pre-wrap">
      {message.image && (
        <img
          src={message.image}
          alt="message"
          className="w-[400px] h-[400px] object-cover rounded-lg"
        />
      )}
      <p className="text-sm text-white">{message.text}</p>
      <span className="text-xs ms-12 text-sky-200 self-end">
        {formatLastSeen(message?.timestamp?.seconds)}
      </span>
    </div>
  );
};

export default Receiver;
