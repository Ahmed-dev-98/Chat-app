import { IMessage } from "@/app/types/types";
import { formatLastSeen } from "@/lib/utils";
import ImageDialog from "@/shared/ui/image-dialog";

const MyMessages = ({ message }: { message: IMessage }) => {
  return (
    <div className="self-end flex flex-col gap-1 bg-[#005d4b] text-white px-4 py-2 rounded-xl shadow-md max-w-[50%] break-words  relative whitespace-pre-wrap">
      {message.image && (
        <ImageDialog
          className="lg:max-w-[400px] lg:max-h-[400px] overflow-hidden"
          imgSrc={message.image}
        >
          <img
            src={message.image}
            alt="message"
            className="w-full h-full object-cover rounded-md"
          />
        </ImageDialog>
      )}
      <p className="text-sm text-white">{message.text}</p>
      <span className="text-xs w-full  text-sky-200 text-end">
        {formatLastSeen(message?.timestamp?.seconds)}
      </span>
    </div>
  );
};

export default MyMessages;
