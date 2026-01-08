import { useEffect, useRef, useState } from "react";
import { API_BASE } from "../utils/api";

export default function FileGridItem({
  file,
  selected,
  onSelect,
  onPreview,
  onOpenFolder,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);
  const longPressRef = useRef(null);
  const [longPressed, setLongPressed] = useState(false);


  const isImage = file.type?.startsWith("image");
  const isVideo = file.type?.startsWith("video");
  const isPdf = file.type?.includes("pdf");
  const isZip =
    file.type?.includes("zip") || file.type?.includes("rar");

  /* Close menu */
  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  /* Long press (mobile) */
  const startPress = (e) => {
  setLongPressed(false);
  longPressRef.current = setTimeout(() => {
    setLongPressed(true);
    setMenuPosition({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
    setMenuOpen(true);
  }, 500);
};


  const cancelPress = () => {
    clearTimeout(longPressRef.current);
  };

  const openContext = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
  };

  return (
    <div
  className={`group relative w-full rounded-xl border bg-white cursor-pointer transition
    aspect-[4/3] sm:aspect-square hover:shadow-sm
    ${selected ? "ring-2 ring-blue-500" : ""}`}

      onClick={() => {
  if (longPressed) return;
  file.isFolder ? onOpenFolder(file._id) : onPreview(file);
}}

      onContextMenu={openContext}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
    >
      {/* Selection checkbox */}
      <div
  className="absolute top-2 left-2 z-10
             opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
  onClick={(e) => {
    e.stopPropagation();
    onSelect();
  }}
  onTouchStart={(e) => {
    e.stopPropagation();
    onSelect();
  }}
>
  <input type="checkbox" checked={selected} readOnly />
</div>


      {/* CONTENT */}
      {file.isFolder ? (
        <Center><FolderIcon /></Center>
      ) : isImage ? (
        <img
          src={`${API_BASE}/files/${file._id}/preview`}
          alt={file.name}
          className="object-cover w-full h-full"
        />
      ) : isVideo ? (
        <Center><VideoIcon /></Center>
      ) : isPdf ? (
        <Center><PdfIcon /></Center>
      ) : isZip ? (
        <Center><ZipIcon /></Center>
      ) : (
        <Center><FileIcon /></Center>
      )}

      {/* NAME */}
      <div className="absolute bottom-0 inset-x-0 bg-white/90 px-2 py-0.5 text-[11px] sm:text-xs truncate">
        {file.name}
      </div>

      {/* CONTEXT MENU */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed z-[9999] bg-white border rounded-lg shadow-lg text-sm w-40"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <MenuItem onClick={() => onPreview(file)}>Preview</MenuItem>
          <MenuItem
            onClick={() =>
              window.open(
                `${API_BASE}/files/download/${file._id}`,
                "_blank"
              )
            }
          >
            Download
          </MenuItem>
        </div>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */

const Center = ({ children }) => (
  <div className="flex items-center justify-center h-full">
    {children}
  </div>
);

const MenuItem = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
  >
    {children}
  </button>
);

/* ---------- icons ---------- */

const FolderIcon = () => <Icon color="text-blue-600" />;
const FileIcon = () => <Icon />;
const PdfIcon = () => <Icon label="PDF" color="text-red-600" />;
const ZipIcon = () => <Icon label="ZIP" color="text-yellow-600" />;
const VideoIcon = () => <Icon label="▶" color="text-purple-600" />;

function Icon({ label, color = "text-gray-400" }) {
  return (
    <div className={`w-10 h-10 flex items-center justify-center font-semibold ${color}`}>
      {label || "FILE"}
    </div>
  );
}
