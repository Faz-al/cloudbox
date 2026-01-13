import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getFiles } from "../utils/api";
import ImagePreview from "../components/ImagePreview";
import { API_BASE } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";

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
      setFiles(await getFiles());
    } catch {
      console.error("Failed to load files");
    }
  };

  /* ===== Storage ===== */
  const totalBytes = user?.storageLimit || 0;
  const usedBytes = files.reduce((s, f) => s + f.size, 0);

  const totalGB = totalBytes / (1024 ** 3);
  const usedGB = usedBytes / (1024 ** 3);

  const percent =
    totalBytes > 0 ? Math.min((usedBytes / totalBytes) * 100, 100) : 0;

  const recentFiles = files.slice(0, 5);
  const previewFiles = files.filter(
    (f) =>
      !f.isFolder &&
      (f.type?.startsWith("image") || f.type?.startsWith("video"))
  );

  /* ===== Upload ===== */
  const handleUpload = (file) => {
    if (!file) return;

    const lastFolder = localStorage.getItem("lastFolder") || null;
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("file", file);
    if (lastFolder) formData.append("parent", lastFolder);

    xhr.upload.onprogress = (e) => {
  if (!e.lengthComputable) return;

  const raw = e.loaded / e.total;
  const eased = Math.min(raw * 85, 85); // cap upload phase at 85%
  setUploadProgress(Math.round(eased));
};


    xhr.onloadstart = () => {
      setUploading(true);
      setUploadProgress(0);
    };

    xhr.onload = async () => {
  // smooth fake server processing
  let p = 85;

  const tick = setInterval(() => {
    p += Math.random() * 3;
    if (p >= 98) {
      p = 98;
      clearInterval(tick);
    }
    setUploadProgress(Math.round(p));
  }, 120);

  await new Promise(r => setTimeout(r, 600));

  clearInterval(tick);
  setUploadProgress(100);
  setUploading(false);

  if (xhr.status >= 200 && xhr.status < 300) {
    setToast("Upload complete");
    await loadFiles();
  } else {
    setToast("Upload failed");
  }

  setTimeout(() => {
    setToast("");
    setUploadProgress(0);
  }, 2000);
};


    xhr.open("POST", `${API_BASE}/files/upload`);
    xhr.withCredentials = true;
    xhr.send(formData);
  };

  return (
  <div className="px-4 py-6 sm:px-6 lg:px-10 max-w-full">

    {/* Vault Header */}
    <div className="mb-6">
      <h1 className="text-xl font-semibold text-gray-900">Your Vault</h1>
      <p className="text-sm text-gray-500 mt-1">
        Secure cloud storage
      </p>
    </div>

    {/* Storage Card */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Storage</p>
          <p className="text-xs text-gray-500 mt-1">
            {usedGB.toFixed(2)} GB of {totalGB.toFixed(0)} GB used
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Upload
        </button>
      </div>

      <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6 }}
          className="h-full bg-blue-600"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <QuickLink to="/files" label="All files" />
        <QuickLink to="/files?type=image" label="Images" />
        <QuickLink to="/files?type=video" label="Videos" />
        <QuickLink to="/files?type=document" label="Documents" />
      </div>
    </motion.div>

    {/* Recent Files */}
    <div className="mt-10">
      <h2 className="text-sm font-medium text-gray-900 mb-3">
        Recent files
      </h2>

      <div className="bg-white border border-gray-200 rounded-xl divide-y overflow-hidden">
        {recentFiles.length === 0 && (
          <div className="p-4 text-sm text-gray-500">
            No files yet
          </div>
        )}

        {recentFiles.map(file => (
          <div
            key={file._id}
            onClick={() => {
              if (file.type?.startsWith("image") || file.type?.startsWith("video")) {
                setPreviewFile(file);
              }
            }}
            className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer"
          >
            <span className="truncate text-gray-900">{file.name}</span>
            <span className="text-gray-500">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Hidden upload input */}
    <input
      ref={fileInputRef}
      type="file"
      multiple
      className="hidden"
      onChange={(e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => handleUpload(file));
        e.target.value = null;
      }}
    />

    {/* Upload HUD */}
    <AnimatePresence>
      {uploading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border shadow-lg rounded-full px-5 py-2 text-sm"
        >
          Uploading… {uploadProgress}%
        </motion.div>
      )}
    </AnimatePresence>

    {/* Toast */}
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-6 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg"
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>

    <ImagePreview
      files={previewFiles}
      activeFile={previewFile}
      onClose={() => setPreviewFile(null)}
    />
  </div>
);

}

/* ===== Small UI pieces ===== */

function QuickLink({ to, label }) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-gray-200/70 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
    >
      {label}
    </Link>
  );
}
