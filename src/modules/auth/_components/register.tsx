/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/constants/routes";
import firebaseService from "@/app/services/firebase/firebase.service";
import { Button } from "@/components/ui/button";
import { BsEyeFill } from "react-icons/bs";
import { BsEyeSlashFill } from "react-icons/bs";
import logo from "@/assets/logo.jpg";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        isOnline: false,
        lastSeen: {
          seconds: new Date().getTime(),
          nanoseconds: new Date().getTime() * 1000,
        },
        avatar,
        contacts: [],
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
    <div className="w-full h-screen whatsAppBg text-white flex justify-center items-center bg-slate-950 ">
      <div className="w-full h-full flex flex-col gap-3 justify-center items-center">
        <img src={logo} className="w-[200px] rounded-full h-[200px]" alt="" />

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
            <div className="w-full flex justify-between items-center bg-white p-2 border rounded text-black">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-0 outline-none"
              />
              {showPassword ? (
                <BsEyeFill
                  onClick={() => setShowPassword(!showPassword)}
                  color="black"
                  size={20}
                />
              ) : (
                <BsEyeSlashFill
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                  color="black"
                  size={20}
                />
              )}
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="border p-2 rounded text-black"
            />
            <Button
              type="submit"
              className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign Up
            </Button>{" "}
            <Button
              onClick={() => navigate(ROUTES.HOME)}
              type="button"
              className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Home
            </Button>
            {error && (
              <p className="text-red-500 w-full text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-500 w-full text-center">{success}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
