import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { user } = useAuth();
  const [mobileNav, setMobileNav] = useState(false);

  const location = useLocation();

  const isAndroidApp = Capacitor.getPlatform() === "android";

  useEffect(() => {
    setMobileNav(false);
  }, [location.pathname, location.search]);

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password");

  const isWebsitePublicPage =
    location.pathname === "/" ||
    location.pathname === "/privacy" ||
    location.pathname === "/terms" ||
    location.pathname === "/dmca" ||
    location.pathname === "/contact";

const showTopNavbar = !isAndroidApp;

const showDesktopSidebar =
  user && !isAuthPage && !isWebsitePublicPage && !isAndroidApp;

const showMobileSidebar =
  user && !isAuthPage && !isWebsitePublicPage && mobileNav && !isAndroidApp;

const showFooter = !isAndroidApp && !isAuthPage;

  useEffect(() => {
    if (!isAndroidApp) return;

    const updateStatusBar = async () => {
      try {
        const { StatusBar } = await import("@capacitor/status-bar");

        await StatusBar.setStyle({ style: "LIGHT" });
await StatusBar.setBackgroundColor({ color: "#ffffff" });
      } catch (err) {
        console.warn("StatusBar not available", err);
      }
    };

    updateStatusBar();
  }, [isAndroidApp, isAuthPage]);

  return (
    <div
      className={[
        "min-h-screen text-slate-950 pt-safe",
        isAndroidApp ? "bg-white" : "bg-slate-50",
      ].join(" ")}
    >
      <ScrollToTop />

      {!isAndroidApp && (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.10),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.10),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)]" />
      )}

      {/* Website top navbar only. Android app should not feel like a website. */}
      {showTopNavbar && <Navbar onMenu={() => setMobileNav(true)} />}

      <div
        className={[
          "flex min-h-screen",
          showTopNavbar ? "pt-16 md:pt-20" : "",
          isAndroidApp ? "bg-white" : "",
        ].join(" ")}
      >
        {showDesktopSidebar && (
          <aside className="hidden md:fixed md:left-0 md:top-20 md:z-30 md:block md:h-[calc(100vh-5rem)] md:w-72 md:px-4 md:pb-4">
            <div className="h-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <Sidebar />
            </div>
          </aside>
        )}

        {showMobileSidebar && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
              onClick={() => setMobileNav(false)}
            />

            <div className="relative flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
                    SafeVault
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Secure cloud storage
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileNav(false)}
                  className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 active:scale-95"
                  aria-label="Close menu"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-3">
                <Sidebar forceOpen />
              </div>
            </div>
          </div>
        )}

        <main
          className={[
            "flex min-w-0 flex-1 flex-col",
            showDesktopSidebar ? "md:pl-72" : "",
          ].join(" ")}
        >
          <div
            className={[
              "flex flex-1 flex-col",
              isAndroidApp
                ? "min-h-screen bg-white"
                : "min-h-[calc(100vh-4rem)]",
              !isAuthPage && !isAndroidApp
                ? "px-3 pb-4 sm:px-5 md:px-6 md:pb-6"
                : "",
              isAuthPage && !isAndroidApp ? "" : "",
            ].join(" ")}
          >
            <div
              className={[
                "flex-1",
                !isAuthPage && !isAndroidApp
                  ? "rounded-[1.75rem] border border-white/80 bg-white/75 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl"
                  : "",
                isAndroidApp ? "min-h-screen bg-white" : "",
              ].join(" ")}
            >
              <Outlet />
            </div>
          </div>

         {showFooter && <Footer />}
        </main>
      </div>
    </div>
  );
}