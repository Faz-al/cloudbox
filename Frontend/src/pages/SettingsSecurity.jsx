import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

import ChangePasswordCard from "../components/security/ChangePasswordCard";
import ActiveSessionsCard from "../components/security/ActiveSessionsCard";
import LogoutEverywhereCard from "../components/security/LogoutEverywhereCard";
import { API_BASE, toggleEmail2FA, getMe } from "../utils/api";

function BackIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
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

function KeyIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="8" cy="15" r="4" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 12l8-8m-3 3l2 2m-5 1l2 2" />
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

function UserIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 21a8 8 0 10-16 0" />
      <circle cx="12" cy="8" r="4" strokeWidth="2" />
    </svg>
  );
}

export default function SettingsSecurity() {
  const isAndroidApp = Capacitor.getPlatform() === "android";

  const [sessions, setSessions] = useState([]);
  const [email2FAEnabled, setEmail2FAEnabled] = useState(false);
  const [toggling2FA, setToggling2FA] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Security & Privacy · SafeVault";

    fetch(`${API_BASE}/auth/security/sessions`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setSessions);

    getMe().then((me) => {
      setEmail2FAEnabled(!!me.email2FAEnabled);
    });
  }, []);

  const formattedSessions = sessions.map((s) => ({
    id: s._id,
    device: `${s.browser} on ${s.os}`,
    ip: s.ip,
    location: s.location,
    lastActive: new Date(s.lastSeen).toLocaleString(),
    isCurrent: s.isCurrent,
    isSuspicious: s.isSuspicious,
  }));

  const logoutDevice = (id) => {
    fetch(`${API_BASE}/auth/security/sessions/${id}/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setSessions((s) => s.filter((x) => x._id !== id));
    });
  };

  const logoutOthers = () => {
    fetch(`${API_BASE}/auth/security/logout-others`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setSessions((s) => s.filter((x) => x.isCurrent));
    });
  };

  const handleToggle2FA = async () => {
    if (email2FAEnabled) {
      setShowPasswordPrompt(true);
      return;
    }

    try {
      setToggling2FA(true);
      const res = await toggleEmail2FA();
      setEmail2FAEnabled(res.enabled);
    } catch {
      alert("Failed to update 2FA setting");
    } finally {
      setToggling2FA(false);
    }
  };

  const confirmDisable2FA = async () => {
    setError("");

    if (!currentPassword) {
      setError("Please enter your password");
      return;
    }

    try {
      setToggling2FA(true);

      const res = await toggleEmail2FA({
        currentPassword,
      });

      setEmail2FAEnabled(res.enabled);
      setShowPasswordPrompt(false);
      setCurrentPassword("");
    } catch (err) {
      setError(err.message || "Incorrect password");
    } finally {
      setToggling2FA(false);
    }
  };

  return (
    <div
      className={[
        "min-h-full",
        isAndroidApp
          ? "bg-gradient-to-b from-blue-50 via-white to-white px-4 pb-28 pt-5"
          : "bg-slate-50 px-4 py-5 sm:px-6 lg:px-8 lg:py-7",
      ].join(" ")}
    >
      <main className="mx-auto max-w-5xl space-y-5">
        {/* Header */}
        <div
          className={[
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

            <div className="relative flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[1.35rem] bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <ShieldIcon className="h-7 w-7" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-500">
                  Security
                </p>

                <h1
                  className={[
                    "mt-2 font-bold tracking-tight text-slate-950",
                    isAndroidApp ? "text-3xl" : "text-2xl sm:text-3xl",
                  ].join(" ")}
                >
                  Security & Privacy
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Manage how you sign in, where you’re logged in, and how your account stays protected.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Existing backend-connected cards */}
        <div className="security-card-shell">
          <ChangePasswordCard />
        </div>

        {/* Email 2FA */}
        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <KeyIcon />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Email Two-Factor Authentication
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Add an extra layer of security by requiring a one-time code sent to your email when you log in.
                </p>

                <div className="mt-3">
                  <span
                    className={[
                      "inline-flex rounded-full px-3 py-1 text-xs font-bold",
                      email2FAEnabled
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    {email2FAEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleToggle2FA}
              disabled={toggling2FA}
              className={[
                "rounded-2xl px-5 py-3 text-sm font-bold shadow-sm transition active:scale-95 disabled:opacity-50",
                email2FAEnabled
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-blue-600 text-white hover:bg-blue-700",
              ].join(" ")}
            >
              {toggling2FA
                ? "Updating..."
                : email2FAEnabled
                ? "Disable"
                : "Enable"}
            </button>
          </div>
        </section>

        {/* Password prompt */}
        {showPasswordPrompt && (
          <section className="rounded-[2rem] border border-red-100 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-bold text-red-600">
              Confirm disable 2FA
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Enter your password to disable email two-factor authentication.
            </p>

            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50"
            />

            {error && (
              <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={confirmDisable2FA}
                disabled={toggling2FA}
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 active:scale-95 disabled:opacity-50"
              >
                {toggling2FA ? "Disabling..." : "Confirm disable"}
              </button>

              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setCurrentPassword("");
                  setError("");
                }}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </section>
        )}

        <div className="security-card-shell">
          <ActiveSessionsCard
            sessions={formattedSessions}
            onLogoutDevice={logoutDevice}
          />
        </div>

        <div className="security-card-shell">
          <LogoutEverywhereCard onLogout={logoutOthers} />
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-xs text-slate-400 shadow-sm">
          Last security review:{" "}
          <span className="font-bold text-slate-500">Just now</span>
        </div>

        {isAndroidApp && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 px-4 pb-4 pt-3 shadow-[0_-16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
              <BottomNavItem to="/dashboard" label="Home" icon={<HomeIcon />} />
              <BottomNavItem to="/files" label="Files" icon={<FolderIcon />} />
              <BottomNavItem to="/vault" label="Vault" icon={<VaultIcon />} />
              <BottomNavItem to="/account" label="Account" active icon={<UserIcon />} />
            </div>
          </div>
        )}
      </main>
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