import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function Signup() {
  return (
    <>
          <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      {/* Card */}
      <div
        className="
          w-full max-w-md
          bg-white
          rounded-2xl
          shadow-[0_20px_40px_rgba(0,0,0,0.08)]
          p-8
          animate-fade-in
        "
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-blue-600 tracking-tight">
            CloudBox
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Create your free account and get 5GB storage
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="
                w-full px-4 py-3
                border border-gray-300
                rounded-lg
                text-sm
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
                focus:border-blue-500
                transition
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a strong password"
              className="
                w-full px-4 py-3
                border border-gray-300
                rounded-lg
                text-sm
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
                focus:border-blue-500
                transition
              "
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              className="
                w-full px-4 py-3
                border border-gray-300
                rounded-lg
                text-sm
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
                focus:border-blue-500
                transition
              "
            />
          </div>

          {/* Signup button */}
          <button
            type="submit"
            className="
              w-full py-3
              bg-blue-600
              text-white
              rounded-lg
              font-medium
              text-sm
              hover:bg-blue-700
              active:scale-[0.98]
              transition
            "
          >
            Create account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
    </>
  );
}
