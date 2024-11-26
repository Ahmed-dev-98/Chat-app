import ChatController from "./_components/chat-controller";
import ChatNavbar from "./_components/chat-navbar";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, FIREBASE_COLLECTIONS } from "@/app/services/firebase/firebase";
import ChatContent from "./_components/chat-content";
import { IUser } from "@/app/types/types";
import { getAuth } from "firebase/auth";
import { useSearchParams } from "react-router-dom";
import Sidebar from "./_components/sidebar";

const Chat = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const auth = getAuth();
  const [searchParams] = useSearchParams();
  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, FIREBASE_COLLECTIONS.USERS);
      const querySnapshot = await getDocs(usersCollection);
      const usersData = querySnapshot.docs.map(
        (doc) =>
          ({
            uid: doc.id,
            ...doc.data(),
          } as IUser)
      );
      console.log(usersData);

      setUsers(
        usersData.filter(
          (user) => user.email !== auth.currentUser?.email
        ) as IUser[]
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="w-full h-screen bg-[#0b141b]">
      <div className="w-full h-full flex ">
        {<Sidebar users={users} />}

        {!searchParams.get("id") ? (
          <div className="text-white h-full w-full flex justify-center items-center">
            no data fount please select chat
          </div>
        ) : (
          <div className="w-[75%] h-full p-2 flex flex-col gap-4 justify-between">
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
