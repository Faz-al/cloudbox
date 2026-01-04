export default function ImagePreview({ file, onClose }) {
  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative max-w-3xl w-full px-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl"
        >
          ✕
        </button>

        <img
          src={file.url}
          alt={file.name}
          className="w-full max-h-[80vh] object-contain rounded"
        />
      </div>
    </div>
  );
}
