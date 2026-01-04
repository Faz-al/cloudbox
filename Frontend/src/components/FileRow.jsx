export default function FileRow({ file, onPreview }) {
  const isImage = file.type === "image";

  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        {isImage ? (
          <img
            src={file.url}
            alt={file.name}
            className="w-10 h-10 object-cover rounded"
            onClick={() => onPreview(file)}
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded text-sm">
            📄
          </div>
        )}

        <div>
          <p className="font-medium break-all">{file.name}</p>
          <p className="text-xs text-gray-500">
            {file.size} • {file.date}
          </p>
        </div>
      </div>

      <div className="flex gap-4 text-sm">
        <button className="text-blue-600">Download</button>
        <button
  className="text-red-500 hover:underline"
  onClick={() => onDelete(file.id)}
>
  Delete
</button>

      </div>
    </div>
  );
}
