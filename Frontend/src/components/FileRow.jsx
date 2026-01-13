import { API_BASE } from "../utils/api";

import { useState } from "react";


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


          /* share handler*/

  const [shareLink, setShareLink] = useState(null);
const [copyDone, setCopyDone] = useState(false);
const [shareStatus, setShareStatus] = useState(null);
const [toggling, setToggling] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);


const handleShare = async () => {
  try {
    // 1️⃣ ensure share exists
    const res = await fetch(
      `${API_BASE}/files/${file._id}/share`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setShareLink(data.url);
    setCopyDone(false);

    // 2️⃣ fetch share status
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
    await fetch(
      `${API_BASE}/files/${file._id}/share/toggle`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    // 🔄 re-fetch real status from server
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

  return (
    <div className="group flex items-center justify-between px-3 sm:px-6 py-4 sm:py-2 gap-4 text-[13px] hover:bg-gray-50 transition-colors">




      {/* LEFT */}
      <div
  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
  onClick={() => {
    // If any selection exists, this click means "select", not "open"
    if (window.__cloudboxSelectionActive) {
      onSelect?.();
      return;
    }

    file.isFolder ? onOpenFolder?.(file._id) : onPreview?.(file);
  }}
>



      {onSelect && (
  <div>
  <input
    type="checkbox"
    checked={selected}
    onClick={(e) => {
      e.stopPropagation();
      onSelect();
    }}
    readOnly
    className={`w-4 h-4 rounded border-gray-300 transition ${
      selected
        ? "opacity-100"
        : "opacity-0 group-hover:opacity-100"
    }`}
  />
</div>

)}







       <div className="flex flex-col min-w-0">
  <span className="text-[13.5px] text-gray-900 truncate">


    {file.name}
  </span>

  {!file.isFolder && (
    <span className="text-xs text-gray-400">
      {(file.size / (1024 * 1024)).toFixed(2)} MB
    </span>
  )}
</div>

      </div>

      {/* ACTIONS */}

     {/* Mobile ⋯ menu */}
<div className="sm:hidden shrink-0">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setMenuOpen(true);
    }}
    className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"

  >
    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="2"/>
      <circle cx="12" cy="12" r="2"/>
      <circle cx="12" cy="19" r="2"/>
    </svg>
  </button>
</div>

{/* Desktop actions */}
<div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

  {!file.isFolder && (
    <>
      <Action onClick={() => onPreview?.(file)}>View</Action>
      <Action onClick={handleDownload}>Download</Action>
      <Action onClick={handleShare}>Share</Action>
    </>
  )}

  {onVault && <Action onClick={() => onVault(file._id)}>Vault</Action>}
  {onRestore && <Action onClick={() => onRestore(file._id)}>Restore</Action>}
  {onDelete && (
    <Action danger onClick={() => onDelete(file._id)}>
      {onRestore ? "Delete forever" : "Delete"}
    </Action>
  )}
</div>


      {menuOpen && (
  <div
    className="fixed inset-0 sm:hidden z-50 bg-black/40 flex items-end"
    onClick={() => setMenuOpen(false)}
  >
    <div
      className="bg-white w-full rounded-t-2xl p-4"
      onClick={(e) => e.stopPropagation()}
    >

      <div className="text-sm font-semibold mb-3 truncate">
        {file.name}
      </div>

      {!file.isFolder && (
        <>
          <ActionSheet onClick={() => { onPreview(file); setMenuOpen(false); }}>
            View
          </ActionSheet>

          <ActionSheet onClick={() => { handleDownload(); setMenuOpen(false); }}>
            Download
          </ActionSheet>

          <ActionSheet onClick={() => { handleShare(); setMenuOpen(false); }}>
            Share link
          </ActionSheet>
        </>
      )}

      {onVault && (
        <ActionSheet onClick={() => { onVault(file._id); setMenuOpen(false); }}>
          Move to Vault
        </ActionSheet>
      )}

      {onRestore && (
        <ActionSheet onClick={() => { onRestore(file._id); setMenuOpen(false); }}>
          Restore
        </ActionSheet>
      )}

      {onDelete && (
        <ActionSheet danger onClick={() => { onDelete(file._id); setMenuOpen(false); }}>
          {onRestore ? "Delete forever" : "Delete"}
        </ActionSheet>
      )}

      <button
        onClick={() => setMenuOpen(false)}
        className="w-full py-3 mt-3 text-sm text-gray-500"
      >
        Cancel
      </button>
    </div>
  </div>
)}







          {shareLink && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    onClick={() => setShareLink(null)}
  >
    <div
      className="bg-white rounded-lg p-5 w-full max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="font-semibold mb-2">Share link</h3>


       {shareStatus && (
  <div className="mb-3 flex items-center justify-between">
    <span
      className={`text-xs px-2 py-1 rounded ${
        shareStatus.shareEnabled
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {shareStatus.shareEnabled
        ? "Anyone with the link can view"
        : "Link disabled"}
    </span>

    <button
  onClick={toggleShare}
  className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
    shareStatus.shareEnabled ? "bg-green-500" : "bg-gray-300"
  }`}
>
  <span
    className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
      shareStatus.shareEnabled ? "translate-x-5" : "translate-x-0"
    }`}
  />
</button>

  </div>
)}



        




      <div className="flex items-center gap-2">
        <input
          value={shareLink}
          readOnly
          className="flex-1 border px-3 py-2 rounded text-sm"
        />
        <button
          onClick={copyLink}
          className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
        >
          {copyDone ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="text-right mt-4">
        <button
          onClick={() => setShareLink(null)}
          className="text-sm text-gray-600 hover:text-gray-900"
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

function Action({ children, onClick, danger }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`px-3 py-1.5 rounded-md text-xs font-medium ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function ActionSheet({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left py-3 px-2 text-sm rounded-lg ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-800 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}


