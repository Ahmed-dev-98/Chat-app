/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import {
  auth,
  db,
  FIREBASE_COLLECTIONS,
  provider,
} from "@/app/services/firebase/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/constants/routes";
import { useAppDispatch } from "@/store";
import { login } from "@/store/slices/auth.slice";
import { IUser } from "@/app/types/types";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userDocRef = doc(
        db,
        FIREBASE_COLLECTIONS.USERS,
        userCredential.user.uid
      );
      await updateDoc(userDocRef, { isOnline: true });
      setError("");
      setSuccess("Logged in successfully! , you will be redirected");
      navigate(ROUTES.CHAT_LAYOUT);
    } catch (err: any) {
      setError(err.message);
      setSuccess("");
    }
  };

  const signInWithGoogle = async () => {
    let userData = {} as IUser;
    await signInWithPopup(auth, provider).then((data) => {
      userData = {
        displayName: data.user.displayName || "",
        email: data.user.email || "",
        uid: data.user.uid,
        avatar: data.user.photoURL || "",
        isOnline: true,
        lastSeen: {
          seconds: new Date().getTime(),
          nanoseconds: new Date().getTime(),
        },
      };
      dispatch(login(userData));
      setSuccess("Logged in successfully! , you will be redirected");
      navigate(ROUTES.CHAT_LAYOUT);
    });
    if (userData)
      await setDoc(doc(db, FIREBASE_COLLECTIONS.USERS, userData.uid), userData);
  };

  return (
    <div className="w-full h-screen text-white flex justify-center items-center bg-[#0b141b]">
      <div className="w-full max-w-[400px] mx-auto p-4 border shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded text-black"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded text-black"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Sign In
          </button>
          <button
            onClick={signInWithGoogle}
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Sign In with google
          </button>
          {error && <p className="text-red-500 w-full text-center">{error}</p>}
          {success && (
            <p className="text-green-500 w-full text-center">{success}</p>
          )}
        </form>
      </div>{" "}
    </div>
  );
};

export default Login;
