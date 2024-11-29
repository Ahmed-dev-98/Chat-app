import { ROUTES } from "@/app/constants/routes";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen text-white flex justify-center items-center bg-[#0b141b]">
      <div className="w-full max-w-[400px] mx-auto p-4 border shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Welcome</h2>
        <div className="w-full flex items-center justify-center gap-3">
          <button
            className="bg-blue-500 min-w-[5rem] text-white py-2 rounded hover:bg-blue-600"
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Login
          </button>
          <button
            className="bg-blue-500 min-w-[5rem] text-white py-2 rounded hover:bg-blue-600"
            onClick={() => navigate(ROUTES.REGISTER)}
          >
            Register
          </button>
        </div>
      </div>{" "}
    </div>
  );
};

export default LandingPage;
