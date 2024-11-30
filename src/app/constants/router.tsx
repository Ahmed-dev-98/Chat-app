import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./routes";
import AuthLayout from "../../modules/auth/auth-layout";
import Login from "@/modules/auth/_components/login";
import LandingPage from "@/modules/auth/_components/landing-page";
import Register from "@/modules/auth/_components/register";
import Chat from "@/modules/chat/chat-layout/chat";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <AuthLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: ROUTES.LOGIN, element: <Login /> },
      { path: ROUTES.REGISTER, element: <Register /> },
    ],
  },
  {
    path: ROUTES.CHAT_LAYOUT,
    element: <Chat />,
  },
]);
