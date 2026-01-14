import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FEATURES } from "../config/features";
import { subscribeUploads, getActiveCount } from "../utils/uploadManager";

export default function Navbar({ onMenu }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={onMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <Link
            to={user ? "/dashboard" : "/"}
            className="text-base font-semibold tracking-tight text-gray-900"
          >
            CloudBox Pro
          </Link>

          {activeUploads > 0 && (
            <span className="ml-2 flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Uploading
            </span>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/upgrade"
                className="hidden sm:inline text-sm text-gray-600 hover:text-gray-900 transition"
              >
                Upgrade
              </Link>

              {/* PROFILE */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white flex items-center justify-center text-sm font-semibold shadow-sm hover:shadow transition"
                >
                  {user?.email?.[0]?.toUpperCase() || "•"}
                </button>

                {profileOpen && (
                  <div
                    onClick={() => setProfileOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                )}

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-[fadeIn_0.12s_ease-out]">

                    <div className="px-4 py-3 border-b bg-gray-50">
                      <p className="text-sm font-medium text-gray-900 truncate flex items-center gap-1">
  {user?.email}
  <span className="text-xs text-green-600 font-medium">✔ Verified</span>
</p>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Secure CloudBox account
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/account");
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition"
                    >
                      Account
                    </button>

                    {FEATURES.SECURITY_PAGE ? (
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/settings/security");
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition"
                      >
                        Security
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-400"
                      >
                        Security
                      </button>
                    )}

                    <div className="border-t">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                      >
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
