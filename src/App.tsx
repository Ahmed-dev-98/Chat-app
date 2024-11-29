import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAppDispatch } from "./store";
import { login } from "./store/slices/auth.slice";
import firebaseService from "./app/services/firebase/firebase.service";
function App() {
  const dispatch = useAppDispatch();
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
