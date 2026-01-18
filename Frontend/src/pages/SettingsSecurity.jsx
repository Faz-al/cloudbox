import { useEffect, useState } from "react";
import ChangePasswordCard from "../components/security/ChangePasswordCard";
import ActiveSessionsCard from "../components/security/ActiveSessionsCard";
import LogoutEverywhereCard from "../components/security/LogoutEverywhereCard";
import { API_BASE, toggleEmail2FA, getMe } from "../utils/api";






export default function SettingsSecurity() {
  const [sessions, setSessions] = useState([]);
    const [email2FAEnabled, setEmail2FAEnabled] = useState(false);
const [toggling2FA, setToggling2FA] = useState(false);
const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [error, setError] = useState("");


  useEffect(() => {
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
  // 🔐 If disabling, ask for password first
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


        <div className="bg-white rounded-xl border p-6 space-y-4">
  <div>
    <h2 className="text-lg font-medium">
      Email Two-Factor Authentication
    </h2>
    <p className="text-sm text-gray-500 mt-1">
      Add an extra layer of security by requiring a one-time code sent to your email
      when you log in.
    </p>
  </div>

  <div className="flex items-center justify-between">
    <div className="text-sm">
      Status:{" "}
      <span
        className={`font-medium ${
          email2FAEnabled ? "text-green-600" : "text-gray-600"
        }`}
      >
        {email2FAEnabled ? "Enabled" : "Disabled"}
      </span>
    </div>

    <button
      onClick={handleToggle2FA}
      disabled={toggling2FA}
      className={`px-4 py-2 rounded-lg text-sm font-medium ${
        email2FAEnabled
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-blue-600 text-white hover:bg-blue-700"
      } disabled:opacity-50`}
    >
      {toggling2FA
        ? "Updating..."
        : email2FAEnabled
        ? "Disable"
        : "Enable"}
    </button>
  </div>
</div>




            {showPasswordPrompt && (
  <div className="bg-white border rounded-xl p-6 space-y-4">
    <h3 className="text-lg font-medium text-red-600">
      Confirm disable 2FA
    </h3>

    <p className="text-sm text-gray-500">
      Enter your password to disable email two-factor authentication.
    </p>

    <input
      type="password"
      placeholder="Current password"
      value={currentPassword}
      onChange={(e) => setCurrentPassword(e.target.value)}
      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
    />

    {error && (
      <div className="text-sm text-red-600">{error}</div>
    )}

    <div className="flex gap-3">
      <button
        onClick={confirmDisable2FA}
        disabled={toggling2FA}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
      >
        {toggling2FA ? "Disabling..." : "Confirm disable"}
      </button>

      <button
        onClick={() => {
          setShowPasswordPrompt(false);
          setCurrentPassword("");
          setError("");
        }}
        className="px-4 py-2 border rounded-lg"
      >
        Cancel
      </button>
    </div>
  </div>
)}















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
