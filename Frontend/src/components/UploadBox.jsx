export default function UploadBox() {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 text-center bg-white">
      <p className="font-medium mb-2">
        Upload files
      </p>

      <p className="text-sm text-gray-500 mb-4">
        Photos, videos, and documents supported
      </p>

      <label className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md cursor-pointer">
        Choose files
        <input type="file" className="hidden" />
      </label>

      <p className="text-xs text-gray-400 mt-3">
        Max file size depends on your plan
      </p>
    </div>
  );
}
