import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FEATURES } from "../config/features";


import { subscribeUploads, getActiveCount } from "../utils/uploadManager";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    setOpen(false);
    navigate("/");
  };

  const [activeUploads, setActiveUploads] = useState(0);

useEffect(() => {
  return subscribeUploads(() => {
    setActiveUploads(getActiveCount());
  });
}, []);


  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={user ? "/dashboard" : "/"}
          className="font-semibold text-lg text-blue-600 tracking-tight"
          onClick={() => {
            setOpen(false);
            setProfileOpen(false);
          }}
        >
          CloudBox
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {!user ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium"
              >
                Sign Up
              </Link>
            </>

          ) : (
            <>
              <Link to="/files" className="text-gray-700 hover:text-blue-600">
                Files
              </Link>
              <Link to="/upgrade" className="text-gray-700 hover:text-blue-600">
                Upgrade
              </Link>

              {activeUploads > 0 && (
  <div className="relative">
    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full absolute -top-1 -right-1" />
  </div>
)}


              {/* Profile */}
              <div className="relative">
                <button
  onClick={() => setProfileOpen(!profileOpen)}
  className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold hover:opacity-90"
  title="Account"
>
  {user?.email?.[0]?.toUpperCase() || "•"}
</button>





                {profileOpen && (
  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
    
    {/* Email */}
    <div className="px-4 py-3 border-b">
      <p className="text-sm font-medium text-gray-900">
        {user?.email}
      </p>
    </div>

    {/* Future links */}
    <button
        onClick={() => {
          setProfileOpen(false);
         navigate("/account");
       }}
         className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
    >
          Account settings
      </button>


    {FEATURES.SECURITY_PAGE ? (
  <button
    onClick={() => {
      setProfileOpen(false);
      navigate("/settings/security");
    }}
    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
  >
    Security
  </button>
) : (
  <button
    disabled
    className="w-full text-left px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed"
  >
    Security
  </button>
)}


    {/* Logout */}
    <button
      onClick={handleLogout}
      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50"
    >
      Logout
    </button>
  </div>
)}

              </div>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 text-xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 flex flex-col gap-3 text-sm">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="bg-blue-600 text-white py-2.5 rounded-xl text-center"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/files" onClick={() => setOpen(false)}>
                  Files
                </Link>
                <Link to="/upgrade" onClick={() => setOpen(false)}>
                  Upgrade
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-500"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
