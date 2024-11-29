/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/constants/routes";
import firebaseService from "@/app/services/firebase/firebase.service";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const avatar = e.target.files[0];
      await firebaseService
        .uploadMedia(new Date().getTime().toString(), avatar, "avatars")
        .then((url) => {
          setAvatar(url);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatar) {
      setError("Please upload an avatar.");
      return;
    }

    try {
      const userCredential = await firebaseService.register(email, password);
      const user = userCredential.user;
      setSuccess("User registered successfully!");
      setError("");

      const userData = {
        uid: user.uid,
        displayName: displayName || "New User",
        email: email,
        isOnline: true,
        lastSeen: {
          seconds: new Date().getTime(),
          nanoseconds: new Date().getTime() * 1000,
        },
        avatar,
      };
      await firebaseService.setUserToFirestoreDb(user.uid, userData);
      navigate(ROUTES.LOGIN);
      setAvatar("");
    } catch (err: any) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <div className="w-full h-screen text-white flex justify-center items-center bg-[#0b141b]">
      <div className="w-full max-w-[400px] mx-auto p-4 border shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="border p-2 rounded text-black"
            required
          />
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
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="border p-2 rounded text-black"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
          {error && <p className="text-red-500 w-full text-center">{error}</p>}
          {success && (
            <p className="text-green-500 w-full text-center">{success}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
