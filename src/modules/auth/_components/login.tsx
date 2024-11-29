import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/constants/routes";
import { useAppDispatch } from "@/store";
import { login } from "@/store/slices/auth.slice";
import firebaseService from "@/app/services/firebase/firebase.service";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await firebaseService
      .signInWithCredentials(email, password)
      .then(async (data) => {
        dispatch(
          login({
            ...data,
            lastSeen: {
              seconds: data.lastSeen.seconds,
              nanoseconds: data.lastSeen.nanoseconds,
            },
          })
        );
        setError("");
        setSuccess("Logged in successfully! , you will be redirected");
        navigate(ROUTES.CHAT_LAYOUT);
      })
      .catch((error) => {
        setError(error.message);
        setSuccess("");
      });
  };
  const googleAuth = async () => {
    await firebaseService
      .signInWithGoogle()
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
        setSuccess("Logged in successfully! , you will be redirected");
        navigate(ROUTES.CHAT_LAYOUT);
      })
      .catch((error) => console.error(error));
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
          <div className="w-full flex items-center justify-center gap-2">
            <button
              type="submit"
              className="bg-blue-500 flex-1 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate(ROUTES.REGISTER)}
              type="button"
              className="bg-blue-500 flex-1 text-white py-2 rounded hover:bg-blue-600"
            >
              Register
            </button>
          </div>
          <button
            onClick={googleAuth}
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
