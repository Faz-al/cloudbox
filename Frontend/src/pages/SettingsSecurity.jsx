import { useState } from "react";
import ChangePasswordCard from "../components/security/ChangePasswordCard";
import ActiveSessionsCard from "../components/security/ActiveSessionsCard";
import LogoutEverywhereCard from "../components/security/LogoutEverywhereCard";

export default function SettingsSecurity() {
  const [sessions] = useState([
    {
      id: "1",
      device: "Chrome on Windows",
      ip: "103.xxx.xxx.xxx",
      location: "Bengaluru, India",
      lastActive: "2 minutes ago",
      isCurrent: true,
    },
    {
      id: "2",
      device: "Safari on iPhone",
      ip: "172.xxx.xxx.xxx",
      location: "Unknown",
      lastActive: "Yesterday",
      isCurrent: false,
    },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Security & Privacy
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Manage how you sign in, where you’re logged in, and how your account
          stays protected.
        </p>
      </div>

      {/* Password */}
      <ChangePasswordCard />

      {/* Sessions */}
      <ActiveSessionsCard sessions={sessions} />

      {/* Danger zone */}
      <LogoutEverywhereCard />

      {/* Footer note */}
      <div className="text-xs text-gray-400 pt-6 border-t">
        Last security review: <span className="font-medium">Just now</span>
      </div>
    </div>
  );
}
