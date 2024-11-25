import ChatController from "./_components/chat-controller";
import ChatNavbar from "./_components/chat-navbar";
import UserCard from "./_components/user-card";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/services/firebase/firebase";
import ChatContent from "./_components/chat-content";
import { IUser } from "@/app/types/types";

const Chat = () => {
  const [content, setContent] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>([]);
  const fetchUsers = async () => {
    try {
      // Reference the 'users' collection
      const usersCollection = collection(db, "users");
      // Fetch documents from the collection
      const querySnapshot = await getDocs(usersCollection);
      // Map the documents to extract data
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Document ID
        ...doc.data(), // Document data
      }));
      console.log(usersData, "sadasd");

      setUsers(usersData as IUser[]); // Update the state with user data
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
  }, []);

  return (
    <div className="w-full h-screen bg-slate-950">
      <div className="w-full h-full flex ">
        <div className="w-[25%]  h-full  rounded-tr-md rounded-br-md ">
          <div className="flex flex-col  w-full overflow-y-scroll h-full">
            {users?.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
        {/* chat */}

        <div className="w-[75%] h-full p-2 flex flex-col">
          <ChatNavbar />
          <ChatContent />
          <ChatController setContent={setContent} content={content} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
