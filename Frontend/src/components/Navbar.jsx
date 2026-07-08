import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { FEATURES } from "../config/features";
import { subscribeUploads, getActiveCount } from "../utils/uploadManager";
import SafeVaultLogo from "../assets/logo/safevault-logo.svg";

function MenuIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeWidth="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

function ShieldIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 16V8m0 0l-3 3m3-3l3 3M4 16.5A4.5 4.5 0 018.5 12H9a6 6 0 1111 3.5"
      />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 16l2-9 5 5 5-5 2 9H5z"
      />
    </svg>
  );
}

function ChevronDownIcon({ open }) {
  return (
    <svg
      className={[
        "hidden h-4 w-4 text-slate-500 transition sm:block",
        open ? "rotate-180" : "",
      ].join(" ")}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      className="h-[17px] w-[17px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      className="h-[17px] w-[17px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V20h-3v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1L4.6 16.6l.1-.1A1.7 1.7 0 005 14.6a1.7 1.7 0 00-1.6-1H3v-3h.4A1.7 1.7 0 005 9a1.7 1.7 0 00-.3-1.9l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 001.9.3 1.7 1.7 0 001-1.6V3h3v.1a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1 2.1 2.1-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.6 1h.4v3h-.4a1.7 1.7 0 00-1.6 1z"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      className="h-[17px] w-[17px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 12H3m0 0l4-4m-4 4l4 4M21 4v16"
      />
    </svg>
  );
}

export default function Navbar({ onMenu }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const dropdownRef = useRef(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [activeUploads, setActiveUploads] = useState(0);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate("/");
  };

  useEffect(() => {
    return subscribeUploads(() => {
      setActiveUploads(getActiveCount());
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current) return;

      if (!dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-2xl">
<div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-3 sm:px-5 md:h-20 md:px-6">        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          {user && (
            <button
              type="button"
              onClick={onMenu}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 md:hidden"
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
          )}

       <Link
  to={user ? "/dashboard" : "/"}
  className="group flex shrink-0 items-center transition active:scale-[0.99]"
  aria-label="Go to SafeVault home"
>
 <img
  src={SafeVaultLogo}
  alt="SafeVault"
  className="mt-5 block w-[150px] max-w-none object-contain sm:w-[190px] md:w-[170px]"
/>
</Link>

          {activeUploads > 0 && (
            <span className="hidden items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm sm:inline-flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
              </span>
              Uploading
            </span>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-[0_16px_40px_rgba(37,99,235,0.25)] active:translate-y-0"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              {activeUploads > 0 && (
                <span className="grid h-10 w-10 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 shadow-sm sm:hidden">
                  <UploadIcon />
                </span>
              )}

              <Link
                to="/upgrade"
                className="hidden items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-100 active:translate-y-0 sm:inline-flex"
              >
                <CrownIcon />
                Upgrade
              </Link>

              {/* PROFILE */}
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 pr-2 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-sm font-bold text-white shadow-sm">
                    {user?.email?.[0]?.toUpperCase() || "•"}
                  </span>

                  <ChevronDownIcon open={profileOpen} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
                    <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/60 px-4 py-4">
                      <div className="flex items-start gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-sm font-bold text-white shadow-sm">
                          {user?.email?.[0]?.toUpperCase() || "•"}
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-950">
                            {user?.email}
                          </p>

                          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                            <ShieldIcon className="h-3 w-3" />
                            Verified account
                          </div>

                          <p className="mt-2 text-xs leading-relaxed text-slate-500">
                            Secure SafeVault account with encrypted file access.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/account");
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600">
                          <UserIcon />
                        </span>
                        Account
                      </button>

                      {FEATURES.SECURITY_PAGE ? (
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            navigate("/settings/security");
                          }}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600">
                            <SettingsIcon />
                          </span>
                          Security
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="flex w-full cursor-not-allowed items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-slate-400"
                        >
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-400">
                            <SettingsIcon />
                          </span>
                          Security
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-100 p-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600">
                          <LogoutIcon />
                        </span>
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}