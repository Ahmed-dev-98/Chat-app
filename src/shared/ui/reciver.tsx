import { IMessage } from "@/app/types/types";
import { formatLastSeen } from "@/lib/utils";
import { DocumentData } from "firebase/firestore";
import ImageDialog from "./image-dialog";
import { useAppSelector } from "@/store";
import { selectReciver } from "@/store/slices/reciver.slice";

const Receiver = ({ message }: { message: IMessage | DocumentData }) => {
  const reciver = useAppSelector(selectReciver);
  return (
    <div className="flex items-start justify-start gap-1">
      <img src={reciver.avatar} className="w-[50px] h-[50px] rounded-full object-cover object-top" alt="" />
      <div className="self-start flex flex-col gap-1 bg-[#1f2c34] px-4 py-2 rounded-md shadow-md max-w-[50%] break-words  whitespace-pre-wrap">
        {message.image && (
          <ImageDialog className="w-full h-full" imgSrc={message.image}>
            <img
              src={message.image}
              alt="message"
              className="w-[400px] h-[400px] object-cover rounded-lg"
            />
          </ImageDialog>
        )}
        <p className="text-sm text-white">{message.text}</p>
        <span className="text-xs ms-12 text-sky-200 self-end">
          {formatLastSeen(message?.timestamp?.seconds)}
        </span>
      </div>{" "}
    </div>
  );
};

export default Receiver;
