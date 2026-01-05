import { useState, useEffect } from "react";

export default function RenameModal({ file, onClose, onSave }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (file) setName(file.name);
  }, [file]);

  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Rename file</h2>

        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(name)}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
