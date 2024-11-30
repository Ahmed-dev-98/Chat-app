import { ROUTES } from "@/app/constants/routes";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logo from "/src/assets/logo.jpg";
const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* Navbar */}
      <header className="bg-slate-700 shadow-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={logo} className="w-12 rounded-full" alt="" />
            <h1 className="text-xl font-bold text-green-600">Talkiee</h1>
          </div>
          <div className="space-x-4">
            <Button
              onClick={() => navigate(ROUTES.LOGIN)}
              variant="ghost"
              className="text-sm text-white hover:text-black"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate(ROUTES.REGISTER)}
              className="text-sm"
            >
              Register
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 sm:text-5xl">
            Seamless Conversations, Simplified
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Connect with anyone, anytime, and anywhere. Talkiee brings you
            closer to the people that matter.
          </p>
          <div className="mt-6 space-x-4">
            <Button className="px-6 py-3">Contact Us</Button>

            <Button
              onClick={() =>
                window.open(
                  "https://portfolio-xi-three-33.vercel.app/",
                  "_blank"
                )
              }
              variant="outline"
              className="px-6 py-3"
            >
              More Products
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Why Choose Talkiee?
          </h2>
          <p className="text-center text-gray-600 mt-4">
            A modern chat application built for speed, simplicity, and security.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-50 text-green-600 rounded-full mx-auto">
                💬
              </div>
              <h3 className="text-xl font-medium text-gray-800 mt-4">
                Real-Time Messaging
              </h3>
              <p className="text-gray-600 mt-2">
                Chat instantly with your contacts, powered by real-time
                technology.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-50 text-green-600 rounded-full mx-auto">
                🔒
              </div>
              <h3 className="text-xl font-medium text-gray-800 mt-4">
                Secure Conversations
              </h3>
              <p className="text-gray-600 mt-2">
                End-to-end encryption ensures your privacy and data security.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-50 text-green-600 rounded-full mx-auto">
                ⚡
              </div>
              <h3 className="text-xl font-medium text-gray-800 mt-4">
                Lightning Fast
              </h3>
              <p className="text-gray-600 mt-2">
                Optimized for speed, providing a seamless user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            How It Works
          </h2>
          <p className="text-center text-gray-600 mt-4">
            Start chatting in just a few simple steps.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-50 text-green-600 rounded-full mx-auto">
                1️⃣
              </div>
              <h3 className="text-xl font-medium text-gray-800 mt-4">
                Sign Up
              </h3>
              <p className="text-gray-600 mt-2">
                Create your account in seconds with just your email.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-50 text-green-600 rounded-full mx-auto">
                2️⃣
              </div>
              <h3 className="text-xl font-medium text-gray-800 mt-4">
                Add Contacts
              </h3>
              <p className="text-gray-600 mt-2">
                Find and add users to start a conversation.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-50 text-green-600 rounded-full mx-auto">
                3️⃣
              </div>
              <h3 className="text-xl font-medium text-gray-800 mt-4">
                Start Chatting
              </h3>
              <p className="text-gray-600 mt-2">
                Enjoy real-time communication with your contacts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-green-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="text-white text-lg mt-4">
            Join Talkiee today and connect with your world effortlessly.
          </p>
          <div className="mt-6 space-x-4">
            <Button
              variant={"default"}
              onClick={() => navigate(ROUTES.REGISTER)}
            >
              Register Now
            </Button>
            <Button
              onClick={() => navigate(ROUTES.LOGIN)}
              variant="default"
              className="text-black hover:text-white bg-white border-white px-6 py-3"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Talkiee. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
