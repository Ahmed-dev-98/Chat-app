import { IMessage } from "@/app/types/types";
import { formatLastSeen } from "@/lib/utils";
import ImageDialog from "./image-dialog";

const MyMessages = ({ message }: { message: IMessage }) => {
  return (
    <div className="self-end flex flex-col gap-1 bg-[#005d4b] text-white px-4 py-2 rounded-xl shadow-md max-w-[50%] break-words  relative whitespace-pre-wrap">
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
    </div>
  );
};

export default MyMessages;
