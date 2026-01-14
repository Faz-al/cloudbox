import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../utils/api";


export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;

  if (password.length < 8) {
    return setError("Password must be at least 8 characters");
  }

  if (password !== confirm) {
    return setError("Passwords do not match");
  }

  setLoading(true);
  setError("");

  try {
    await axios.post(
  `${API_BASE}/auth/reset-password/${encodeURIComponent(token)}`,
  { password, token }, // 👈 add token here
  { withCredentials: true }
);


    setDone(true);
    setTimeout(() => navigate("/login"), 2500);
  } catch (err) {
    setError("Invalid or expired reset link");
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
            CloudBox
          </h1>
        </div>

        {!done ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Set new password
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Choose a strong password to secure your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm password
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                "
              >
                {loading ? "Updating…" : "Reset password"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Password updated
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to login…
            </p>

            <Link
              to="/login"
              className="inline-block mt-6 text-blue-600 hover:underline"
            >
              Go to login
            </Link>
          </div>
        )}
      </div>

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
