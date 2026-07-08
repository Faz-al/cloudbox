import { logoutEverywhere } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LogoutIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H3m0 0l4-4m-4 4l4 4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 4h8a2 2 0 012 2v12a2 2 0 01-2 2H9" />
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
    <div className="rounded-[2rem] border border-red-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="rounded-[1.5rem] border border-red-100 bg-red-50 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-red-600 shadow-sm">
              <AlertIcon />
            </div>

            <div>
              <h2 className="text-lg font-bold text-red-700">
                Logout from all devices
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-red-600/80">
                This will immediately sign you out from every device, including this one.
              </p>
            </div>
          </div>

          <button
            onClick={handleLogoutAll}
            disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogoutIcon className="h-4 w-4" />
            {loading ? "Logging out..." : "Logout everywhere"}
          </button>
        </div>
      </div>
    </div>
  );
}