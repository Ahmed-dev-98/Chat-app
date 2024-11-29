import ChatController from "./_components/chat-controller";
import ChatNavbar from "./_components/chat-navbar";
import ChatContent from "./_components/chat-content";
import { useSearchParams } from "react-router-dom";
import Sidebar from "./_components/sidebar";
import firebaseService from "@/app/services/firebase/firebase.service";
import useSWR from "swr";
import { useAppSelector } from "@/store";
import { selectAuth } from "@/store/slices/auth.slice";
import toast from "react-hot-toast";

const Chat = () => {
  const signedUser = useAppSelector(selectAuth);
  const [searchParams] = useSearchParams();
  const fetchUsers = async () => {
    return await firebaseService
      .getAllUsers()
      .then((data) => {
        toast.success("users fetched successfully");
        return data.filter((user) => user.email !== signedUser?.email);
      })
      .catch((err) => console.log(err));
  };
  const { data: users, isLoading } = useSWR("users", fetchUsers);

  if (isLoading) return <div>loading</div>;
  if (!users) return <div>no users found</div>;
  return (
    <div className="w-full h-screen bg-white">
      <div className="w-full h-full flex ">
        {<Sidebar users={users} />}

        {!searchParams.get("id") ? (
          <div className="text-white h-full w-full flex justify-center items-center">
            no data fount please select chat
          </div>
        ) : (
          <div className="w-[75%] h-full  flex flex-col  justify-between">
            <ChatNavbar
              user={users.find((user) => user.uid === searchParams.get("id"))}
            />
            <ChatContent />
            <ChatController />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
