import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar({
  onAllFiles,
  onTrash,
  onVault,
  forceOpen = false,
}) {
  const { pathname, search } = useLocation();

  const isDashboard = pathname === "/dashboard";
  const isAll = pathname === "/files" && !search;
  const isVault = pathname === "/vault";
  const isTrash = pathname === "/trash";

  const isImage = pathname === "/files" && search === "?type=image";
  const isVideo = pathname === "/files" && search === "?type=video";
  const isDocument = pathname === "/files" && search === "?type=document";

  return (
    <aside
      className={`w-full shrink-0 bg-white flex-col ${
        forceOpen ? "flex" : "hidden md:flex"
      }`}
    >
      {/* Workspace */}
      <div className="px-4 pb-4 pt-5">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 px-4 py-4 shadow-sm">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-200/30 blur-2xl" />

          <div className="relative flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <ShieldIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
                Workspace
              </p>
              <p className="mt-1 truncate text-sm font-bold text-slate-950">
                File manager
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary */}
      <nav className="px-3">
        <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Manage
        </p>

        <div className="space-y-1.5">
          <SidebarLink
            to="/dashboard"
            active={isDashboard}
            icon={<DashboardIcon />}
            tone="blue"
          >
            Dashboard
          </SidebarLink>

          <SidebarLink
            to="/files"
            active={isAll}
            icon={<AllFilesIcon />}
            tone="sky"
          >
            All files
          </SidebarLink>

          <SidebarLink
            to="/vault"
            active={isVault}
            icon={<VaultIcon />}
            tone="indigo"
          >
            Private Vault
          </SidebarLink>

          <SidebarLink
            to="/trash"
            active={isTrash}
            icon={<TrashIcon />}
            tone="rose"
          >
            Trash
          </SidebarLink>
        </div>
      </nav>

      <div className="mx-5 my-5 border-t border-slate-100" />

      {/* Filters */}
      <nav className="px-3">
        <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          File types
        </p>

        <div className="space-y-1.5">
          <SidebarLink
            to="/files?type=image"
            active={isImage}
            icon={<ImageIcon />}
            tone="emerald"
          >
            Images
          </SidebarLink>

          <SidebarLink
            to="/files?type=video"
            active={isVideo}
            icon={<VideoIcon />}
            tone="violet"
          >
            Videos
          </SidebarLink>

          <SidebarLink
            to="/files?type=document"
            active={isDocument}
            icon={<DocumentIcon />}
            tone="amber"
          >
            Documents
          </SidebarLink>
        </div>
      </nav>

      <div className="flex-1" />

      {/* Bottom note */}
      <div className="px-4 pb-5 pt-6">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-950 px-4 py-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/25 blur-2xl" />
          <div className="absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-sky-400/15 blur-2xl" />

          <div className="relative flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-blue-200 ring-1 ring-white/10">
              <ShieldIcon className="h-4 w-4" />
            </div>

            <p className="text-sm font-bold">Protected storage</p>
          </div>

          <p className="relative mt-3 text-xs leading-5 text-slate-300">
            Your files are organized securely across your SafeVault workspace.
          </p>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ to, active, icon, children, tone = "blue" }) {
  const tones = {
    blue: {
      active: "bg-blue-50 text-blue-700",
      iconActive: "border-blue-100 bg-blue-600 text-white shadow-blue-600/20",
      iconIdle: "border-blue-100 bg-blue-50 text-blue-600",
      dot: "bg-blue-600",
    },
    sky: {
      active: "bg-sky-50 text-sky-700",
      iconActive: "border-sky-100 bg-sky-500 text-white shadow-sky-500/20",
      iconIdle: "border-sky-100 bg-sky-50 text-sky-600",
      dot: "bg-sky-500",
    },
    indigo: {
      active: "bg-indigo-50 text-indigo-700",
      iconActive: "border-indigo-100 bg-indigo-600 text-white shadow-indigo-600/20",
      iconIdle: "border-indigo-100 bg-indigo-50 text-indigo-600",
      dot: "bg-indigo-600",
    },
    rose: {
      active: "bg-rose-50 text-rose-700",
      iconActive: "border-rose-100 bg-rose-500 text-white shadow-rose-500/20",
      iconIdle: "border-rose-100 bg-rose-50 text-rose-600",
      dot: "bg-rose-500",
    },
    emerald: {
      active: "bg-emerald-50 text-emerald-700",
      iconActive:
        "border-emerald-100 bg-emerald-500 text-white shadow-emerald-500/20",
      iconIdle: "border-emerald-100 bg-emerald-50 text-emerald-600",
      dot: "bg-emerald-500",
    },
    violet: {
      active: "bg-violet-50 text-violet-700",
      iconActive:
        "border-violet-100 bg-violet-500 text-white shadow-violet-500/20",
      iconIdle: "border-violet-100 bg-violet-50 text-violet-600",
      dot: "bg-violet-500",
    },
    amber: {
      active: "bg-amber-50 text-amber-700",
      iconActive: "border-amber-100 bg-amber-500 text-white shadow-amber-500/20",
      iconIdle: "border-amber-100 bg-amber-50 text-amber-600",
      dot: "bg-amber-500",
    },
  };

  const current = tones[tone] || tones.blue;

  return (
    <NavLink
      to={to}
      className={[
        "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition active:scale-[0.99]",
        active
          ? current.active
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-9 w-9 shrink-0 place-items-center rounded-2xl border transition",
          active
            ? `${current.iconActive} shadow-lg`
            : `${current.iconIdle} group-hover:bg-white`,
        ].join(" ")}
      >
        {icon}
      </span>

      <span className="truncate">{children}</span>

      {active && (
        <span className={["ml-auto h-2 w-2 rounded-full", current.dot].join(" ")} />
      )}
    </NavLink>
  );
}

/* ===== Premium inline SVG icons, no dependencies ===== */

function DashboardIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M4 5.5A1.5 1.5 0 015.5 4h4A1.5 1.5 0 0111 5.5v4A1.5 1.5 0 019.5 11h-4A1.5 1.5 0 014 9.5v-4z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M13 5.5A1.5 1.5 0 0114.5 4h4A1.5 1.5 0 0120 5.5v2A1.5 1.5 0 0118.5 9h-4A1.5 1.5 0 0113 7.5v-2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M13 13.5A1.5 1.5 0 0114.5 12h4a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M4 15.5A1.5 1.5 0 015.5 14h4a1.5 1.5 0 011.5 1.5v3A1.5 1.5 0 019.5 20h-4A1.5 1.5 0 014 18.5v-3z"
      />
    </svg>
  );
}

function AllFilesIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M3.8 7.5A2.5 2.5 0 016.3 5h3.4l2 2H18a2.5 2.5 0 012.5 2.5v7A2.5 2.5 0 0118 19H6.3a2.5 2.5 0 01-2.5-2.5v-9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M4 10h16"
      />
    </svg>
  );
}

function VaultIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M7 10.5V8a5 5 0 0110 0v2.5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M6 10.5h12a2 2 0 012 2V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-6.5a2 2 0 012-2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M12 15v2"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M6 7h12"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M9 7V5.8A1.8 1.8 0 0110.8 4h2.4A1.8 1.8 0 0115 5.8V7"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M8 7l.8 12A2 2 0 0010.8 21h2.4a2 2 0 002-1.9L16 7"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M10.5 11v5M13.5 11v5"
      />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2.4"
        strokeWidth="1.9"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M7.5 15l3-3 3 3 2-2 3 3"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
        d="M8.2 9.2h.01"
      />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect
        x="4"
        y="6"
        width="13"
        height="12"
        rx="2.2"
        strokeWidth="1.9"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M17 10l3-2v8l-3-2"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M8 10h4M8 14h3"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M7 3.8h7l4 4V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5.8a2 2 0 012-2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M14 4v5h5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M8.5 13h7M8.5 16.5h5"
      />
    </svg>
  );
}

function ShieldIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        d="M9 12l2 2 4-4"
      />
    </svg>
  );
}