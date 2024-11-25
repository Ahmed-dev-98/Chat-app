import { IUser } from "@/app/types/types";

const UserCard = ({ user }: { user: IUser }) => {
  if (!user) return null;
  return (
    <div className="flex gap-2 items-center justify-center w-full px-3 py-6 text-white border-b h-full hover:bg-red-700 transition-all duration-300">
      <div className="">
        {" "}
        <div className="w-[50px] h-[50px] rounded-full bg-red-100"></div>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div className="w-full flex justify-between items-center">
          <h2>{user.email.split("@")[0]}</h2>
          <p>{new Date(user.lastSeen.seconds * 1000).toLocaleString()}</p>
        </div>
        <div>
          <h2>hallow hallowhallowhallow</h2>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
