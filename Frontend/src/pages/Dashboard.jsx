import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getFiles } from "../utils/api";
import ImagePreview from "../components/ImagePreview";
import { API_BASE } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";



function formatSize(bytes) {
  if (!bytes) return "0 KB";

  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (bytes >= GB) return (bytes / GB).toFixed(2) + " GB";
  if (bytes >= MB) return (bytes / MB).toFixed(1) + " MB";
  return (bytes / KB).toFixed(0) + " KB";
}








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

 const totalGB = totalBytes / 1_000_000_000;
const usedGB = usedBytes / 1_000_000_000;


  const percent =
    totalBytes > 0 ? Math.min((usedBytes / totalBytes) * 100, 100) : 0;

    const isLowStorage = percent >= 80;





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
      const eased = Math.min(raw * 85, 85);
      setUploadProgress(Math.round(eased));
    };

    xhr.onloadstart = () => {
      setUploading(true);
      setUploadProgress(0);
    };

    xhr.onload = async () => {
      let p = 85;
      const tick = setInterval(() => {
        p += Math.random() * 3;
        if (p >= 98) {
          p = 98;
          clearInterval(tick);
        }
        setUploadProgress(Math.round(p));
      }, 120);

      await new Promise((r) => setTimeout(r, 600));

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
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-10">

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-gray-900">
          Your Vault
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Secure cloud storage for your files
        </p>
      </div>

      {/* Storage Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-5 sm:p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Storage usage
            </p>
            <p
  className={`text-xs mt-1 ${
    isLowStorage ? "text-red-600" : "text-gray-500"
  }`}
>
  <span className="font-medium text-gray-900">
    {usedGB.toFixed(2)} GB
  </span>{" "}
  of {totalGB.toFixed(0)} GB used •{" "}
  <span className="font-medium">
    {Math.round(percent)}% used
  </span>
</p>

          </div>

          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition"
          >
            Upload
          </button>
        </div>

        <div className="mt-4 h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6 }}
            className={`h-full rounded-full ${
  isLowStorage ? "bg-red-500" : "bg-blue-600"
}`}
          />
        </div>

        <AnimatePresence>
  {isLowStorage && (
    <motion.p
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="mt-2 text-xs text-red-600"
    >
      Low storage • Consider freeing up space
    </motion.p>
  )}
</AnimatePresence>






        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickLink
            to="/files"
            label="All files"
            icon="→"
            prominent
          />
          <QuickLink to="/files?type=image" label="Images" icon="🖼" />
          <QuickLink to="/files?type=video" label="Videos" icon="▶" />
          <QuickLink to="/files?type=document" label="Documents" icon="📄" />
        </div>
      </motion.div>

      {/* Recent Files */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-900">
            Recent files
          </h2>
          <Link
            to="/files"
            className="text-xs font-medium text-gray-500 hover:text-gray-900 transition"
          >
            View all →
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl divide-y overflow-hidden">
          {recentFiles.length === 0 && (
            <div className="p-6 text-sm text-gray-500 text-center">
              No files uploaded yet
            </div>
          )}

          {recentFiles.map((file) => (
            <div
              key={file._id}
              onClick={() => {
                if (
                  file.type?.startsWith("image") ||
                  file.type?.startsWith("video")
                ) {
                  setPreviewFile(file);
                }
              }}
              className="flex items-center justify-between px-4 py-3 text-sm cursor-pointer
                         hover:bg-gray-50 hover:translate-x-[2px] transition"
            >
              <span className="truncate text-gray-900">
                {file.name}
              </span>
              <span className="text-gray-500 text-xs">
  {formatSize(file.size)}
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
          files.forEach((file) => handleUpload(file));
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
            className="fixed bottom-6 left-1/2 -translate-x-1/2
                       bg-white/90 backdrop-blur border shadow-lg
                       rounded-full px-5 py-2 text-sm"
          >
            Uploading <span className="font-medium">{uploadProgress}%</span>
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
            className="fixed bottom-6 right-4 bg-blue-600 text-white
                       px-4 py-2 rounded-xl text-sm shadow-lg"
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

/* ===== Quick Link ===== */
function QuickLink({ to, label, icon, prominent }) {
  return (
    <Link
      to={to}
      className={`rounded-xl border px-4 py-3 text-sm font-medium
        flex items-center justify-between transition
        ${
          prominent
            ? "border-gray-300 bg-gray-100 text-gray-900"
            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        }`}
    >
      <span>{label}</span>
      <span className="text-xs opacity-70">{icon}</span>
    </Link>
  );
}
