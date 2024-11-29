import firebaseService from "@/app/services/firebase/firebase.service";
import { IMessage } from "@/app/types/types";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useMessages = (recipientId: string, currentUserId: string) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!recipientId || !currentUserId) return;

    let unsubscribe: (() => void) | undefined;

    const fetchMessages = async () => {
      try {
        // Get the query from your `getAllMessages` method
        const messagesQuery = await firebaseService.getAllMessages(
          recipientId,
          currentUserId
        );

        // Attach the real-time listener
        unsubscribe = onSnapshot(
          messagesQuery,
          (querySnapshot) => {
            const fetchedMessages = querySnapshot.docs.map((doc) => doc.data()) as IMessage[];
            setMessages(fetchedMessages); // Update state with new messages
            setIsLoading(false);
          },
          (error) => {
            console.error("Error fetching messages:", error);
            setIsLoading(false);
          }
        );
      } catch (error) {
        console.error("Error initializing messages listener:", error);
        setIsLoading(false);
      }
    };

    fetchMessages();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [recipientId, currentUserId]);

  return { messages, isLoading };
};
