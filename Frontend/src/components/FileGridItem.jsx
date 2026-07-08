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

  const meta = getFileMeta(file);

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

  const handleOpen = async () => {
    if (longPressed) return;

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
  };

  const handlePreview = () => {
    try {
      if (file.isFolder) {
        onOpenFolder(file._id);
      } else {
        onPreview(file);
      }

      setMenuOpen(false);
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
  };

  const handleDownload = () => {
    try {
      if (!file.isFolder) {
        window.open(`${API_BASE}/files/download/${file._id}`, "_blank");
      }

      setMenuOpen(false);
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
  };

  return (
    <div
      className={[
        "group relative w-full overflow-hidden rounded-[1.35rem] border bg-white shadow-sm transition",
        "aspect-[4/3] sm:aspect-square",
        "hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]",
        selected ? "border-blue-300 ring-2 ring-blue-500/30" : "border-slate-100",
      ].join(" ")}
      onClick={handleOpen}
      onContextMenu={openContext}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
    >
      {/* Selection */}
      <button
        type="button"
        className={[
          "absolute left-2.5 top-2.5 z-20 grid h-8 w-8 place-items-center rounded-xl border bg-white/90 shadow-sm backdrop-blur transition",
          selected
            ? "border-blue-500 text-blue-600 opacity-100"
            : "border-white/70 text-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
        ].join(" ")}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        aria-label="Select file"
      >
        <span
          className={[
            "grid h-5 w-5 place-items-center rounded-md border transition",
            selected
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-slate-300 bg-white text-transparent",
          ].join(" ")}
        >
          <CheckIcon />
        </span>
      </button>

      {/* More menu button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setMenuPosition({
            x: e.clientX || window.innerWidth - 190,
            y: e.clientY || 120,
          });
          setMenuOpen(true);
        }}
        className="absolute right-2.5 top-2.5 z-20 grid h-8 w-8 place-items-center rounded-xl bg-white/90 text-slate-500 opacity-100 shadow-sm backdrop-blur transition hover:bg-white hover:text-slate-900 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label="Open menu"
      >
        <DotsIcon />
      </button>

      {/* Preview Surface */}
      <div
        className={[
          "relative flex h-full w-full items-center justify-center overflow-hidden",
          meta.surfaceClass,
        ].join(" ")}
      >
        {meta.isImage ? (
          <img
            src={`${API_BASE}/files/${file._id}/preview`}
            alt={file.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.10),_transparent_35%)]" />

            <div
              className={[
                "relative grid h-16 w-16 place-items-center rounded-[1.35rem] border shadow-sm sm:h-14 sm:w-14",
                meta.iconClass,
              ].join(" ")}
            >
              {meta.icon}
            </div>
          </div>
        )}

        {meta.isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-violet-600 shadow-xl backdrop-blur">
              <PlayIcon />
            </div>
          </div>
        )}

        {!file.isFolder && file.isVaulted && (
          <div className="absolute left-2.5 bottom-12 z-20 inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
            <LockIcon />
            Vault
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/40 bg-white/95 px-3 py-2.5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span
            className={[
              "hidden h-7 w-7 shrink-0 place-items-center rounded-lg border sm:grid",
              meta.miniIconClass,
            ].join(" ")}
          >
            {meta.smallIcon}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-950">
              {file.name}
            </p>

            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
              <span>{meta.label}</span>

              {!file.isFolder && (
                <>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>{formatSize(file.size)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Context menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed z-[9999] w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 text-sm shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
          style={{
            top: Math.min(menuPosition.y, window.innerHeight - 170),
            left: Math.min(menuPosition.x, window.innerWidth - 205),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handlePreview} icon={file.isFolder ? <FolderOpenIcon /> : <EyeIcon />}>
            {file.isFolder ? "Open folder" : "Preview"}
          </MenuItem>

          {!file.isFolder && (
            <MenuItem onClick={handleDownload} icon={<DownloadIcon />}>
              Download
            </MenuItem>
          )}

          {onSelect && (
            <MenuItem
              onClick={() => {
                onSelect();
                setMenuOpen(false);
              }}
              icon={<CheckIcon />}
            >
              {selected ? "Unselect" : "Select"}
            </MenuItem>
          )}
        </div>
      )}
    </div>
  );
}

function getFileMeta(file) {
  const type = file?.type || "";
  const name = file?.name?.toLowerCase() || "";

  if (file?.isFolder || type === "folder") {
    return {
      label: "Folder",
      isImage: false,
      isVideo: false,
      icon: <FolderIcon />,
      smallIcon: <FolderIcon small />,
      surfaceClass: "bg-amber-50",
      iconClass: "border-amber-100 bg-white text-amber-700",
      miniIconClass: "border-amber-100 bg-amber-50 text-amber-700",
    };
  }

  if (type.startsWith("image")) {
    return {
      label: "Image",
      isImage: true,
      isVideo: false,
      icon: <ImageIcon />,
      smallIcon: <ImageIcon small />,
      surfaceClass: "bg-sky-50",
      iconClass: "border-sky-100 bg-white text-sky-700",
      miniIconClass: "border-sky-100 bg-sky-50 text-sky-700",
    };
  }

  if (type.startsWith("video")) {
    return {
      label: "Video",
      isImage: false,
      isVideo: true,
      icon: <VideoIcon />,
      smallIcon: <VideoIcon small />,
      surfaceClass: "bg-violet-50",
      iconClass: "border-violet-100 bg-white text-violet-700",
      miniIconClass: "border-violet-100 bg-violet-50 text-violet-700",
    };
  }

  if (type.includes("pdf") || name.endsWith(".pdf")) {
    return {
      label: "PDF",
      isImage: false,
      isVideo: false,
      icon: <DocumentIcon />,
      smallIcon: <DocumentIcon small />,
      surfaceClass: "bg-rose-50",
      iconClass: "border-rose-100 bg-white text-rose-700",
      miniIconClass: "border-rose-100 bg-rose-50 text-rose-700",
    };
  }

  if (type.includes("zip") || type.includes("rar") || name.endsWith(".zip") || name.endsWith(".rar")) {
    return {
      label: "Archive",
      isImage: false,
      isVideo: false,
      icon: <ZipIcon />,
      smallIcon: <ZipIcon small />,
      surfaceClass: "bg-orange-50",
      iconClass: "border-orange-100 bg-white text-orange-700",
      miniIconClass: "border-orange-100 bg-orange-50 text-orange-700",
    };
  }

  if (
    type.includes("document") ||
    type.includes("word") ||
    type.includes("officedocument") ||
    name.endsWith(".doc") ||
    name.endsWith(".docx")
  ) {
    return {
      label: "Document",
      isImage: false,
      isVideo: false,
      icon: <DocumentIcon />,
      smallIcon: <DocumentIcon small />,
      surfaceClass: "bg-emerald-50",
      iconClass: "border-emerald-100 bg-white text-emerald-700",
      miniIconClass: "border-emerald-100 bg-emerald-50 text-emerald-700",
    };
  }

  return {
    label: "File",
    isImage: false,
    isVideo: false,
    icon: <FileIcon />,
    smallIcon: <FileIcon small />,
    surfaceClass: "bg-slate-50",
    iconClass: "border-slate-200 bg-white text-slate-600",
    miniIconClass: "border-slate-200 bg-slate-50 text-slate-600",
  };
}

function formatSize(bytes) {
  if (!bytes) return "0 KB";

  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (bytes >= GB) return (bytes / GB).toFixed(2) + " GB";
  if (bytes >= MB) return (bytes / MB).toFixed(1) + " MB";
  return (bytes / KB).toFixed(0) + " KB";
}

function MenuItem({ children, onClick, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </span>
      {children}
    </button>
  );
}

/* Icons */

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

function FolderIcon({ small = false }) {
  return (
    <svg className={small ? "h-3.5 w-3.5" : "h-7 w-7"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M3.8 7.5A2.5 2.5 0 016.3 5h3.4l2 2H18a2.5 2.5 0 012.5 2.5v7A2.5 2.5 0 0118 19H6.3a2.5 2.5 0 01-2.5-2.5v-9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M4 10h16" />
    </svg>
  );
}

function FolderOpenIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8h7l2 2h9l-2 9H5L3 8z" />
    </svg>
  );
}

function ImageIcon({ small = false }) {
  return (
    <svg className={small ? "h-3.5 w-3.5" : "h-7 w-7"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="4" y="5" width="16" height="14" rx="2.4" strokeWidth="1.9" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M7.5 15l3-3 3 3 2-2 3 3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" d="M8.2 9.2h.01" />
    </svg>
  );
}

function VideoIcon({ small = false }) {
  return (
    <svg className={small ? "h-3.5 w-3.5" : "h-7 w-7"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="4" y="6" width="13" height="12" rx="2.2" strokeWidth="1.9" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M17 10l3-2v8l-3-2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M8 10h4M8 14h3" />
    </svg>
  );
}

function DocumentIcon({ small = false }) {
  return (
    <svg className={small ? "h-3.5 w-3.5" : "h-7 w-7"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M7 3.8h7l4 4V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5.8a2 2 0 012-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M14 4v5h5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M8.5 13h7M8.5 16.5h5" />
    </svg>
  );
}

function ZipIcon({ small = false }) {
  return (
    <svg className={small ? "h-3.5 w-3.5" : "h-7 w-7"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M4 7h16M6 7v12h12V7M8 4h8l2 3H6l2-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M9 11h6" />
    </svg>
  );
}

function FileIcon({ small = false }) {
  return (
    <svg className={small ? "h-3.5 w-3.5" : "h-7 w-7"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M7 3.8h7l4 4V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5.8a2 2 0 012-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M14 4v5h5" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v10m0 0l-4-4m4 4l4-4M5 20h14" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11V8a5 5 0 0110 0v3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 11h12v9H6v-9z" />
    </svg>
  );
}