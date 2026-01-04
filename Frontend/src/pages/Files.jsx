import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import FileRow from "../components/FileRow";
import FileGridItem from "../components/FileGridItem";
import ImagePreview from "../components/ImagePreview";
import { uploadFile, deleteFile, getFiles } from "../utils/api";

export default function Files() {
  const [view, setView] = useState("list");
  const [preview, setPreview] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await getFiles();
      setFiles(data);
    } catch (err) {
      console.error("Failed to load files", err);
    }
  };

  const handleUpload = async () => {
  await uploadFile({
    name: "sample-image.jpg",
    size: "2.5 MB",
    type: "image",
  });
  loadFiles();
};

const handleDelete = async (id) => {
  await deleteFile(id);
  loadFiles();
};


  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Files</h1>

          <button
  onClick={handleUpload}
  className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
>
  Upload (Demo)
</button>


          <div className="flex gap-2">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1 rounded text-sm ${
                view === "list" ? "bg-blue-600 text-white" : "border"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-1 rounded text-sm ${
                view === "grid" ? "bg-blue-600 text-white" : "border"
              }`}
            >
              Grid
            </button>
          </div>
        </div>

        {/* Files */}
        {files.length === 0 ? (
          <div className="bg-white rounded-xl border p-6 text-center text-gray-500">
            No files uploaded yet
          </div>
        ) : view === "list" ? (
          <div className="bg-white rounded-xl shadow border">
            {files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                onPreview={setPreview}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file) => (
              <FileGridItem
                key={file.id}
                file={file}
                onPreview={setPreview}
              />
            ))}
          </div>
        )}
      </main>

      {/* Image Preview */}
      <ImagePreview file={preview} onClose={() => setPreview(null)} />
    </>
  );
}
