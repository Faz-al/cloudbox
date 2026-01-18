import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getMe } from "../utils/api";


export default function Login() {
const { login, suspended, refreshUser } = useAuth();
  

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false); // ✅ MOVED INSIDE
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [otpMode, setOtpMode] = useState(false);
const [otp, setOtp] = useState("");
const [tempUserId, setTempUserId] = useState(null);
const [resendCooldown, setResendCooldown] = useState(30);




useEffect(() => {
  if (!otpMode || resendCooldown <= 0) return;

  const timer = setTimeout(() => {
    setResendCooldown((prev) => prev - 1);
  }, 1000);

  return () => clearTimeout(timer);
}, [otpMode, resendCooldown]);


  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ EMAIL VALIDATION (NOW ACTUALLY USED)
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
  setLoading(true);

  const form = e.currentTarget;
const emailValue = form.elements.email.value;

const res = await login(emailValue, password);


  // 🔐 2FA required
if (res?.requires2FA) {
  setOtpMode(true);
  setTempUserId(res.userId);
  setResendCooldown(30);
  setOtp("");
  return;
}


  // normal login
  navigate("/dashboard");
} catch {
  setError("Invalid email or password");
} finally {
  setLoading(false);
}

  };

    

    const submitOTP = async () => {
  setLoading(true);
  setError("");

  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/login/2fa`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: tempUserId,
          otp,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Invalid or expired OTP");
      return;
    }

    // 🔑 THIS IS THE MISSING LINK
    await refreshUser();

    navigate("/dashboard", { replace: true });
  } catch {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};






const resendOTP = async () => {
  if (resendCooldown > 0) return;

  setError("");
  setResendCooldown(30);

  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/login/2fa/resend`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: tempUserId }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Failed to resend OTP");
      setResendCooldown(0);
    }
  } catch {
    setError("Failed to resend OTP");
    setResendCooldown(0);
  }
};














  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 animate-fade-up">

            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Log in to access your secure files
              </p>
            </div>

            <div className="flex justify-center gap-4 text-xs text-gray-500 mb-6">
              <span>🔒 Encrypted</span>
              <span>🛡️ Private</span>
              <span>☁️ CloudBox</span>
            </div>



            {suspended && (
  <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
    Your account has been suspended by CloudBox. Please contact support.
  </div>
)}






           {!otpMode ? (
  <form onSubmit={handleSubmit} className="space-y-4">
    <input
      type="email"
  name="email"
  autoComplete="email"
      placeholder="Email address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>

    <div className="text-right">
      <Link
        to="/forgot-password"
        className="text-sm text-blue-600 hover:underline"
      >
        Forgot password?
      </Link>
    </div>

    {error && (
      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 animate-shake">
        {error}
      </div>
    )}

    <button
      disabled={loading}
      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-md"
    >
      {loading ? "Logging in…" : "Log in"}
    </button>







  </form>
) : (
  <div className="space-y-4">
    <input
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      placeholder="Enter 6-digit code"
      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    {error && (
      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
        {error}
      </div>
    )}

    <button
      type="button"
      onClick={submitOTP}
      disabled={loading}
      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-md"
    >
      {loading ? "Verifying…" : "Verify & Login"}
    </button>


      <button
  type="button"
  onClick={resendOTP}
  disabled={resendCooldown > 0 || loading}
  className="w-full text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
>
  {resendCooldown > 0
    ? `Resend OTP in ${resendCooldown}s`
    : "Resend OTP"}
</button>








  </div>
)}


            <p className="text-sm text-center mt-6 text-gray-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>

            <p className="text-[11px] text-center text-gray-400 mt-4">
              Your data is encrypted and never shared.
            </p>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 0.6s ease-out both;
          }
          @keyframes shake {
            0%,100%{transform:translateX(0)}
            25%{transform:translateX(-4px)}
            75%{transform:translateX(4px)}
          }
          .animate-shake {
            animation: shake 0.3s ease-in-out;
          }
        `}
      </style>
    </>
  );
}



