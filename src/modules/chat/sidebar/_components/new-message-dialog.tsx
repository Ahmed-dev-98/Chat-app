import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectAuth, updateUserContacts } from "@/store/slices/auth.slice";
import { assign } from "@/store/slices/reciver.slice";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import firebaseService from "@/app/services/firebase/firebase.service";
import { IUser } from "@/app/types/types";

const NewMessageDialog = ({
  triggerComponent,
  users,
  setOpenSheet,
}: {
  triggerComponent: React.ReactNode;
  users: IUser[];
  setOpenSheet?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const [, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const signedUser = useAppSelector(selectAuth);
  const handleStartMessage = async () => {
    if (selectedUser) {

      await firebaseService.updateUser(signedUser.uid, {
        contacts: [...signedUser.contacts, selectedUser.uid],
      });
      await firebaseService.updateUser(selectedUser.uid, {
        contacts: [...selectedUser.contacts, signedUser.uid],
      });
      dispatch(updateUserContacts([...signedUser.contacts, selectedUser.uid]));
      dispatch(assign(selectedUser));
      setSearchParams({ id: selectedUser.uid });
      if (setOpenSheet) setOpenSheet(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize text-lg font-semibold text-gray-800">
            New Users ({users?.length - signedUser.contacts?.length || 0})
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Select a user to start a conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-4 justify-center items-center my-4">
          {users
            ?.filter((u) => !signedUser.contacts?.includes(u.uid))
            .map((user) => (
              <div
                onClick={() => setSelectedUser(user)}
                key={user.uid}
                className={`cursor-pointer p-4 rounded-lg shadow-sm border
              ${
                selectedUser?.uid === user.uid
                  ? "bg-green-50 border-green-400"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              } transition-all duration-200 flex flex-col items-center w-24`}
              >
                <img
                  src={user.avatar}
                  alt={`${user.displayName}'s avatar`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <h2 className="mt-2 text-sm font-medium text-gray-700 text-nowrap">
                  {user.displayName}
                </h2>
              </div>
            ))}
        </div>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="px-4 py-2 text-sm"
              onClick={() => setSelectedUser(undefined)}
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={handleStartMessage}
              disabled={!selectedUser}
              className="px-4 py-2 text-sm"
            >
              Message
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;
