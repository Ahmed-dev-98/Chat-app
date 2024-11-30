import { Button } from "@/components/ui/button";

import { MdMessage } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/constants/routes";
import firebaseService from "@/app/services/firebase/firebase.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdLogOut } from "react-icons/io";
import { IUser } from "@/app/types/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout, selectAuth } from "@/store/slices/auth.slice";
import NewMessageDialog from "./new-message-dialog";

const SidebarHeader = ({ users }: { users: IUser[] }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const signedUser = useAppSelector(selectAuth);

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
    <div className="hidden lg:flex lg:w-full min-h-[70px] px-2 bg-[#ededed]  justify-between items-center">
      <div className="flex items-center justify-start gap-1 ">
        <Avatar className="w-[50px] h-[50px]">
          <AvatarImage
            src={signedUser.avatar}
            className="object-cover object-top "
            alt="@shadcn"
          />
          <AvatarFallback>{signedUser.displayName.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col  justify-start items-start">
          <p className="text-xs font-semibold">{signedUser.displayName}</p>
          <p title={signedUser.email} className="text-xs font-semibold text-gray-500">
            {signedUser.email.length > 20
              ? `${signedUser.email.slice(0, 25)}...`
              : signedUser.email}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <NewMessageDialog
          triggerComponent={
            <Button variant={"ghost"}>
              <MdMessage />
            </Button>
          }
          users={users}
        />

        <Select
          onValueChange={(value) => {
            if (value === "logout") {
              handleLogout();
            }
          }}
        >
          <SelectTrigger className="">
            <HiDotsVertical />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="logout">
              <div
                onClick={handleLogout}
                className="flex items-center justify-between w-full gap-3  "
              >
                <IoMdLogOut /> <p className="text-xs">logout</p>
              </div>
            </SelectItem>
            <SelectItem value="profile">
              <div className="flex items-center justify-between w-full gap-3  ">
                <CgProfile /> <p className="text-xs">Profile</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SidebarHeader;
