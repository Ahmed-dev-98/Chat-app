import UserCard from "./user-card";
import { IUser } from "@/app/types/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout, selectAuth } from "@/store/slices/auth.slice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/constants/routes";
import firebaseService from "@/app/services/firebase/firebase.service";

const Sidebar = ({ users }: { users: IUser[] }) => {
  const signedUser = useAppSelector(selectAuth);
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
