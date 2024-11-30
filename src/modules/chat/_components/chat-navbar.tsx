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
import ReciverInfo from "./reciver-info";
import { FaList } from "react-icons/fa";
import UserCard from "./user-card";
import { selectAuth } from "@/store/slices/auth.slice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RiShutDownLine } from "react-icons/ri";

const ChatNavbar = ({
  user,
  users,
}: {
  user: IUser | undefined;
  users: IUser[];
}) => {
  const reciver = useAppSelector(selectReciver);
  const signedUser = useAppSelector(selectAuth);
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
        <div className="block md:hidden cursor-pointer">
          <Sheet>
            <SheetTrigger>
              <FaList size={24} />
            </SheetTrigger>
            <SheetContent side={"left"}>
              <div className="flex flex-col  justify-start  w-full overflow-y-scroll no-visible-scrollbar h-[95%]">
                {users
                  ?.filter((u) => signedUser.contacts?.includes(u.uid))
                  .map((user) => (
                    <UserCard key={user.uid} user={user} />
                  ))}
              </div>
              <div className="flex items-center justify-start gap-1 w-full ">
                <Avatar className="w-[50px] h-[50px]">
                  <AvatarImage
                    src={signedUser.avatar}
                    className="object-cover object-top "
                    alt="@shadcn"
                  />
                  <AvatarFallback>
                    {signedUser.displayName.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col  justify-start items-start">
                  <p className="text-xs font-semibold">
                    {signedUser.displayName}
                  </p>
                  <p className="text-xs font-semibold text-gray-500">
                    {signedUser.email}
                  </p>
                </div>
                <Button variant={"destructive"} className="ms-auto">
                  <RiShutDownLine />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
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
          <SheetContent>
            <ReciverInfo />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ChatNavbar;
