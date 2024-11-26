import { IMessage, IUser } from "@/app/types/types";
import { formatLastSeen } from "@/lib/utils";
import { useAppDispatch } from "@/store";
import { assign } from "@/store/slices/reciver.slice";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  auth,
  db,
  FIREBASE_COLLECTIONS,
} from "@/app/services/firebase/firebase";
import { getChatRoomId } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

const UserCard = ({ user }: { user: IUser }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [lastMessage, setLastMessage] = useState<DocumentData | IMessage>({});
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastMessage = async () => {
      const recipientDocId = user.uid;
      if (!recipientDocId || !auth.currentUser) return;

      try {
        const recipientDoc = await getDoc(
          doc(db, FIREBASE_COLLECTIONS.USERS, recipientDocId)
        );
        if (!recipientDoc.exists()) {
          console.error("Recipient document not found");
          return;
        }
        const recipientUid = recipientDoc.data().uid;
        const chatRoomId = getChatRoomId(auth.currentUser.uid, recipientUid);
        const lastMessageQuery = query(
          collection(
            db,
            FIREBASE_COLLECTIONS.CHAT_ROOMS,
            chatRoomId,
            FIREBASE_COLLECTIONS.MESSAGES
          ),
          orderBy("timestamp", "desc"),
          limit(1)
        );
        const unsubscribe = onSnapshot(
          lastMessageQuery,
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
  }, [auth.currentUser, searchParams.get("id")]);

  if (!user) return null;
  return (
    <div
      onClick={() => {
        setSearchParams({ id: user.uid });
        dispatch(assign(user));
      }}
      className={`flex gap-2 items-center justify-center w-full px-3 py-5 text-white border-b min-h-[100px] ${
        searchParams.get("id") === user.uid ? "bg-[#2b3842]" : ""
      } hover:bg-[#2b3842] transition-all duration-300`}
    >
      <div className="">
        {" "}
        <div className="w-[50px] h-[50px] rounded-full bg-red-100">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-full h-full rounded-full sm:bg-current object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div className="w-full flex justify-between items-center">
          <h2>{user.displayName}</h2>
          <p>{formatLastSeen(lastMessage?.timestamp?.seconds)}</p>
        </div>
        <div>
          {lastMessage?.image ? (
            <img
              src={lastMessage?.image}
              alt="message"
              className="w-[30px] h-[30px] object-cover rounded-md"
            />
          ) : (
            <h2>
              {lastMessage?.text?.length > 25
                ? lastMessage?.text?.slice(0, 25) + "..."
                : lastMessage?.text}
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
