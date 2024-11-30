import { FIREBASE_COLLECTIONS } from "@/app/constants/firebase-enums";
import { db } from "@/app/services/firebase/firebase";
import { IUser } from "@/app/types/types";
import { formatLastSeen } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { assign, selectReciver } from "@/store/slices/reciver.slice";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ReciverInfo from "./_components/reciver-info";
import ContactsInfo from "./_components/contacts-info";
import { FaList } from "react-icons/fa";

const ChatNavbar = ({
  user,
  users,
}: {
  user: IUser | undefined;
  users: IUser[];
}) => {
  const reciver = useAppSelector(selectReciver);

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
    <div className="h-[70px] shadow-sm w-full text-center text-[#594c3e] bg-[#ededed] flex justify-between items-center ">
      <div className="flex px-4 items-center gap-2 justify-start">
        <div className="block lg:hidden cursor-pointer">
          <ContactsInfo users={users} triggerComponent={<FaList size={24} />} />
        </div>
        <div className="justify-start px-2 items-center flex gap-2">
          <div className="w-[50px] h-[50px] rounded-full bg-red-100">
            <img
              src={reciver?.avatar}
              alt={reciver?.displayName}
              className="w-full h-full rounded-full object-cover object-top"
            />
          </div>
          <div className="flex-col flex justify-between items-start">
            <h2 className="text-xl capitalize">{reciver?.displayName}</h2>
            <p className="text-xs">
              {reciver?.isOnline
                ? "Online"
                : "Last seen at " +
                  formatLastSeen(reciver?.lastSeen.seconds / 1000)}
            </p>
          </div>
        </div>{" "}
      </div>
      <div className="px-4 cursor-pointer">
        <Sheet>
          <SheetTrigger>
            <FaCircleInfo size={24} />
          </SheetTrigger>
          <SheetContent className="max-w-full">
            <ReciverInfo />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ChatNavbar;
