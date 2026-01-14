import { useEffect, useState } from "react";
import ChangePasswordCard from "../components/security/ChangePasswordCard";
import ActiveSessionsCard from "../components/security/ActiveSessionsCard";
import LogoutEverywhereCard from "../components/security/LogoutEverywhereCard";
import { API_BASE } from "../utils/api";

export default function SettingsSecurity() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/auth/security/sessions`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setSessions);
  }, []); // ✅ FIXED

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Security & Privacy
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Manage how you sign in, where you’re logged in, and how your account
          stays protected.
        </p>
      </div>

      <ChangePasswordCard />

      <ActiveSessionsCard
        sessions={formattedSessions}
        onLogoutDevice={logoutDevice}
      />

      <LogoutEverywhereCard onLogout={logoutOthers} />

      <div className="text-xs text-gray-400 pt-6 border-t">
        Last security review: <span className="font-medium">Just now</span>
      </div>
    </div>
  );
}
