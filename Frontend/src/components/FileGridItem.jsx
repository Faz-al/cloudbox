export default function FileGridItem({ file, onPreview }) {
  const isImage = file.type === "image";

  return (
    <div
      className="border rounded-lg p-3 cursor-pointer hover:shadow"
      onClick={() => isImage && onPreview(file)}
    >
      {isImage ? (
        <img
          src={file.url}
          alt={file.name}
          className="w-full h-32 object-cover rounded mb-2"
        />
      ) : (
        <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded mb-2 text-2xl">
          📄
        </div>
      )}

      <p className="text-sm font-medium truncate">{file.name}</p>
      <p className="text-xs text-gray-500">{file.size}</p>
    </div>
  );
}
