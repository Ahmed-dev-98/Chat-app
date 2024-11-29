import { IMessage, IUser } from "@/app/types/types";
import { formatLastSeen } from "@/lib/utils";
import { useAppDispatch } from "@/store";
import { assign } from "@/store/slices/reciver.slice";
import { onSnapshot, DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth } from "@/app/services/firebase/firebase";
import { getChatRoomId } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import firebaseService from "@/app/services/firebase/firebase.service";
import { BsCheckAll, BsCheckLg } from "react-icons/bs";

const UserCard = ({ user }: { user: IUser }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [lastMessage, setLastMessage] = useState<DocumentData | IMessage>({});
  const [, setLoading] = useState(true);

  useEffect(() => {
    if (user.uid) {
      console.log("last message listned");

      const fetchLastMessage = async () => {
        const recipientDocId = user.uid;
        if (!recipientDocId || !auth.currentUser) return;

        try {
          const recipientDoc = await firebaseService.getUserDoc(recipientDocId);
          const chatRoomId = getChatRoomId(
            auth.currentUser.uid,
            recipientDoc.uid
          );
          const lastMessage = await firebaseService.getLastMessage(chatRoomId);
          const unsubscribe = onSnapshot(
            lastMessage,
            (querySnapshot) => {
              const lastMessageData = querySnapshot.docs[0]?.data() || null;
              setLastMessage(lastMessageData);
              setLoading(false);
            },
            (error) => {
              console.error("Error fetching last message:", error);
            }
          );
          return () => unsubscribe();
        } catch (error) {
          console.error("Error fetching recipient UID:", error);
        }
      };

      fetchLastMessage();
    }
  }, [auth.currentUser, searchParams.get("id")]);

  const getMessageStatus = (lastMessage: DocumentData) => {
    if (lastMessage?.senderId !== user.uid && user.isOnline) {
      return <BsCheckAll color="#979290" />;
    } else if (lastMessage?.senderId !== user.uid && !user.isOnline) {
      return <BsCheckLg color="#979290" />;
    } else if (lastMessage?.senderId === user.uid && user.isOnline) {
      return <BsCheckAll color="green" />;
    }
  };

  if (!user) return null;
  return (
    <div
      onClick={() => {
        setSearchParams({ id: user.uid });
        dispatch(assign(user));
      }}
      className={`flex gap-2 items-center justify-center w-full p-2 text-white border-b min-h-[80px] ${
        searchParams.get("id") === user.uid ? "bg-[#ededed]" : ""
      } hover:bg-[#ededed] transition-all duration-300`}
    >
      <div className="">
        {" "}
        <div className="w-[50px] h-[50px] rounded-full bg-red-100 ">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-full h-full rounded-full sm:bg-current object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col  w-full">
        <div className="w-full flex justify-between items-center">
          <h2 className="capitalize text-[#332319] font-semibold">
            {user.displayName}
          </h2>
          <p
            className={`${
              user.isOnline ? "text-green-800 animate-pulse" : "text-red-600"
            } font-bold text-xs rounded-full   text-[#b6b6b6]`}
          >
            {user.isOnline ? "Online" : "Offline"}
          </p>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center justify-start gap-1">
            {" "}
            {lastMessage && getMessageStatus(lastMessage)}
            {lastMessage?.image ? (
              <img
                src={lastMessage?.image}
                alt="message"
                className="w-[30px] h-[30px] object-cover rounded-md"
              />
            ) : (
              <h2 className="text-xs font-medium text-[#979290]">
                {lastMessage?.text?.length > 25
                  ? lastMessage?.text?.slice(0, 25) + "..."
                  : lastMessage?.text}
              </h2>
            )}
          </div>
          {lastMessage && (
            <p className="text-xs font-medium text-[#b6b6b6]">
              {formatLastSeen(lastMessage?.timestamp?.seconds)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
