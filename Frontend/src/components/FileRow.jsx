export default function FileRow({
  file,
  onPreview,
  onDelete,
  onOpenFolder,
  onRename,
}) {
  const handleDownload = () => {
    if (file.isFolder) return;

    const url = `http://localhost:5000/api/files/download/${file._id}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b last:border-b-0">
      {/* Left: name + size */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm font-medium truncate">{file.name}</span>

        {!file.isFolder && (
          <span className="text-xs text-gray-500">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </span>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3 shrink-0">
        {file.isFolder ? (
          <button
            onClick={() => onOpenFolder(file._id)}
            className="text-xs text-blue-600"
          >
            Open
          </button>
        ) : (
          <button
            onClick={() => onPreview(file)}
            className="text-xs text-blue-600"
          >
            Preview
          </button>
        )}

        {!file.isFolder && (
          <button
            onClick={handleDownload}
            className="text-xs text-green-600"
          >
            Download
          </button>
        )}

        <button
          onClick={() => onRename(file)}
          className="text-xs text-gray-600"
        >
          Rename
        </button>

        <button
          onClick={() => onDelete(file._id)}
          className="text-xs text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
