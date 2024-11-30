import { IUser } from "@/app/types/types";
import { useAppSelector } from "@/store";
import { selectAuth } from "@/store/slices/auth.slice";
import UserCard from "./_components/user-card";
import SidebarHeader from "./_components/sidebar-header";
const Sidebar = ({ users }: { users: IUser[] }) => {
  const signedUser = useAppSelector(selectAuth);

  return (
    <div className="w-0  lg:w-[25%] absolute flex flex-col gap-3 h-full  border-r-2 border-gray-300 bg-white ">
      <SidebarHeader users={users} />
      {/* users */}
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
