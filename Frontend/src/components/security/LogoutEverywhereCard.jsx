import { logoutEverywhere } from "../../utils/api";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LogoutEverywhereCard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogoutAll = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await logoutEverywhere();
      await logout();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
      <h2 className="text-lg font-medium text-red-700 mb-2">
        Logout from all devices
      </h2>

      <p className="text-sm text-red-600 mb-4">
        This will immediately sign you out from every device, including this one.
      </p>

      <button
        onClick={handleLogoutAll}
        disabled={loading}
        className="btn-danger disabled:opacity-50"
      >
        {loading ? "Logging out..." : "Logout everywhere"}
      </button>
    </div>
  );
}
