export default function StorageBar({ used = 1.2, total = 5 }) {
  const percent = Math.min((used / total) * 100, 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-700 font-medium">
          Storage used
        </span>
        <span className="text-gray-600">
          {used} GB / {total} GB
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all ${
            percent >= 80 ? "bg-red-500" : "bg-blue-600"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {percent >= 80 && (
        <p className="text-xs text-red-500 mt-2">
          You’re running out of storage
        </p>
      )}
    </div>
  );
}
