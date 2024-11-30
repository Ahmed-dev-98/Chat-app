import { FIREBASE_COLLECTIONS } from "@/app/constants/firebase-enums";
import { db } from "@/app/services/firebase/firebase";
import { getChatRoomId } from "@/lib/utils";
import ImageDialog from "@/shared/ui/image-dialog";
import { useAppSelector } from "@/store";
import { selectAuth } from "@/store/slices/auth.slice";
import { selectReciver } from "@/store/slices/reciver.slice";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
const ReciverInfo = () => {
  const reciver = useAppSelector(selectReciver);
  const signedUser = useAppSelector(selectAuth);
  const [media, setMedia] = useState([]);

  useEffect(() => {
    if ((signedUser.uid, reciver.uid)) {
      const chatRoomId = getChatRoomId(signedUser.uid, reciver.uid);
      const mediaCollection = doc(
        db,
        FIREBASE_COLLECTIONS.CHAT_ROOMS,
        chatRoomId,
        FIREBASE_COLLECTIONS.CHAT_MEDIA,
        "media"
      );
      const unsubscribe = onSnapshot(mediaCollection, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setMedia(data.media);
        }
      });

      return () => unsubscribe();
    }
  }, [signedUser, reciver]);

  return (
    <div className={`h-full overflow-hidden  flex flex-col  gap-3 `}>
      <div className="w-[100px] h-[100px] lg:w-[250px] mx-auto lg:h-[250px]  rounded-full">
        <img
          src={reciver.avatar}
          className="w-full h-full rounded-full object-cover object-top"
          alt=""
        />
      </div>
      <div className="flex flex-col  justify-center items-center">
        <p className="text-xl font-semibold">{reciver.displayName}</p>
        <p className="text-sm font-semibold text-gray-500">{reciver.email}</p>
      </div>
      <div className="w-full  grid grid-cols-2 lg:grid-cols-3 gap-1 overflow-y-scroll  items-start justify-start h-[calc(100%-100px)] lg:h-[calc(100%-250px)]">
        {media?.map((item) => (
          <ImageDialog className="rounded-md  h-[100px]" imgSrc={item}>
            <img
              src={item}
              alt=""
              className="w-full h-full object-cover rounded-md object-top"
            />
          </ImageDialog>
        ))}
      </div>
    </div>
  );
};

export default ReciverInfo;
