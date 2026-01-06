import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ===== PASSWORD STRENGTH =====
const getPasswordStrength = (pwd) => {
  if (pwd.length === 0) return null;
  if (pwd.length < 6)
    return { label: "Weak", color: "bg-red-500", width: "25%" };
  if (pwd.length < 10)
    return { label: "Medium", color: "bg-yellow-500", width: "60%" };
  return { label: "Strong", color: "bg-green-500", width: "100%" };
};

const passwordStrength = getPasswordStrength(password);

  const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
  setError("Please enter a valid email address");
  return;
}


    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      await signup(email, password);
      setSuccess(true);
    } catch (err) {
      const msg =
        err?.message?.toLowerCase().includes("exists")
          ? "An account with this email already exists"
          : "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Background */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 animate-fade-up">

            {!success ? (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Create your CloudBox account
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Secure cloud storage built for peace of mind
                  </p>
                </div>

                {/* Trust badges */}
                <div className="flex justify-center gap-4 text-xs text-gray-500 mb-6">
                  <span className="flex items-center gap-1">🔒 Encrypted</span>
                  <span className="flex items-center gap-1">🛡️ Private</span>
                  <span className="flex items-center gap-1">☁️ 5 GB Free</span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />

                  <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>

                  
                  


                  {passwordStrength && (
                    <div className="space-y-1">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  style={{ width: passwordStrength.width }}
                  />
                  </div>
                <p className="text-xs text-gray-600">
            Password strength:{" "}
            <span className="font-medium">
             {passwordStrength.label}
                   </span>
              </p>
            </div>
              )}


                  <div className="relative">
  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
  />
  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
  >
    {showConfirmPassword ? "Hide" : "Show"}
  </button>
</div>

                  

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 animate-shake">
                      {error}
                    </div>
                  )}

                  <button
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
                  >
                    {loading ? "Creating account…" : "Create account"}
                  </button>
                </form>

                {/* Footer */}
                <p className="text-sm text-center mt-6 text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:underline"
                  >
                    Log in
                  </Link>
                </p>

                <p className="text-[11px] text-center text-gray-400 mt-4">
                  We never share your data. Your files stay private.
                </p>
              </>
            ) : (
              /* Success state */
              <div className="text-center animate-fade-up">
                <div className="text-green-600 text-4xl mb-3">✓</div>
                <h2 className="text-xl font-semibold mb-2">
                  Account created successfully
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Please log in to access your secure storage.
                </p>

                <Link
                  to="/login"
                  className="inline-block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                  Go to login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-up {
            animation: fadeUp 0.6s ease-out both;
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }

          .animate-shake {
            animation: shake 0.3s ease-in-out;
          }
        `}
      </style>
    </>
  );
}
