import { IMessage } from "@/app/types/types";
import { DocumentData } from "firebase/firestore";

const Receiver = ({ message }: { message: IMessage | DocumentData }) => {
  return (
    <div className="self-start flex flex-col gap-1 bg-[#1f2c34] px-4 py-2 rounded-md shadow-md max-w-[50%] break-words  whitespace-pre-wrap">
      <p className="text-white text-sm">{message.text}</p>
      <span className="text-xs ms-12 text-sky-200 self-end">10:45 AM</span>
    </div>
  );
};

export default Receiver;
