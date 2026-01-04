import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TEMP: simulate sending email
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-8 animate-fade-in">
        {/* Brand */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-blue-600 tracking-tight">
            CloudBox
          </h1>
        </div>

        {!sent ? (
          <>
            {/* Form state */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Reset your password
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Enter your email and we’ll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 active:scale-[0.98] transition"
              >
                Send reset link
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Success state */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Check your email
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                If an account with that email exists, we’ve sent a password reset
                link.
              </p>

              <Link
                to="/login"
                className="inline-block mt-6 text-blue-600 font-medium hover:underline"
              >
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Animation */}
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
  );
}
