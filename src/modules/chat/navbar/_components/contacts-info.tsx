import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RiShutDownLine } from "react-icons/ri";
import { MdMessage } from "react-icons/md";
import NewMessageDialog from "../../sidebar/_components/new-message-dialog";
import UserCard from "../../sidebar/_components/user-card";
import { logout, selectAuth } from "@/store/slices/auth.slice";
import firebaseService from "@/app/services/firebase/firebase.service";
import { ROUTES } from "@/app/constants/routes";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import { useState } from "react";
import { IUser } from "@/app/types/types";

const ContactsInfo = ({
  users,
  triggerComponent,
}: {
  users: IUser[];
  triggerComponent: React.ReactNode;
}) => {
  const [openSheet, setOpenSheet] = useState(false);
  const dispatch = useAppDispatch();

  const signedUser = useAppSelector(selectAuth);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await firebaseService
      .logOut(signedUser.uid)
      .then(() => {
        dispatch(logout());
        navigate(ROUTES.HOME);
      })
      .catch((error) => console.error(error));
  };
  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger onClick={() => setOpenSheet(true)}>
        {triggerComponent}
      </SheetTrigger>
      <SheetContent side={"left"} className="w-full py-12">
        <div className="flex flex-col  justify-start  w-full overflow-y-scroll no-visible-scrollbar h-[95%]">
          {users
            ?.filter((u) => signedUser.contacts?.includes(u.uid))
            .map((user) => (
              <UserCard
                setOpenSheet={setOpenSheet}
                key={user.uid}
                user={user}
              />
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
            <p className="text-xs font-semibold">{signedUser.displayName}</p>
            <p className="text-xs font-semibold text-gray-500">
              {signedUser.email}
            </p>
          </div>
          <div className="flex justify-center items-center gap-2 ms-auto">
            <NewMessageDialog
              triggerComponent={
                <Button type="button" variant={"default"}>
                  <MdMessage />
                </Button>
              }
              users={users}
              setOpenSheet={setOpenSheet}
            />

            <Button onClick={handleLogout} variant={"destructive"}>
              <RiShutDownLine />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ContactsInfo;
