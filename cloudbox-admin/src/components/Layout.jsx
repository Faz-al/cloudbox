import { useEffect, useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { getMe } from "../api/admin";

export default function Layout() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then(() => setLoading(false)).catch(() => nav("/login"));
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#f6f9fc] text-slate-500 text-sm">
        Loading Admin…
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f6f9fc] flex">

      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col">

        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="text-lg font-semibold tracking-tight text-slate-900">
            CloudBox Admin
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 text-[14px]">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 ${
                isActive
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 ${
                isActive
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            Users
          </NavLink>

          <NavLink
            to="/files"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 ${
                isActive
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            Files
          </NavLink>


           <NavLink
  to="/activity"
  className={({ isActive }) =>
    `block rounded-lg px-4 py-2 ${
      isActive
        ? "bg-slate-100 text-slate-900 font-medium"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`
  }
>
  Activity
</NavLink>

<NavLink
  to="/dmca"
  className={({ isActive }) =>
    `block rounded-lg px-4 py-2 ${
      isActive
        ? "bg-slate-100 text-slate-900 font-medium"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`
  }
>
  DMCA
</NavLink>







        </nav>


       







        <div className="p-4 border-t border-slate-200 text-xs text-slate-400">
          Internal admin panel
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="relative">
            <input
              placeholder="Search users, files…"
              className="w-[280px] rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
              A
            </div>
          </div>
        </div>

        {/* Page container */}
        <main className="flex-1 p-10">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
