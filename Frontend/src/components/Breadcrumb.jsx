export default function Breadcrumb({ path, onNavigate }) {
  if (!path.length) return null;

  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      <button
        onClick={() => onNavigate(null)}
        className="px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition"
      >
        All Files
      </button>

      {path.map((folder) => (
        <div key={folder._id} className="flex items-center gap-2">
          <span className="text-gray-400">/</span>
          <button
            onClick={() => onNavigate(folder._id)}
            className="px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition"
          >
            {folder.name}
          </button>
        </div>
      ))}
    </div>
  );
}
