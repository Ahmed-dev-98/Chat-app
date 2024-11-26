import { signOut } from "firebase/auth";
import UserCard from "./user-card";
import { IUser } from "@/app/types/types";
import { doc, updateDoc } from "firebase/firestore";
import {
  auth,
  db,
  FIREBASE_COLLECTIONS,
} from "@/app/services/firebase/firebase";
import { useAppSelector } from "@/store";
import { selectAuth } from "@/store/slices/auth.slice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/constants/routes";

const Sidebar = ({ users }: { users: IUser[] }) => {
  const signedUser = useAppSelector(selectAuth);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return navigate(ROUTES.LOGIN);
      }

      const userDocRef = doc(db, FIREBASE_COLLECTIONS.USERS, user.uid);
      await updateDoc(userDocRef, { isOnline: false, lastSeen: new Date() });
      await signOut(auth);
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error("Error during logout:", error);
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <div className="w-[25%] flex flex-col p-2  h-full  rounded-tr-md rounded-br-md bg-[#121a22] ">
      <div className="flex flex-col  justify-start  w-full overflow-y-scroll no-visible-scrollbar h-full">
        {users?.map((user) => (
          <UserCard key={user.uid} user={user} />
        ))}
      </div>{" "}
      <div className="text-white w-full flex flex-col gap-5 justify-center items-center  ">
        <div className="w-full flex  gap-2 justify-start items-center px-2">
          <img
            src={signedUser.avatar}
            alt="logo"
            className="w-[70px] h-[70px] rounded-md object-cover"
          />
          <div className="flex flex-col gap-2 ">
            <h2>{signedUser?.displayName}</h2>
            <h2 className="text-xs">{signedUser?.email}</h2>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="h-[50px] w-full  mx-auto rounded-md border"
        >
          log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
