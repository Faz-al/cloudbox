import { API_BASE } from "../utils/api";
import { useState } from "react";

function formatSize(bytes) {
  if (bytes === 0) return "0 KB";

  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (bytes >= GB) return (bytes / GB).toFixed(2) + " GB";
  if (bytes >= MB) return (bytes / MB).toFixed(2) + " MB";
  return (bytes / KB).toFixed(0) + " KB";
}

function getFileMeta(file) {
  const type = file?.type || "";
  const name = file?.name?.toLowerCase() || "";

  if (file?.isFolder || type === "folder") {
    return {
      label: "Folder",
      badge: "FOLDER",
      icon: <FolderIcon />,
      iconClass: "bg-amber-50 text-amber-700 border-amber-100",
    };
  }

  if (type.startsWith("image")) {
    return {
      label: "Image",
      badge: "IMG",
      icon: <ImageIcon />,
      iconClass: "bg-sky-50 text-sky-700 border-sky-100",
    };
  }

  if (type.startsWith("video")) {
    return {
      label: "Video",
      badge: "VID",
      icon: <VideoIcon />,
      iconClass: "bg-violet-50 text-violet-700 border-violet-100",
    };
  }

  if (type.includes("pdf") || name.endsWith(".pdf")) {
    return {
      label: "PDF document",
      badge: "PDF",
      icon: <DocumentIcon />,
      iconClass: "bg-rose-50 text-rose-700 border-rose-100",
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
      badge: "DOC",
      icon: <DocumentIcon />,
      iconClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
  }

  if (type.includes("zip") || name.endsWith(".zip")) {
    return {
      label: "Archive",
      badge: "ZIP",
      icon: <ArchiveIcon />,
      iconClass: "bg-orange-50 text-orange-700 border-orange-100",
    };
  }

  return {
    label: "File",
    badge: "FILE",
    icon: <FileIcon />,
    iconClass: "bg-slate-50 text-slate-600 border-slate-200",
  };
}

export default function FileRow({
  file,
  selected,
  onSelect,
  onPreview,
  onDelete,
  onRestore,
  onOpenFolder,
  onRename,
  onVault,
  onUnvault,
}) {
  const [shareLink, setShareLink] = useState(null);
  const [copyDone, setCopyDone] = useState(false);
  const [shareStatus, setShareStatus] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const meta = getFileMeta(file);

  const handleShare = async () => {
    try {
      const res = await fetch(`${API_BASE}/files/${file._id}/share`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setShareLink(data.url);
      setCopyDone(false);

      const statusRes = await fetch(
        `${API_BASE}/files/${file._id}/share/status`,
        { credentials: "include" }
      );

      const statusData = await statusRes.json();
      setShareStatus(statusData);
    } catch {
      alert("Failed to generate share link");
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopyDone(true);
  };

  const toggleShare = async () => {
    try {
      await fetch(`${API_BASE}/files/${file._id}/share/toggle`, {
        method: "POST",
        credentials: "include",
      });

      const statusRes = await fetch(
        `${API_BASE}/files/${file._id}/share/status`,
        { credentials: "include" }
      );

      const statusData = await statusRes.json();
      setShareStatus(statusData);
    } catch {
      alert("Failed to toggle link");
    }
  };

  const handleDownload = () => {
    if (file.isFolder) return;
    window.open(`${API_BASE}/files/download/${file._id}`, "_blank");
  };

  const handleMainClick = () => {
    if (window.__cloudboxSelectionActive) {
      onSelect?.();
      return;
    }

    file.isFolder ? onOpenFolder?.(file._id) : onPreview?.(file);
  };

  return (
    <div className="group relative flex items-center justify-between gap-3 px-3 py-3.5 text-sm transition hover:bg-slate-50 sm:px-5">
      {/* LEFT */}
      <div
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"
        onClick={handleMainClick}
      >
        {onSelect && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={[
              "grid h-10 w-8 shrink-0 place-items-center rounded-xl transition",
              selected
                ? "bg-blue-50"
                : "hover:bg-slate-100 sm:bg-transparent",
            ].join(" ")}
            aria-label="Select file"
          >
            <span
              className={[
                "grid h-5 w-5 place-items-center rounded-md border transition",
                selected
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white text-transparent group-hover:text-slate-300",
              ].join(" ")}
            >
              <CheckIcon />
            </span>
          </button>
        )}

        <div
          className={[
            "grid h-11 w-11 shrink-0 place-items-center rounded-2xl border",
            meta.iconClass,
          ].join(" ")}
        >
          {meta.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-[13.5px] font-semibold text-slate-900">
              {file.name}
            </p>

            <span className="hidden shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-500 sm:inline-flex">
              {meta.badge}
            </span>
          </div>

          <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-slate-400">
            <span>{meta.label}</span>

            {!file.isFolder && (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{formatSize(file.size)}</span>
              </>
            )}

            {file.isFolder && (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>Open folder</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className="shrink-0 sm:hidden">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(true);
          }}
          className="grid h-10 w-10 place-items-center rounded-2xl text-slate-500 transition hover:bg-slate-100 active:scale-95"
          aria-label="Open file menu"
        >
          <DotsIcon />
        </button>
      </div>

      {/* DESKTOP ACTIONS */}
      <div className="hidden shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
        {!file.isFolder && (
          <>
            <Action onClick={() => onPreview?.(file)} icon={<EyeIcon />}>
              View
            </Action>

            <Action onClick={handleDownload} icon={<DownloadIcon />}>
              Download
            </Action>

            <Action onClick={handleShare} icon={<ShareIcon />}>
              Share
            </Action>
          </>
        )}

        {onVault && (
          <Action onClick={() => onVault(file._id)} icon={<VaultIcon />}>
            Vault
          </Action>
        )}

        {onUnvault && (
          <Action onClick={() => onUnvault(file._id)} icon={<UnlockIcon />}>
            Remove
          </Action>
        )}

        {onRestore && (
          <Action onClick={() => onRestore(file._id)} icon={<RestoreIcon />}>
            Restore
          </Action>
        )}

        {onDelete && (
          <Action danger onClick={() => onDelete(file._id)} icon={<TrashIcon />}>
            {onRestore ? "Delete forever" : "Delete"}
          </Action>
        )}
      </div>

      {/* MOBILE ACTION SHEET */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-slate-950/45 backdrop-blur-sm sm:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="w-full rounded-t-[2rem] bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />

            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <div
                className={[
                  "grid h-11 w-11 shrink-0 place-items-center rounded-2xl border",
                  meta.iconClass,
                ].join(" ")}
              >
                {meta.icon}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-950">
                  {file.name}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {file.isFolder ? "Folder" : `${meta.label} · ${formatSize(file.size)}`}
                </p>
              </div>
            </div>

            {!file.isFolder && (
              <>
                <ActionSheet
                  icon={<EyeIcon />}
                  onClick={() => {
                    onPreview?.(file);
                    setMenuOpen(false);
                  }}
                >
                  View
                </ActionSheet>

                <ActionSheet
                  icon={<DownloadIcon />}
                  onClick={() => {
                    handleDownload();
                    setMenuOpen(false);
                  }}
                >
                  Download
                </ActionSheet>

                <ActionSheet
                  icon={<ShareIcon />}
                  onClick={() => {
                    handleShare();
                    setMenuOpen(false);
                  }}
                >
                  Share link
                </ActionSheet>
              </>
            )}

            {onVault && (
              <ActionSheet
                icon={<VaultIcon />}
                onClick={() => {
                  onVault(file._id);
                  setMenuOpen(false);
                }}
              >
                Move to Vault
              </ActionSheet>
            )}

            {onUnvault && (
              <ActionSheet
                icon={<UnlockIcon />}
                onClick={() => {
                  onUnvault(file._id);
                  setMenuOpen(false);
                }}
              >
                Remove from Vault
              </ActionSheet>
            )}

            {onRestore && (
              <ActionSheet
                icon={<RestoreIcon />}
                onClick={() => {
                  onRestore(file._id);
                  setMenuOpen(false);
                }}
              >
                Restore
              </ActionSheet>
            )}

            {onDelete && (
              <ActionSheet
                danger
                icon={<TrashIcon />}
                onClick={() => {
                  onDelete(file._id);
                  setMenuOpen(false);
                }}
              >
                {onRestore ? "Delete forever" : "Delete"}
              </ActionSheet>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="mt-3 w-full rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-500 transition active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {shareLink && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onClick={() => setShareLink(null)}
        >
          <div
            className="w-full max-w-md rounded-[2rem] bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <ShareIcon />
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-950">Share link</h3>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {file.name}
                </p>
              </div>
            </div>

            {shareStatus && (
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <span
                  className={[
                    "rounded-full px-3 py-1 text-xs font-bold",
                    shareStatus.shareEnabled
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700",
                  ].join(" ")}
                >
                  {shareStatus.shareEnabled
                    ? "Anyone with the link can view"
                    : "Link disabled"}
                </span>

                <button
                  type="button"
                  onClick={toggleShare}
                  className={[
                    "flex h-7 w-12 items-center rounded-full p-1 transition",
                    shareStatus.shareEnabled ? "bg-emerald-500" : "bg-slate-300",
                  ].join(" ")}
                  aria-label="Toggle share link"
                >
                  <span
                    className={[
                      "h-5 w-5 rounded-full bg-white shadow transition",
                      shareStatus.shareEnabled ? "translate-x-5" : "translate-x-0",
                    ].join(" ")}
                  />
                </button>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
              <input
                value={shareLink}
                readOnly
                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-700 outline-none"
              />

              <button
                type="button"
                onClick={copyLink}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-95"
              >
                {copyDone ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShareLink(null)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Action({ children, onClick, danger, icon }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={[
        "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition",
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
      ].join(" ")}
    >
      {icon}
      {children}
    </button>
  );
}

function ActionSheet({ children, onClick, danger, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold transition active:scale-[0.99]",
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-700 hover:bg-slate-50",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
          danger ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500",
        ].join(" ")}
      >
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

function FolderIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M3.8 7.5A2.5 2.5 0 016.3 5h3.4l2 2H18a2.5 2.5 0 012.5 2.5v7A2.5 2.5 0 0118 19H6.3a2.5 2.5 0 01-2.5-2.5v-9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M4 10h16" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="4" y="5" width="16" height="14" rx="2.4" strokeWidth="1.9" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M7.5 15l3-3 3 3 2-2 3 3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" d="M8.2 9.2h.01" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="4" y="6" width="13" height="12" rx="2.2" strokeWidth="1.9" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M17 10l3-2v8l-3-2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M8 10h4M8 14h3" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M7 3.8h7l4 4V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5.8a2 2 0 012-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M14 4v5h5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M8.5 13h7M8.5 16.5h5" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M4 7h16M6 7v12h12V7M8 4h8l2 3H6l2-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M9 11h6" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M7 3.8h7l4 4V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5.8a2 2 0 012-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M14 4v5h5" />
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

function ShareIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="18" cy="5" r="3" strokeWidth="2" />
      <circle cx="6" cy="12" r="3" strokeWidth="2" />
      <circle cx="18" cy="19" r="3" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.6 10.6l6.8-4.2M8.6 13.4l6.8 4.2" />
    </svg>
  );
}

function VaultIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11V8a5 5 0 0110 0v3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 11h12v9H6v-9z" />
    </svg>
  );
}

function UnlockIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11V8a4 4 0 00-7.7-1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 11h12v9H6v-9z" />
    </svg>
  );
}

function RestoreIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v5h5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12a7 7 0 111.8 4.7" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 7h12M10 7V5h4v2M8 7l1 13h6l1-13M10.5 11v5M13.5 11v5" />
    </svg>
  );
}