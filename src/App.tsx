import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "./store";
import {
  login,
  selectAuth,
  updateUserContacts,
} from "./store/slices/auth.slice";
import firebaseService from "./app/services/firebase/firebase.service";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./app/services/firebase/firebase";
import { FIREBASE_COLLECTIONS } from "./app/constants/firebase-enums";
function App() {
  const dispatch = useAppDispatch();
  const signedUser = useAppSelector(selectAuth);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        firebaseService
          .getUserDoc(user.uid)
          .then((data) => {
            dispatch(
              login({
                ...data,
                lastSeen: {
                  seconds: data.lastSeen.seconds,
                  nanoseconds: data.lastSeen.nanoseconds,
                },
              })
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
  useEffect(() => {
    if (!auth.currentUser?.uid) return;
    const userDocRef = doc(
      db,
      FIREBASE_COLLECTIONS.USERS,
      auth.currentUser?.uid
    );

    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.contacts !== signedUser.contacts && data.contacts.length > 0) {
          dispatch(updateUserContacts(data.contacts));
        }
      } else {
        console.log("Document does not exist!");
      }
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  // todo handle tab close
  // useEffect(() => {
  //   const handleTabClose = (event) => {
  //     event.preventDefault(); // Necessary for some browsers to show the confirmation
  //     // Custom message (shown only in some browsers)
  //     event.returnValue = "Are you sure you want to leave?";
  //     // Perform your action (e.g., saving data, cleaning up resources, etc.)
  //     console.log("Tab is closing!");
  //   };

  //   // Add event listener
  //   window.addEventListener("beforeunload", handleTabClose);

  //   // Cleanup event listener on unmount
  //   return () => {
  //     window.removeEventListener("beforeunload", handleTabClose);
  //   };
  // }, []);

  return <Outlet />;
}

export default App;
