import { useState } from "react";

function DeviceIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="4" y="5" width="16" height="12" rx="2" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 21h8M12 17v4" />
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

function AlertIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.3 4.6L2.6 18a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 4.6a2 2 0 00-3.4 0z" />
    </svg>
  );
}

function LogoutIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H3m0 0l4-4m-4 4l4 4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 4h8a2 2 0 012 2v12a2 2 0 01-2 2H9" />
    </svg>
  );
}

export default function ActiveSessionsCard({ sessions, onLogoutDevice }) {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [loading, setLoading] = useState(false);

  const logoutOthers = async () => {
    setLoading(true);

    await fetch(`${API}/api/auth/security/logout-others`, {
      method: "POST",
      credentials: "include",
    });

    setLoading(false);
    window.location.reload();
  };

  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-700">
            <DeviceIcon />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">
              Active sessions
            </h2>

            <p className="mt-1 max-w-lg text-sm leading-6 text-slate-500">
              These are the devices currently signed in to your SafeVault account.
            </p>
          </div>
        </div>

        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
          {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
        </span>
      </div>

      {/* Sessions list */}
      {sessions.length === 0 ? (
        <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 px-5 py-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-400 shadow-sm">
            <DeviceIcon />
          </div>

          <p className="mt-4 text-sm font-bold text-slate-950">
            No active sessions found
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Your signed-in devices will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={[
                "rounded-[1.5rem] border p-4 transition",
                session.isSuspicious
                  ? "border-red-100 bg-red-50/40"
                  : session.isCurrent
                  ? "border-emerald-100 bg-emerald-50/40"
                  : "border-slate-100 bg-slate-50/60 hover:bg-slate-50",
              ].join(" ")}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={[
                      "grid h-11 w-11 shrink-0 place-items-center rounded-2xl border bg-white shadow-sm",
                      session.isSuspicious
                        ? "border-red-100 text-red-600"
                        : session.isCurrent
                        ? "border-emerald-100 text-emerald-600"
                        : "border-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    {session.isSuspicious ? <AlertIcon /> : <DeviceIcon />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-bold text-slate-950">
                        {session.device}
                      </p>

                      {session.isCurrent && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                          This device
                        </span>
                      )}

                      {session.isSuspicious && (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700">
                          Suspicious
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {session.location || "Unknown location"} · IP {session.ip}
                    </p>

                    <p className="text-xs leading-5 text-slate-400">
                      Last active {session.lastActive}
                    </p>
                  </div>
                </div>

                {!session.isCurrent && (
                  <button
                    onClick={() => onLogoutDevice(session.id)}
                    className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white px-4 py-2.5 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-50 active:scale-95"
                  >
                    <LogoutIcon />
                    Sign out
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logout others */}
      <div className="mt-6 rounded-[1.5rem] border border-amber-100 bg-amber-50 px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-amber-600 shadow-sm">
              <ShieldIcon className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-bold text-amber-800">
                Sign out from other devices
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700/80">
                You will stay signed in on this device.
              </p>
            </div>
          </div>

          <button
            onClick={logoutOthers}
            disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 active:scale-95 disabled:opacity-50"
          >
            <LogoutIcon />
            {loading ? "Signing out…" : "Log out others"}
          </button>
        </div>
      </div>
    </div>
  );
}