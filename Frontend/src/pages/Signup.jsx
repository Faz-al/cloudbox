import { API_BASE } from "../utils/api";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

export default function Signup() {
  const isAndroidApp = Capacitor.getPlatform() === "android";

  const [step, setStep] = useState("form"); // form | otp | done
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [cooldown, setCooldown] = useState(60);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Sign up · SafeVault";
  }, []);

  useEffect(() => {
    if (step !== "otp") return;

    const interval = setInterval(() => {
      setCooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const getPasswordStrength = (pwd) => {
    if (pwd.length === 0) return null;
    if (pwd.length < 6) {
      return { label: "Weak", color: "bg-red-500", width: "25%" };
    }
    if (pwd.length < 10) {
      return { label: "Medium", color: "bg-yellow-500", width: "60%" };
    }
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const passwordStrength = getPasswordStrength(password);

  const isValidEmail = (emailValue) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    setError("");
    setOtpError("");

    const cleanEmail = email.trim();

    if (!isValidEmail(cleanEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!cleanEmail || !password || !confirmPassword) {
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

      const res = await fetch(`${API_BASE}/auth/signup/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "OTP failed");

      setEmail(cleanEmail);
      setStep("otp");
      setCooldown(60);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setOtpError("");

    if (otp.length !== 6) {
      setOtpError("Enter 6 digit OTP");
      return;
    }

    try {
      setOtpLoading(true);

      const res = await fetch(`${API_BASE}/auth/signup/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      if (window.fbq) {
        window.fbq("track", "CompleteRegistration");
      }

      setStep("done");
    } catch (err) {
      setOtpError(err.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div
      className={[
        "min-h-screen overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white text-slate-950",
        isAndroidApp ? "px-5 pb-5 pt-5" : "px-4 py-20",
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
              Create your secure vault
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
              Set up your private SafeVault account and protect your files.
            </p>
          </div>

          <section className="animate-fade-up rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-7">
            {step === "form" && (
              <>
                <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                  <p className="text-sm font-bold text-blue-900">
                    Private account setup
                  </p>
                  <p className="mt-1 text-xs leading-5 text-blue-700/80">
                    Create your account to start using SafeVault.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Email address"
                      autoComplete="email"
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
                        autoComplete="new-password"
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

                  {passwordStrength && (
                    <div className="space-y-2">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: passwordStrength.width }}
                        />
                      </div>

                      <p className="text-xs text-slate-500">
                        Password strength:{" "}
                        <span className="font-bold text-slate-700">
                          {passwordStrength.label}
                        </span>
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Confirm password
                    </label>

                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 pr-16 text-sm text-slate-950 outline-none placeholder:text-slate-400 transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600"
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
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
                    {loading ? "Creating account…" : "Create account"}
                  </button>

                  <p className="text-center text-[11px] leading-relaxed text-slate-400">
                    By creating an account, you agree to SafeVault’s{" "}
                    <Link to="/terms" className="font-semibold text-blue-600">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="font-semibold text-blue-600">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link to="/login" className="font-bold text-blue-600">
                    Log in
                  </Link>
                </p>
              </>
            )}

            {step === "otp" && (
              <div className="animate-fade-up text-center">
                <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                  <MailIcon />
                </div>

                <h2 className="text-xl font-black text-slate-950">
                  Verify your email
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-bold text-slate-700">{email}</span>
                </p>

                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-lg tracking-[0.35em] text-slate-950 outline-none placeholder:text-slate-400 transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                  placeholder="______"
                  inputMode="numeric"
                />

                {otpError && (
                  <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {otpError}
                  </div>
                )}

                <button
                  onClick={verifyOTP}
                  disabled={otpLoading}
                  className="mt-4 w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
                >
                  {otpLoading ? "Verifying…" : "Verify OTP"}
                </button>

                <button
                  disabled={cooldown > 0 || loading}
                  onClick={handleSubmit}
                  className="mt-4 text-sm font-semibold text-blue-600 disabled:text-slate-400"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
            )}

            {step === "done" && (
              <div className="animate-fade-up text-center">
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-3xl font-black text-emerald-600">
                  ✓
                </div>

                <h2 className="text-xl font-black text-slate-950">
                  Account created successfully
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Please log in to access your secure storage.
                </p>

                <Link
                  to="/login"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
                >
                  Go to login
                </Link>
              </div>
            )}
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
            0%, 100% { transform: translateX(0); }
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

function MailIcon({ className = "h-6 w-6" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16v12H4V6z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 7l8 6 8-6"
      />
    </svg>
  );
}