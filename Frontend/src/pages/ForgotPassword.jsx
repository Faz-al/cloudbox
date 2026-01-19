import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../utils/api";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
     await axios.post(
  `${API_BASE}/auth/forgot-password`,
  { email },
  { withCredentials: true }
);


      // ALWAYS show success (no email existence leak)
      setSent(true);
    } catch (err) {
      // Still show success to avoid leaks
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-8 animate-fade-in">
        {/* Brand */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-blue-600 tracking-tight">
            SafeVault
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Secure cloud storage
          </p>
        </div>

        {!sent ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Forgot your password?
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Enter your email and we’ll send you a reset link.
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full py-3
                  bg-blue-600 text-white
                  rounded-lg font-medium text-sm
                  hover:bg-blue-700
                  active:scale-[0.98]
                  transition
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                {loading ? "Sending link…" : "Send reset link"}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:underline"
              >
                Back to login
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Success */}
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

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
