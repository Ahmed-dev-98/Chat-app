import { ROUTES } from "@/app/constants/routes";
import { useAppSelector } from "@/store";
import { selectAuth } from "@/store/slices/auth.slice";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const signedUser = useAppSelector(selectAuth);
  const token = localStorage.getItem("accessToken");

  if (!token || !signedUser) {
    return <Navigate to={ROUTES.HOME} />;
  } else {
    return children;
  }
};

export default ProtectedRoute;
