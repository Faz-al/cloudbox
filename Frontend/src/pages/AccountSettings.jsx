import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { getMe } from "../utils/api";
import { useAuth } from "../context/AuthContext";

function BackIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function UserIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 21a8 8 0 10-16 0" />
      <circle cx="12" cy="8" r="4" strokeWidth="2" />
    </svg>
  );
}

function ShieldIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
    </svg>
  );
}

function CrownIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8l4 4 4-7 4 7 4-4v10H4V8z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 20h16" />
    </svg>
  );
}

function AlertIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.3 4.6L2.6 18a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 4.6a2 2 0 00-3.4 0z" />
    </svg>
  );
}

function HomeIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 11l9-8 9 8" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10v10h14V10" />
    </svg>
  );
}

function FolderIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8.5a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  );
}

function VaultIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11V8a5 5 0 0110 0v3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 11h12v9H6v-9z" />
    </svg>
  );
}

export default function AccountSettings() {
  const isAndroidApp = Capacitor.getPlatform() === "android";
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  navigate("/login", { replace: true });
};

  useEffect(() => {
    document.title = "Account Settings · SafeVault";

    getMe()
      .then((user) => {
        if (user?.email) {
          setEmail(user.email);
        }
      })
      .catch(() => {
        // silent fail, keep UI stable
      });
  }, []);

  const initial = email ? email[0].toUpperCase() : "?";

  return (
    <div
      className={[
        "min-h-full animate-fade-in",
        isAndroidApp
          ? "bg-gradient-to-b from-blue-50 via-white to-white px-4 pb-28 pt-5"
          : "bg-slate-50 px-4 py-5 sm:px-6 lg:px-8 lg:py-7",
      ].join(" ")}
    >
      <main className="mx-auto max-w-6xl">
        {/* Header */}
        <div
          className={[
            "mb-5",
            isAndroidApp
              ? ""
              : "rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl",
          ].join(" ")}
        >
          <Link
            to="/dashboard"
            className={[
              "mb-3 inline-flex w-fit items-center gap-2 text-sm font-semibold transition",
              isAndroidApp
                ? "rounded-full bg-white px-3 py-2 text-blue-600 shadow-sm active:scale-95"
                : "text-blue-600 hover:text-blue-700",
            ].join(" ")}
          >
            <BackIcon />
            Dashboard
          </Link>

          <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-5 shadow-sm sm:p-7">
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue-100 blur-3xl" />
            <div className="absolute -bottom-14 -left-14 h-44 w-44 rounded-full bg-sky-100 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-500">
                  Account
                </p>

                <h1
                  className={[
                    "mt-2 font-bold tracking-tight text-slate-950",
                    isAndroidApp ? "text-3xl" : "text-2xl sm:text-3xl",
                  ].join(" ")}
                >
                  Account settings
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Control your profile details, account preferences, and SafeVault plan information.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/20">
                  {initial}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-950">
                    {email || "Account"}
                  </p>
                  <p className="text-xs font-medium text-slate-400">
                    SafeVault user
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Profile */}
          <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <UserIcon />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-950">
                  Profile
                </h2>
                <p className="text-xs text-slate-400">
                  Basic account details
                </p>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="grid h-16 w-16 place-items-center rounded-[1.35rem] bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-600/20">
                {initial}
              </div>

              <div>
                <button
                  disabled
                  className="text-sm font-bold text-slate-400 cursor-not-allowed"
                >
                  Change profile photo
                </button>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  JPG, PNG up to 5MB. Coming soon.
                </p>
              </div>
            </div>

            <Field label="Full name" value="" placeholder="Not set" />
            <Field
              label="Email address"
              value={email}
              helper="To protect your account, email updates are managed through support."
            />
          </section>

          {/* Right */}
          <div className="space-y-5 lg:col-span-2">
            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 text-sky-700">
                  <ShieldIcon />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-950">
                    Preferences
                  </h2>
                  <p className="text-xs text-slate-400">
                    Device-based settings
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SelectField label="Language" value="English (US)" />
                <SelectField label="Time zone" value="Asia / Kolkata" />
              </div>

              <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
                Preferences are automatically configured based on your device and location.
              </p>
            </section>

            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                    <CrownIcon />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-950">
                      SafeVault Free Plan
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Upgrade later to unlock more storage and features.
                    </p>
                  </div>
                </div>

                <button
                  disabled
                  className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-400 cursor-not-allowed"
                >
                  Manage plan
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] border border-red-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-red-600">
                    <AlertIcon />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-red-600">
                      Danger zone
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Permanently delete your SafeVault account and all stored files.
                    </p>
                  </div>
                </div>

                <button
                  disabled
                  className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-300 cursor-not-allowed"
                >
                  Delete account
                </button>
              </div>
            </section>
          </div>
        </div>

        <section className="mt-5 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
    Account actions
  </p>

  <h2 className="mt-2 text-xl font-black text-slate-950">
    Settings and logout
  </h2>

  <p className="mt-2 text-sm leading-6 text-slate-500">
    Manage your account security or sign out from this device.
  </p>

  <div className="mt-5 grid gap-3 sm:grid-cols-2">
    <Link
      to="/settings/security"
      className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm font-bold text-blue-700 active:scale-[0.99]"
    >
      <span>Security settings</span>
      <span>→</span>
    </Link>

    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm font-bold text-red-700 active:scale-[0.99]"
    >
      <span>Logout</span>
      <span>→</span>
    </button>
  </div>
</section>

        {isAndroidApp && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 px-4 pb-4 pt-3 shadow-[0_-16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
              <BottomNavItem to="/dashboard" label="Home" icon={<HomeIcon />} />
              <BottomNavItem to="/files" label="Files" icon={<FolderIcon />} />
              <BottomNavItem to="/vault" label="Vault" icon={<VaultIcon />} />
              <BottomNavItem to="/account" label="Account" active icon={<UserIcon className="h-4 w-4" />} />
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}

function Field({ label, value, placeholder, helper }) {
  return (
    <div className="mb-5 last:mb-0">
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </label>

      <input
        disabled
        value={value}
        placeholder={placeholder}
        className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500 outline-none"
      />

      {helper && (
        <p className="mt-2 text-xs leading-5 text-slate-400">
          {helper}
        </p>
      )}
    </div>
  );
}

function SelectField({ label, value }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </label>

      <select
        disabled
        className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-400 outline-none"
      >
        <option>{value}</option>
      </select>
    </div>
  );
}

function BottomNavItem({ to, label, icon, active = false }) {
  return (
    <Link
      to={to}
      className={[
        "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold active:bg-blue-50",
        active ? "text-blue-600" : "text-slate-400",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-8 w-8 place-items-center rounded-2xl",
          active ? "bg-blue-50 text-blue-600" : "text-slate-400",
        ].join(" ")}
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}