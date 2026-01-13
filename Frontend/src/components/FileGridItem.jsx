import { useEffect, useRef, useState } from "react";
import { API_BASE } from "../utils/api";
import { vaultFile } from "../utils/api";

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
  const isZip = file.type?.includes("zip") || file.type?.includes("rar");

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

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

  const cancelPress = () => clearTimeout(longPressRef.current);

  const openContext = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
  };

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-xl border bg-white transition
        aspect-[4/3] sm:aspect-square hover:shadow-sm
        ${selected ? "ring-2 ring-blue-500" : ""}`}
      
      
      
       onClick={async () => {
  if (longPressed) return;

  // If any file is already selected, this click means "select", not "open"
  if (selected === false && window.__cloudboxSelectionActive) {
    onSelect();
    return;
  }

  try {
    if (!file.isFolder && file.isVaulted) {
      await vaultFile(file._id);
    }

    if (file.isFolder) {
      onOpenFolder(file._id);
    } else {
      onPreview(file);
    }
  } catch (e) {
    window.dispatchEvent(
      new CustomEvent("toast", {
        detail: {
          type: "error",
          message: e?.message || "Vault is locked",
        },
      })
    );
  }
}}



      onContextMenu={openContext}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
    >
      {/* Checkbox */}
      {/* Checkbox */}
<div
  className={`absolute top-2 left-2 z-10 bg-white/90 rounded-md p-1 transition
    ${selected
      ? "opacity-100"
      : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
    }`}
  onClick={(e) => {
    e.stopPropagation();
    onSelect();
  }}
>
  <input
    type="checkbox"
    checked={selected}
    readOnly
    className="w-4 h-4"
  />
</div>


      {/* Preview */}
      <div className="w-full h-full flex items-center justify-center bg-slate-50">
        {file.isFolder ? (
          <FolderIcon />
        ) : isImage ? (
          <img
            src={`${API_BASE}/files/${file._id}/preview`}
            alt={file.name}
            className="object-cover w-full h-full"
          />
        ) : isVideo ? (
          <VideoIcon />
        ) : isPdf ? (
          <PdfIcon />
        ) : isZip ? (
          <ZipIcon />
        ) : (
          <FileIcon />
        )}
      </div>

      {/* Filename */}
      <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur px-2 py-1.5
                      text-[12px] sm:text-xs leading-tight
                      flex items-center">
        <span className="block w-full truncate">{file.name}</span>
      </div>

      {/* Context menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed z-[9999] bg-white border rounded-lg shadow-lg text-sm w-44 overflow-hidden"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <MenuItem
  onClick={() => {
    try {
      onPreview(file);
    } catch (e) {
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            type: "error",
            message: e?.message || "Vault is locked",
          },
        })
      );
    }
  }}
>
  Preview
</MenuItem>

<MenuItem
  onClick={() => {
    try {
      window.open(
        `${API_BASE}/files/download/${file._id}`,
        "_blank"
      );
    } catch (e) {
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            type: "error",
            message: e?.message || "Vault is locked",
          },
        })
      );
    }
  }}
>
  Download
</MenuItem>

        </div>
      )}
    </div>
  );
}

/* helpers */

const MenuItem = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="block w-full px-4 py-2 text-left hover:bg-slate-100"
  >
    {children}
  </button>
);

/* icons */

const FolderIcon = () => <Icon color="text-blue-600" label="📁" />;
const FileIcon = () => <Icon label="FILE" />;
const PdfIcon = () => <Icon label="PDF" color="text-red-600" />;
const ZipIcon = () => <Icon label="ZIP" color="text-yellow-600" />;
const VideoIcon = () => <Icon label="▶" color="text-purple-600" />;

function Icon({ label, color = "text-gray-400" }) {
  return (
    <div
      className={`flex items-center justify-center text-lg font-semibold
                  w-14 h-14 sm:w-10 sm:h-10 ${color}`}
    >
      {label}
    </div>
  );
}
