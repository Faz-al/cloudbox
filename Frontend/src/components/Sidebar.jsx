import { NavLink } from "react-router-dom";

export default function Sidebar({
  onAllFiles,
  onTrash,
  onVault,
  forceOpen = false,
}) {
  const baseItem =
    "group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors";

  const inactive =
    "text-gray-700 hover:bg-gray-100";

  const active =
    "bg-blue-50 text-blue-600 font-medium";

  return (
    <aside
  className={`w-60 shrink-0 border-r bg-white flex-col
    ${forceOpen ? "flex" : "hidden md:flex"}`}
>

      {/* Brand / Context */}
      <div className="px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          File manager
        </p>
      </div>

      {/* Primary */}
      <nav className="px-3 space-y-1">
        <SidebarButton onClick={onAllFiles} label="All files" icon={FolderIcon} />
        <SidebarButton onClick={onVault} label="Vault" icon={LockIcon} />
        <SidebarButton onClick={onTrash} label="Trash" icon={TrashIcon} />
      </nav>

      {/* Divider */}
      <div className="my-4 border-t mx-6" />

      {/* Filters */}
      <nav className="px-3 space-y-1">
        <NavLink
          to="/files?type=image"
          className={({ isActive }) =>
            `${baseItem} ${isActive ? active : inactive}`
          }
        >
          <ImageIcon />
          <span>Images</span>
        </NavLink>

        <NavLink
          to="/files?type=video"
          className={({ isActive }) =>
            `${baseItem} ${isActive ? active : inactive}`
          }
        >
          <VideoIcon />
          <span>Videos</span>
        </NavLink>

        <NavLink
          to="/files?type=document"
          className={({ isActive }) =>
            `${baseItem} ${isActive ? active : inactive}`
          }
        >
          <DocumentIcon />
          <span>Documents</span>
        </NavLink>
      </nav>

      {/* Footer space */}
      <div className="flex-1" />
    </aside>
  );
}

/* ===== Buttons ===== */

function SidebarButton({ onClick, label, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
    >
      <Icon />
      <span>{label}</span>
    </button>
  );
}

/* ===== Icons (inline, no deps) ===== */

function FolderIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="1.8" d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="1.8" d="M12 11V7a3 3 0 00-6 0v4m-2 0h10a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6a2 2 0 012-2z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="1.8" d="M6 7h12M9 7V5h6v2m-8 0l1 12h6l1-12" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="1.8" d="M4 5h16v14H4zM8 11l3-3 5 6" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="1.8" d="M4 6h12v12H4zM16 10l4-2v8l-4-2" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="1.8" d="M6 2h9l5 5v15H6z" />
    </svg>
  );
}
