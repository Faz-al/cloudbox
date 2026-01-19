import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FEATURES } from "../config/features";
import { subscribeUploads, getActiveCount } from "../utils/uploadManager";
import SafeVaultLogo from "../assets/logo/safevault-logo.svg";







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
    <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-gray-50/70 backdrop-blur-xl">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={onMenu}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

     <Link
  to={user ? "/dashboard" : "/"}
  className="flex items-center hover:opacity-80 transition"
>
  <div className="flex items-center py-[6px]">
    <img
  src={SafeVaultLogo}
  alt="SafeVault"
  className="w-[200px] h-auto mt-[15px] -ml-[25px]"
/>

  </div>
</Link>











          {activeUploads > 0 && (
            <span className="flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
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
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl text-sm font-medium text-white
                           bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/upgrade"
                className="hidden sm:inline text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Upgrade
              </Link>

              {/* PROFILE */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 rounded-full
                             bg-gradient-to-br from-blue-600 to-blue-500
                             text-white text-sm font-semibold
                             flex items-center justify-center
                             shadow-sm hover:shadow-md transition"
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
                  <div className="absolute right-0 mt-3 w-64 rounded-2xl
                                  bg-white border border-gray-200/80
                                  shadow-[0_12px_40px_rgba(0,0,0,0.12)]
                                  z-50 overflow-hidden
                                  animate-[fadeIn_0.12s_ease-out]">

                    <div className="px-4 py-3 bg-gray-50 border-b">
                      <p className="text-sm font-medium text-gray-900 truncate flex items-center gap-1">
                        {user?.email}
                        <span className="text-xs text-green-600 font-medium">
                          ✔ Verified
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Secure SafeVault account
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/account");
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm
                                 hover:bg-gray-50 transition"
                    >
                      Account
                    </button>

                    {FEATURES.SECURITY_PAGE ? (
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/settings/security");
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm
                                   hover:bg-gray-50 transition"
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
                        className="w-full text-left px-4 py-2.5 text-sm
                                   text-red-600 hover:bg-red-50 transition"
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
