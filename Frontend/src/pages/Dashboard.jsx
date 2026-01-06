
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getFiles } from "../utils/api";
import ImagePreview from "../components/ImagePreview";
import { API_BASE } from "../utils/api";


export default function Dashboard() {
  const { user } = useAuth();

  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await getFiles();
      setFiles(data);
    } catch {
      console.error("Failed to load files");
    }
  };

  /* ===== Storage stats ===== */
const totalBytes = user?.storageLimit || 0;
const total = totalBytes / (1024 * 1024 * 1024);

const usedBytes = files.reduce((sum, f) => sum + f.size, 0);
const used = usedBytes / (1024 * 1024 * 1024);

const percent = total > 0 ? Math.min((used / total) * 100, 100) : 0;

// ✅ ADD THESE (FORMATTED VALUES FOR UI ONLY)
const usedDisplay = used.toFixed(2);
const totalDisplay = total.toFixed(0);

const recentFiles = files.slice(0, 5);
const previewFiles = files.filter(
  (f) =>
    !f.isFolder &&
    (f.type?.startsWith("image") || f.type?.startsWith("video"))
);


  /* ===== Upload logic (PRO) ===== */

  const handleUpload = async (file) => {
    if (!file) return;

    const lastFolder = localStorage.getItem("lastFolder") || null;

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);
    if (lastFolder) formData.append("parent", lastFolder);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onloadstart = () => {
      setUploading(true);
      setUploadProgress(0);
    };

    xhr.onload = async () => {
  setUploading(false);

  if (xhr.status >= 200 && xhr.status < 300) {
    setUploadProgress(100);
    setToast("File uploaded successfully");
    await loadFiles();
  } else {
    try {
      const res = JSON.parse(xhr.responseText);
      setToast(res.message || "Upload failed");
    } catch {
      setToast("Upload failed");
    }
  }

  setTimeout(() => {
    setToast("");
    setUploadProgress(0);
  }, 2500);
};


    xhr.onerror = () => {
      setUploading(false);
      setToast("Upload failed");
      setTimeout(() => setToast(""), 2500);
    };

    xhr.open("POST", `${API_BASE}/files/upload`);

    xhr.withCredentials = true;
    xhr.send(formData);
  };

  return (
    <>
      

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>

        {/* Storage */}
        <div className="bg-white border rounded-2xl p-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Storage usage</span>
            <span className="text-sm text-gray-600">
              {usedDisplay} GB of {totalDisplay} GB
            </span>

          </div>

          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex gap-6 mt-4 text-sm text-gray-600">
            <span>{files.length} files</span>
            <span>Folders coming soon</span>
          </div>
        </div>

        {/* Upload progress */}
       {uploading && (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-300">
    <div className="flex items-center gap-3 bg-white border shadow-lg rounded-full px-4 py-2 backdrop-blur">
      {/* Spinner */}
      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />

      {/* Text */}
      <div className="text-xs text-gray-700 whitespace-nowrap">
        Uploading… {uploadProgress}%
      </div>

      {/* Progress bar */}
      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-200"
          style={{ width: `${uploadProgress}%` }}
        />
      </div>
    </div>
  </div>
)}


        {/* Hidden upload input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            e.target.value = null;
            handleUpload(file);
          }}
        />

        {/* Quick Actions */}
        <div>
          <h2 className="font-semibold mb-4">Quick actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => fileInputRef.current.click()}
              className="bg-white border rounded-xl p-5 hover:shadow-md cursor-pointer"
            >
              <p className="font-medium mb-1">Upload file</p>
              <p className="text-sm text-gray-600">
                Upload a new file directly
              </p>
            </div>

            <Link
              to="/files"
              className="bg-white border rounded-xl p-5 hover:shadow-md"
            >
              <p className="font-medium mb-1">Upload folder</p>
              <p className="text-sm text-gray-600">
                Upload an entire folder
              </p>
            </Link>

            <div className="bg-gray-50 border rounded-xl p-5 text-gray-400">
              <p className="font-medium mb-1">Create folder</p>
              <p className="text-sm">Coming soon</p>
            </div>
          </div>
        </div>

        {/* Recent Files */}
        <div>
          <h2 className="font-semibold mb-4">Recent files</h2>

          {recentFiles.length === 0 ? (
            <div className="bg-white border rounded-xl p-6 text-gray-500">
              No files uploaded yet
            </div>
          ) : (
            <div className="bg-white border rounded-xl divide-y">
              {recentFiles.map((file) => (
                <div
                  key={file._id}
                  onClick={() => {
  if (file.isFolder) {
    window.location.href = `/files?folder=${file._id}`;
  } else if (
    file.type?.startsWith("image") ||
    file.type?.startsWith("video")
  ) {
    setPreviewFile(file);
  }
}}

                  className="px-4 py-3 flex justify-between items-center text-sm cursor-pointer hover:bg-gray-50"
                >
                  <span className="truncate">{file.name}</span>
                  <span className="text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Smart Folders */}
        <div>
          <h2 className="font-semibold mb-4">Smart folders</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link to="/files?type=image" className="bg-white border rounded-xl p-4">
              Images
            </Link>
            <Link to="/files?type=video" className="bg-white border rounded-xl p-4">
              Videos
            </Link>
            <Link to="/files?type=document" className="bg-white border rounded-xl p-4">
              Documents
            </Link>
            <Link to="/files" className="bg-white border rounded-xl p-4">
              All files
            </Link>
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
       <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-lg shadow-lg text-sm transition-opacity duration-300">
       {toast}
       </div>
    )}


      <ImagePreview
        files={previewFiles}
        activeFile={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </>
  );
}
