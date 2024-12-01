import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/constants/routes";
import { useAppDispatch } from "@/store";
import { login } from "@/store/slices/auth.slice";
import firebaseService from "@/app/services/firebase/firebase.service";
import { Button } from "@/components/ui/button";
import { BsEyeFill } from "react-icons/bs";
import { BsEyeSlashFill } from "react-icons/bs";
import logo from "@/assets/logo.jpg";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
              seconds: new Date().getTime(),
              nanoseconds: new Date().getTime() * 1000,
            },
          })
        );
        setSuccess("Logged in successfully! , you will be redirected");
        navigate(ROUTES.CHAT_LAYOUT);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="w-full whatsAppBg h-screen text-white flex justify-center items-center bg-slate-950 ">
      <div className="w-full h-full flex flex-col gap-3 justify-center items-center">
        <img src={logo} className="w-[200px] rounded-full h-[200px]" alt="" />
        <div className="w-full max-w-[400px] mx-auto p-4 border shadow-md ">
          <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2  rounded text-black"
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
            <div className="w-full flex items-center justify-center gap-2">
              <Button
                type="submit"
                className="bg-blue-500 flex-1 text-white py-2 rounded hover:bg-blue-600"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate(ROUTES.REGISTER)}
                type="button"
                className="bg-blue-500 flex-1 text-white py-2 rounded hover:bg-blue-600"
              >
                Register
              </Button>
            </div>
            <Button
              onClick={googleAuth}
              type="submit"
              className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign In with google
            </Button>
            {error && (
              <p className="text-red-500 w-full text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-500 w-full text-center">{success}</p>
            )}
          </form>
        </div>{" "}
      </div>
    </div>
  );
};

export default Login;
