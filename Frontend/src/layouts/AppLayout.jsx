import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ScrollToTop from "../components/ScrollToTop";
import { Capacitor } from "@capacitor/core";


export default function AppLayout() {
const { user } = useAuth();
const [mobileNav, setMobileNav] = useState(false);

const location = useLocation();

useEffect(() => {
  setMobileNav(false);
}, [location.pathname, location.search]);


const isAuthPage =
  location.pathname === "/login" ||
  location.pathname === "/signup" ||
  location.pathname === "/forgot-password";



useEffect(() => {
  if (Capacitor.getPlatform() !== "android") return;

  const updateStatusBar = async () => {
    try {
      const { StatusBar } = await import("@capacitor/status-bar");

      if (isAuthPage) {
        await StatusBar.setStyle({ style: "DARK" });
        await StatusBar.setBackgroundColor({ color: "#0f172a" });
      } else {
        await StatusBar.setStyle({ style: "LIGHT" });
        await StatusBar.setBackgroundColor({ color: "#ffffff" });
      }
    } catch (err) {
      console.warn("StatusBar not available");
    }
  };

  updateStatusBar();
}, [isAuthPage]);







  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-safe">

      <ScrollToTop />

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
  <div className="fixed inset-0 z-50 md:hidden flex">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/30"
      onClick={() => setMobileNav(false)}
    />

    {/* Sidebar panel */}
    <div className="relative w-72 bg-white shadow-xl">
      <Sidebar forceOpen />
    </div>
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
