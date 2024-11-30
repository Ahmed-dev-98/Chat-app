import UserCard from "./user-card";
import { IUser } from "@/app/types/types";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  logout,
  selectAuth,
  updateUserContacts,
} from "@/store/slices/auth.slice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/app/constants/routes";
import firebaseService from "@/app/services/firebase/firebase.service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdMessage } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CgProfile } from "react-icons/cg";

import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { assign } from "@/store/slices/reciver.slice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdLogOut } from "react-icons/io";

const Sidebar = ({ users }: { users: IUser[] }) => {
  const signedUser = useAppSelector(selectAuth);
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    await firebaseService
      .logOut(signedUser.uid)
      .then(() => {
        dispatch(logout());
        navigate(ROUTES.LOGIN);
      })
      .catch((error) => console.error(error));
  };

  const handleStartMessage = async () => {
    if (selectedUser) {
      console.log(signedUser);

      await firebaseService.updateUser(signedUser.uid, {
        contacts: [...signedUser.contacts, selectedUser.uid],
      });
      await firebaseService.updateUser(selectedUser.uid, {
        contacts: [...selectedUser.contacts, signedUser.uid],
      });
      dispatch(updateUserContacts([...signedUser.contacts, selectedUser.uid]));
      dispatch(assign(selectedUser));
      setSearchParams({ id: selectedUser.uid });
    }
  };

  return (
    <div className="w-0 md:w-[25%] absolute flex flex-col gap-3 h-full  border-r-2 border-gray-300 bg-white ">
      <div className="hidden md:flex md:w-full min-h-[70px] px-2 bg-[#ededed]  justify-between items-center">
        <div className="flex items-center justify-start gap-1 ">
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
        </div>
        <div className="flex items-center justify-center">
          <Dialog>
            <DialogTrigger>
              <Button variant={"ghost"}>
                <MdMessage />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>All users {users?.length}</DialogTitle>
                <DialogDescription>
                  select the user to start a conversation with
                </DialogDescription>
                <div className="flex gap-4 flex-wrap justify-center items-center">
                  {users
                    ?.filter((u) => !signedUser.contacts?.includes(u.uid))
                    .map((user) => (
                      <div
                        onClick={() => setSelectedUser(user)}
                        key={user.uid}
                        className={`${
                          selectedUser?.uid === user.uid ? "bg-gray-500" : ""
                        } rounded-md py-2 flex flex-col gap-2 justify-center items-center`}
                      >
                        <img
                          src={user.avatar}
                          alt="logo"
                          className="w-[70px] h-[70px] rounded-md object-cover object-top"
                        />
                        <div className="flex flex-col gap-2">
                          <h2 className="font-medium text-green-600">
                            {user.displayName}
                          </h2>
                        </div>
                      </div>
                    ))}
                </div>
                <DialogClose>
                  <Button onClick={handleStartMessage}>Message</Button>
                </DialogClose>
              </DialogHeader>
            </DialogContent>
          </Dialog>{" "}
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
      <div className="flex flex-col  justify-start  w-full overflow-y-scroll no-visible-scrollbar h-full">
        {users
          ?.filter((u) => signedUser.contacts?.includes(u.uid))
          .map((user) => (
            <UserCard key={user.uid} user={user} />
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
