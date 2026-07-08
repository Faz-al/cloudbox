import { useState } from "react";
import { changePassword } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function KeyIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="8" cy="15" r="4" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 12l8-8m-3 3l2 2m-5 1l2 2" />
    </svg>
  );
}

function EyeIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
    </svg>
  );
}

function EyeOffIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.6 10.6A2 2 0 0012 14a2 2 0 001.4-.6" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6.4 6.8C3.9 8.6 2.5 12 2.5 12s3.5 6 9.5 6c1.7 0 3.1-.5 4.3-1.2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.9 5.2A10.4 10.4 0 0112 5c6 0 9.5 7 9.5 7a13.6 13.6 0 01-2.2 3.1" />
    </svg>
  );
}

function AlertIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.3 4.6L2.6 18a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 4.6a2 2 0 00-3.4 0z" />
    </svg>
  );
}

export default function ChangePasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  const valid = current && next.length >= 8 && next === confirm;

  const passwordScore = Math.min(
    [
      next.length >= 8,
      /[A-Z]/.test(next),
      /[0-9]/.test(next),
      /[^A-Za-z0-9]/.test(next),
    ].filter(Boolean).length,
    4
  );

  const scoreText =
    passwordScore <= 1
      ? "Weak"
      : passwordScore === 2
      ? "Fair"
      : passwordScore === 3
      ? "Good"
      : "Strong";

  const handleSubmit = async () => {
    if (!valid || loading) return;

    try {
      setLoading(true);
      setError("");

      await changePassword(current, next);

      await logout();
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">
            <KeyIcon />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">
              Change password
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
              Use a strong, unique password to keep your SafeVault account secure.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
          {show ? "Hide" : "Show"}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <PasswordField
            label="Current password"
            value={current}
            onChange={setCurrent}
            show={show}
          />

          <PasswordField
            label="New password"
            value={next}
            onChange={setNext}
            show={show}
            helper="Minimum 8 characters. Use numbers, symbols, and uppercase letters for better security."
          />

          <PasswordField
            label="Confirm new password"
            value={confirm}
            onChange={setConfirm}
            show={show}
            helper={
              confirm && next !== confirm
                ? "Passwords do not match yet."
                : confirm && next === confirm
                ? "Passwords match."
                : ""
            }
            helperTone={
              confirm && next !== confirm
                ? "red"
                : confirm && next === confirm
                ? "green"
                : "default"
            }
          />

          {error && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-950">
            Password strength
          </p>

          <div className="mt-4 grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={[
                  "h-2 rounded-full transition",
                  passwordScore >= step
                    ? passwordScore <= 1
                      ? "bg-red-400"
                      : passwordScore === 2
                      ? "bg-amber-400"
                      : passwordScore === 3
                      ? "bg-blue-500"
                      : "bg-emerald-500"
                    : "bg-slate-200",
                ].join(" ")}
              />
            ))}
          </div>

          <p
            className={[
              "mt-3 text-sm font-bold",
              passwordScore <= 1
                ? "text-red-500"
                : passwordScore === 2
                ? "text-amber-600"
                : passwordScore === 3
                ? "text-blue-600"
                : "text-emerald-600",
            ].join(" ")}
          >
            {next ? scoreText : "Enter a new password"}
          </p>

          <ul className="mt-4 space-y-2 text-xs leading-5 text-slate-500">
            <Requirement done={next.length >= 8}>
              At least 8 characters
            </Requirement>
            <Requirement done={/[A-Z]/.test(next)}>
              Includes uppercase letter
            </Requirement>
            <Requirement done={/[0-9]/.test(next)}>
              Includes a number
            </Requirement>
            <Requirement done={/[^A-Za-z0-9]/.test(next)}>
              Includes a symbol
            </Requirement>
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-[1.5rem] border border-amber-100 bg-amber-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-xs font-semibold leading-5 text-amber-700">
          Changing your password will sign you out from all devices for your protection.
        </p>

        <button
          onClick={handleSubmit}
          disabled={!valid || loading}
          className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  helper,
  helperTone = "default",
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </label>

      <input
        type={show ? "text" : "password"}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {helper && (
        <p
          className={[
            "mt-2 text-xs leading-5",
            helperTone === "red"
              ? "text-red-500"
              : helperTone === "green"
              ? "text-emerald-600"
              : "text-slate-400",
          ].join(" ")}
        >
          {helper}
        </p>
      )}
    </div>
  );
}

function Requirement({ done, children }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={[
          "grid h-4 w-4 place-items-center rounded-full text-[10px]",
          done ? "bg-emerald-500 text-white" : "bg-slate-200 text-transparent",
        ].join(" ")}
      >
        ✓
      </span>
      <span className={done ? "text-slate-700" : ""}>{children}</span>
    </li>
  );
}