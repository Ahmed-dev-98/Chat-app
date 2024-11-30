import { useSearchParams } from "react-router-dom";
import firebaseService from "@/app/services/firebase/firebase.service";
import useSWR from "swr";
import { useAppSelector } from "@/store";
import { selectAuth } from "@/store/slices/auth.slice";
import { ChatLandingScreen } from "./_components/chat-landing-screen";
import Sidebar from "../sidebar/sidebar";
import ChatNavbar from "../navbar/chat-navbar";
import ChatContent from "../chat-screen/chat-content";
import ChatController from "../chat-screen/chat-controller";
import LoadingScreen from "@/shared/ui/loading";

const Chat = () => {
  const signedUser = useAppSelector(selectAuth);
  const [searchParams] = useSearchParams();

  const fetchUsers = async () => {
    return await firebaseService
      .getAllUsers()
      .then((data) => {
        return data.filter((user) => user.email !== signedUser?.email);
      })
      .catch((err) => console.log(err));
  };
  const { data: users, isLoading } = useSWR("users", fetchUsers);

  if (isLoading) return <LoadingScreen isFullScreen />;
  if (!users) return <div>no users found</div>;
  return (
    <div className="w-full h-screen bg-white">
      <div className="w-full h-full flex ">
        {<Sidebar users={users} />}

        {!searchParams.get("id") ? (
          <ChatLandingScreen users={users} />
        ) : (
          <div className="lg:w-[75%] w-full h-full lg:ml-[25%]  flex flex-col  justify-between">
            <ChatNavbar
              users={users}
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
