import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, suspended, refreshUser } = useAuth();

  const navigate = useNavigate();
  const isAndroidApp = Capacitor.getPlatform() === "android";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempUserId, setTempUserId] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(30);

  useEffect(() => {
    document.title = "Login · SafeVault";
  }, []);

  useEffect(() => {
    if (!otpMode || resendCooldown <= 0) return;

    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [otpMode, resendCooldown]);

  const isValidEmail = (emailValue) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailValue = email.trim();

    if (!isValidEmail(emailValue)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      const res = await login(emailValue, password);

      if (res?.requires2FA) {
        setOtpMode(true);
        setTempUserId(res.userId);
        setResendCooldown(30);
        setOtp("");
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const submitOTP = async () => {
    setLoading(true);
    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/login/2fa`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: tempUserId,
            otp: otp.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid or expired OTP");
        return;
      }

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
    <div
      className={[
        "min-h-screen overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white text-slate-950",
        isAndroidApp ? "px-5 pb-8 pt-8" : "px-4 py-20",
      ].join(" ")}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-20 h-80 w-80 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute -right-28 top-28 h-80 w-80 rounded-full bg-sky-100 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-50 blur-3xl" />
      </div>

      <main
        className={[
          "relative z-10 mx-auto flex min-h-screen w-full flex-col",
          isAndroidApp ? "max-w-md justify-start" : "max-w-md justify-center",
        ].join(" ")}
      >
       <div className={isAndroidApp ? "pt-2" : ""}>
          <div className="mb-7 text-center">
            

            <h1
              className={[
  "font-black tracking-tight text-slate-950",
  isAndroidApp ? "mt-2 text-3xl" : "mt-0 text-3xl",
].join(" ")}
            >
              Sign in to your secure vault
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
              Access your private files, protected vault, and account workspace.
            </p>
          </div>

          <section className="animate-fade-up rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-7">
            <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-sm font-bold text-blue-900">
                Protected access
              </p>
              <p className="mt-1 text-xs leading-5 text-blue-700/80">
                Use your SafeVault credentials to continue.
              </p>
            </div>

            {suspended && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Your account has been suspended by SafeVault. Please contact support.
              </div>
            )}

            {!otpMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-950 outline-none placeholder:text-slate-400 transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 pr-16 text-sm text-slate-950 outline-none placeholder:text-slate-400 transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <div className="animate-shake rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                <button
                  disabled={loading}
                  className="w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Logging in…" : "Log in"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Two-step verification
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Enter the 6-digit code sent to your email.
                  </p>
                </div>

                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit code"
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-lg tracking-[0.35em] text-slate-950 outline-none placeholder:text-slate-400 transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={submitOTP}
                  disabled={loading}
                  className="w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Verifying…" : "Verify & login"}
                </button>

                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={resendCooldown > 0 || loading}
                  className="w-full text-sm font-semibold text-blue-600 disabled:text-slate-400"
                >
                  {resendCooldown > 0
                    ? `Resend OTP in ${resendCooldown}s`
                    : "Resend OTP"}
                </button>
              </div>
            )}

            <p className="mt-6 text-center text-sm text-slate-500">
              Don’t have an account?{" "}
              <Link to="/signup" className="font-bold text-blue-600">
                Sign up
              </Link>
            </p>
          </section>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            Your files stay private and protected.
          </p>
        </div>
      </main>

      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-up {
            animation: fadeUp 0.45s ease-out both;
          }

          @keyframes shake {
            0%,100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }

          .animate-shake {
            animation: shake 0.3s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}