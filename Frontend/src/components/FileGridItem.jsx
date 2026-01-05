import { useEffect, useRef, useState } from "react";

export default function FileGridItem({
  file,
  onPreview,
  onRename,
  onOpenFolder,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const openMenu = (e) => {
    e.preventDefault();
    setMenuOpen(true);
  };

  const handlePrimaryClick = () => {
    if (menuOpen) return;

    if (file.isFolder) {
      onOpenFolder(file._id);
      return;
    }

    onPreview(file);
  };

  const handleDownload = () => {
    window.open(
      `http://localhost:5000/api/files/download/${file._id}`,
      "_blank"
    );
    setMenuOpen(false);
  };

  const isImage = file.type?.startsWith("image");

  return (
    <div
      className="relative aspect-square bg-white border rounded-xl hover:shadow-md cursor-pointer"

      onClick={handlePrimaryClick}
      onContextMenu={openMenu}
    >
      {file.isFolder ? (
        <div
          className="flex items-center justify-center h-full text-blue-600 text-4xl"
          onContextMenu={openMenu}
        >
          📁
        </div>
      ) : isImage ? (
        <img
          src={`http://localhost:5000/api/files/${file._id}/preview`}
          alt={file.name}
          className="object-cover w-full h-full"
          draggable={false}
          onClick={() => onPreview(file)}
          onContextMenu={openMenu}
        />
      ) : (
        <div className="flex items-center justify-center h-full px-2 text-center">
        <span className="text-gray-400 text-xs truncate whitespace-nowrap max-w-full">
        {file.name}
        </span>
        </div>

      )}

      <div className="absolute bottom-0 left-0 right-0 bg-white/90 px-2 py-1 text-xs">
  <span className="block truncate whitespace-nowrap">
    {file.name}
  </span>
</div>




      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-2 top-2 z-50 bg-white border rounded-lg shadow-md text-sm w-40"
          onClick={(e) => e.stopPropagation()}
        >
          {!file.isFolder && (
            <button
              onClick={() => {
                onPreview(file);
                setMenuOpen(false);
              }}
              className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
            >
              Preview
            </button>
          )}

          {!file.isFolder && (
            <button
              onClick={handleDownload}
              className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
            >
              Download
            </button>
          )}

          <button
            onClick={() => {
              onRename(file);
              setMenuOpen(false);
            }}
            className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
          >
            Rename
          </button>

          {!file.isFolder && (
            <button
              onClick={() => {
                alert(
                  `File info\n\nName: ${file.name}\nSize: ${(
                    file.size /
                    (1024 * 1024)
                  ).toFixed(2)} MB`
                );
                setMenuOpen(false);
              }}
              className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
            >
              File info
            </button>
          )}
        </div>
      )}
    </div>
  );
}
