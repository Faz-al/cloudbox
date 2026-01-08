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
      if (e.lengthComputable)
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onloadstart = () => {
      setUploading(true);
      setUploadProgress(0);
    };

    xhr.onload = async () => {
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
      }, 2200);
    };

    xhr.open("POST", `${API_BASE}/files/upload`);
    xhr.withCredentials = true;
    xhr.send(formData);
  };

  return (
    <>
      <main className="max-w-7xl mx-auto px-8 py-14 space-y-16">
        {/* ===== HERO ===== */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </motion.section>

        {/* ===== PRIMARY PANEL ===== */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45 }}
          className="rounded-3xl bg-white border border-gray-200/70 p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Storage usage
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {usedGB.toFixed(2)} GB of {totalGB.toFixed(0)} GB used
              </p>
            </div>

            <button
              onClick={() => fileInputRef.current.click()}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Upload
            </button>
          </div>

          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full bg-blue-600"
            />
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <QuickLink to="/files" label="All files" />
            <QuickLink to="/files?type=image" label="Images" />
            <QuickLink to="/files?type=video" label="Videos" />
            <QuickLink to="/files?type=document" label="Documents" />
          </div>
        </motion.section>

        {/* ===== RECENT FILES ===== */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Recent files
          </h2>

          <div className="divide-y rounded-2xl border border-gray-200/70 bg-white">
            {recentFiles.length === 0 && (
              <div className="p-6 text-sm text-gray-500">
                No files uploaded yet
              </div>
            )}

            {recentFiles.map((file) => (
              <div
  key={file._id}
  className="px-6 py-4 flex items-center justify-between text-sm cursor-pointer
             transition-colors duration-150 hover:bg-gray-50"
  onClick={() => {
    if (
      file.type?.startsWith("image") ||
      file.type?.startsWith("video")
    ) {
      setPreviewFile(file);
    }
  }}
>
  <span className="truncate text-gray-900">
    {file.name}
  </span>
  <span className="text-gray-500">
    {(file.size / (1024 * 1024)).toFixed(2)} MB
  </span>
</div>

            ))}
          </div>
        </section>
      </main>

      {/* Hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          handleUpload(e.target.files[0]);
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
            className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white border shadow-xl px-6 py-3 text-sm text-gray-700"
          >
            Uploading… {uploadProgress}%
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 right-6 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm shadow-lg"
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
    </>
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
