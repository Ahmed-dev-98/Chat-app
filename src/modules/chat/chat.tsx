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
import { Button } from "@/components/ui/button";

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
          <div className="flex flex-col items-center w-[75%] justify-center min-h-screen bg-gray-400">
            <img
              src="https://via.placeholder.com/150"
              alt="No messages illustration"
              className="w-[300px] h-[300px] mb-6"
            />
            <h4>you have no messages</h4>
            <p className="text-gray-600 text-center text-lg mb-4">
              You inbox is empty send a message to a friend to get started
            </p>

            <Button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              New Message
            </Button>
          </div>
        ) : (
          <div className="md:w-[75%] w-full h-full md:ml-[25%]  flex flex-col  justify-between">
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
