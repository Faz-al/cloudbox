import { NavLink } from "react-router-dom";

export default function Sidebar({ onAllFiles }) {

  const base =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm hover:bg-gray-100";
  const active = "bg-blue-50 text-blue-600 font-medium";

  return (
    <aside className="w-56 shrink-0 border-r bg-white hidden md:block">
      <div className="p-4 space-y-1">
        
        <button
            onClick={onAllFiles}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 w-full text-left"
        >
            📁 All Files
        </button>



        <NavLink
          to="/files?type=image"
          className={({ isActive }) =>
            `${base} ${isActive ? active : "text-gray-700"}`
          }
        >
          🖼 Images
        </NavLink>

        <NavLink
          to="/files?type=video"
          className={({ isActive }) =>
            `${base} ${isActive ? active : "text-gray-700"}`
          }
        >
          🎥 Videos
        </NavLink>

        <NavLink
          to="/files?type=document"
          className={({ isActive }) =>
            `${base} ${isActive ? active : "text-gray-700"}`
          }
        >
          📄 Documents
        </NavLink>
      </div>
    </aside>
  );
}
