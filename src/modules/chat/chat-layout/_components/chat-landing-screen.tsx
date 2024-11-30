import { IUser } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import NewMessageDialog from "../../sidebar/_components/new-message-dialog";
import ContactsInfo from "../../navbar/_components/contacts-info";

export const ChatLandingScreen = ({ users }: { users: IUser[] }) => {
  return (
    <div className="flex flex-col items-center lg:w-[75%] w-full h-full lg:ml-[25%] justify-center min-h-screen bg-gray-400">
      <img
        src="https://via.placeholder.com/150"
        alt="No messages illustration"
        className="w-[300px] h-[300px] mb-6"
      />
      <h4>you have no messages</h4>
      <p className="text-gray-600 text-center text-lg mb-4">
        You inbox is empty send a message to a friend to get started
      </p>
      <div className="flex gap-2">
        <NewMessageDialog
          triggerComponent={
            <Button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              New Message
            </Button>
          }
          users={users}
        />
        <ContactsInfo
          users={users}
          triggerComponent={<Button className="px-6 py-2">My Contacts</Button>}
        />
      </div>
    </div>
  );
};
