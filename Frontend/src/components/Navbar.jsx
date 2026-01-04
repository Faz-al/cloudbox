import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="font-semibold text-lg text-blue-600 tracking-tight"
          onClick={() => setOpen(false)}
        >
          CloudBox
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm">

          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
            Home
          </Link>

          {user && (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/files"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Files
              </Link>
              <Link
                to="/upgrade"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Upgrade
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 transition"
            >
              Logout
            </button>
          )}

        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700 text-xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 flex flex-col gap-3 text-sm">

            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="py-2 text-gray-700"
            >
              Home
            </Link>

            {user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="py-2 text-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  to="/files"
                  onClick={() => setOpen(false)}
                  className="py-2 text-gray-700"
                >
                  Files
                </Link>
                <Link
                  to="/upgrade"
                  onClick={() => setOpen(false)}
                  className="py-2 text-gray-700"
                >
                  Upgrade
                </Link>
              </>
            )}

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="py-2 text-gray-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="mt-2 bg-blue-600 text-white py-2.5 rounded-xl text-center font-medium"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="py-2 text-left text-red-500"
              >
                Logout
              </button>
            )}

          </div>
        </div>
      )}
    </header>
  );
}
