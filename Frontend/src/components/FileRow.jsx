import { API_BASE } from "../utils/api";

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
