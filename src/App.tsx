import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, FIREBASE_COLLECTIONS } from "@/app/services/firebase/firebase";
import { useAppDispatch } from "./store";
import { login } from "./store/slices/auth.slice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        const userDocRef = doc(db, FIREBASE_COLLECTIONS.USERS, user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          dispatch(login(userData));
        }
      } else {
        console.log("No user is signed in");
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <Outlet />;
}

export default App;
