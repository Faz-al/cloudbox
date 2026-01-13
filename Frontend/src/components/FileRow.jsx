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
    <div className="group flex items-center justify-between px-6 py-3 text-sm hover:bg-gray-50 transition-colors">
      {/* LEFT */}
      <div
        className="flex items-center gap-3 min-w-0 cursor-pointer"
        onClick={() =>
          file.isFolder ? onOpenFolder?.(file._id) : onPreview?.(file)
        }
      >

      {onSelect && (
  <input
    type="checkbox"
    checked={selected}
    onClick={(e) => {
      e.stopPropagation();
      onSelect();
    }}
    readOnly
    className={`transition ${
      selected
        ? "opacity-100"
        : "opacity-0 group-hover:opacity-100"
    }`}
  />
)}






        <span className="font-medium text-gray-900 truncate">
          {file.name}
        </span>

        {!file.isFolder && (
          <span className="text-xs text-gray-400 shrink-0">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </span>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!file.isFolder && (
          <>
            <Action onClick={() => onPreview?.(file)}>Preview</Action>
            <Action onClick={handleDownload}>Download</Action>
            <Action onClick={handleShare}>Share</Action>

          </>
        )}

        {onRename && <Action onClick={() => onRename(file)}>Rename</Action>}

        {onVault && <Action onClick={() => onVault(file._id)}>Vault</Action>}

        {onUnvault && (
          <Action danger onClick={() => onUnvault(file._id)}>
            Remove
          </Action>
        )}

        {onRestore && (
          <Action onClick={() => onRestore(file._id)}>Restore</Action>
        )}

        {onDelete && (
          <Action danger onClick={() => onDelete(file._id)}>
            {onRestore ? "Delete forever" : "Delete"}
          </Action>
        )}

            
            

      </div>


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
      className={`text-xs ${
        danger
          ? "text-red-600 hover:text-red-800"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}
