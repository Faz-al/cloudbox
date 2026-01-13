import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";


export default function AppLayout() {
const { user } = useAuth();
const [mobileNav, setMobileNav] = useState(false);

const location = useLocation();
const isAuthPage =
  location.pathname === "/login" ||
  location.pathname === "/signup" ||
  location.pathname === "/forgot-password";



  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Top App Bar */}
{/* Top App Bar */}
{!isAuthPage && <Navbar onMenu={() => setMobileNav(true)} />}

      {/* App Body */}
      {/* App Body */}
<div className="flex flex-1 overflow-hidden">

  {user ? (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Slide-in Sidebar */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 bg-black/30 md:hidden">
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
            <Sidebar forceOpen />
          </div>
          <div
            className="absolute inset-0"
            onClick={() => setMobileNav(false)}
          />
        </div>
      )}
    </>
  ) : null}

  {/* Main Content Surface */}
  <main className="flex-1 overflow-y-auto">
    <Outlet />
  </main>

</div>


      <Footer />
    </div>
  );
}
