import { FIREBASE_COLLECTIONS } from "@/app/constants/firebase-collections";
import { db } from "@/app/services/firebase/firebase";
import { IUser } from "@/app/types/types";
import { formatLastSeen } from "@/lib/utils";
import { useAppDispatch } from "@/store";
import { assign, selectReciver } from "@/store/slices/reciver.slice";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ChatNavbar = ({ user }: { user: IUser | undefined }) => {
  const reciver = useSelector(selectReciver);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const id = reciver.uid || user?.uid || null;
    if (id) {
      const recipientDocRef = doc(db, FIREBASE_COLLECTIONS.USERS, id);
      const unsubscribe = onSnapshot(recipientDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          dispatch(
            assign({
              ...data,
              lastSeen: {
                seconds: data.lastSeen.seconds,
                nanoseconds: data.lastSeen.nanoseconds,
              },
            })
          );
        }
      });
      return () => unsubscribe();
    }
  }, [reciver.uid, user]);
  return (
    <div className="h-[90px] gap-4  py-2 shadow-sm w-full text-center text-white bg-[#1f2c34] flex justify-start px-2 items-center">
      <div className="w-[60px] h-[60px] rounded-full bg-red-100">
        <img
          src={reciver?.avatar}
          alt={reciver?.displayName}
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <div className="flex-col flex justify-between items-start">
        <h2 className="text-xl">{reciver?.displayName}</h2>
        <p className="text-xs">
          {reciver?.isOnline
            ? "Online"
            : "Last seen at " +
              formatLastSeen(reciver?.lastSeen.seconds / 1000)}
        </p>
      </div>
    </div>
  );
};

export default ChatNavbar;
