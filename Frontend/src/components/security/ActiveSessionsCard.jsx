import { useState } from "react";

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
    window.location.reload(); // refresh sessions
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">
          Active sessions
        </h2>
        <p className="text-sm text-gray-500 mt-1 max-w-lg">
          These are the devices currently signed in to your SafeVault account.
        </p>
      </div>

      {/* Sessions list */}
      <div className="divide-y">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="py-4 flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{session.device}</span>

                {session.isCurrent && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    This device
                  </span>
                )}

                {session.isSuspicious && (
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    Suspicious
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {session.location || "Unknown"} • IP {session.ip}
              </div>

              <div className="text-xs text-gray-400">
                Last active {session.lastActive}
              </div>
            </div>

            {!session.isCurrent && (
              <button
                onClick={() => onLogoutDevice(session.id)}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Sign out
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Logout others */}
      <div className="pt-6 mt-6 border-t">
        <button
          onClick={logoutOthers}
          disabled={loading}
          className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
        >
          {loading ? "Signing out…" : "Log out all other devices"}
        </button>
        <p className="text-xs text-gray-500 mt-1">
          You will stay signed in on this device.
        </p>
      </div>
    </div>
  );
}
