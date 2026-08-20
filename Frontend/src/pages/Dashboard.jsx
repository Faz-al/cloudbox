import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Capacitor } from "@capacitor/core";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { getFiles } from "../utils/api";
import ImagePreview from "../components/ImagePreview";
import { API_BASE } from "../utils/api";
import { trackFirstFileUpload } from "../utils/analytics";
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

function FileTypeIcon({ file }) {
  const type = file?.type || "";
  const name = file?.name?.toLowerCase() || "";

  let label = "FILE";
  let tone = "bg-slate-50 text-slate-600 border-slate-200";

  if (file?.isFolder || type === "folder") {
    label = "FOLDER";
    tone = "bg-amber-50 text-amber-700 border-amber-100";
  } else if (type.startsWith("image")) {
    label = "IMG";
    tone = "bg-sky-50 text-sky-700 border-sky-100";
  } else if (type.startsWith("video")) {
    label = "VID";
    tone = "bg-violet-50 text-violet-700 border-violet-100";
  } else if (type.includes("pdf") || name.endsWith(".pdf")) {
    label = "PDF";
    tone = "bg-rose-50 text-rose-700 border-rose-100";
  } else if (type.includes("zip") || name.endsWith(".zip")) {
    label = "ZIP";
    tone = "bg-orange-50 text-orange-700 border-orange-100";
  } else if (
    type.includes("document") ||
    type.includes("word") ||
    name.endsWith(".doc") ||
    name.endsWith(".docx")
  ) {
    label = "DOC";
    tone = "bg-emerald-50 text-emerald-700 border-emerald-100";
  }

  return (
    <div
      className={[
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-[10px] font-black tracking-wide",
        tone,
      ].join(" ")}
    >
      {label}
    </div>
  );
}

function UploadIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 16V8m0 0l-3 3m3-3l3 3M4 16.5A4.5 4.5 0 018.5 12H9a6 6 0 1111 3.5"
      />
    </svg>
  );
}

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

function FolderIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8.5a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
      />
    </svg>
  );
}

function ImageIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 5h16v14H4V5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 13l2.5-2.5L14 14l2-2 4 4M8 9h.01"
      />
    </svg>
  );
}

function VideoIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h12a2 2 0 012 2v8a2 2 0 01-2 2H4V6z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 10l3-2v8l-3-2"
      />
    </svg>
  );
}

function DocumentIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 3h7l5 5v13H7a2 2 0 01-2-2V5a2 2 0 012-2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14 3v6h5M9 13h6M9 17h6"
      />
    </svg>
  );
}

function VaultIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 11V8a5 5 0 0110 0v3"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 11h12v9H6v-9z"
      />
    </svg>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const isAndroidApp = Capacitor.getPlatform() === "android";

  const isMobileDevice =
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 767px)").matches;

  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState("");
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
  if (!showUploadOptions || isAndroidApp) return;

  const previousOverflow = document.body.style.overflow;

  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = previousOverflow;
  };
}, [showUploadOptions, isAndroidApp]);
 
  

const handleUploadClick = () => {
  if (isAndroidApp || isMobileDevice) {
    setShowUploadOptions(true);
    return;
  }

  fileInputRef.current?.click();
};

const handleDesktopFileSelected = (event) => {
  const file = event.target.files?.[0];

  if (file) {
    handleUpload(file);
  }

  event.target.value = "";
};


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

  const imageCount = files.filter((f) => f.type?.startsWith("image")).length;
  const videoCount = files.filter((f) => f.type?.startsWith("video")).length;
  const documentCount = files.filter(
    (f) =>
      f.type?.includes("document") ||
      f.type?.includes("pdf") ||
      f.type?.includes("word") ||
      f.name?.toLowerCase().endsWith(".doc") ||
      f.name?.toLowerCase().endsWith(".docx") ||
      f.name?.toLowerCase().endsWith(".pdf")
  ).length;




  const uploadPickedFiles = async (pickedFiles) => {
  for (const pickedFile of pickedFiles) {
    try {
      let blob;

      if (pickedFile.blob) {
        blob = pickedFile.blob;
      } else if (pickedFile.path) {
        const response = await fetch(
          Capacitor.convertFileSrc(pickedFile.path)
        );
        blob = await response.blob();
      } else {
        continue;
      }

      const file = new File(
        [blob],
        pickedFile.name || "upload",
        {
          type: pickedFile.mimeType || blob.type || "application/octet-stream",
        }
      );

      handleUpload(file);
    } catch (error) {
      console.error("Failed to prepare selected file:", error);
      setToast("Could not read selected file");
    }
  }
};

const openMediaPicker = async () => {
  try {
    const result = await FilePicker.pickMedia({
      limit: 0,
    });

    if (result.files?.length) {
      await uploadPickedFiles(result.files);
    }
  } catch (error) {
    console.error("Media picker cancelled or failed:", error);
  }
};

const openFilePicker = async () => {
  try {
    const result = await FilePicker.pickFiles({
      limit: 0,
    });

    if (result.files?.length) {
      await uploadPickedFiles(result.files);
    }
  } catch (error) {
    console.error("File picker cancelled or failed:", error);
  }
};







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

  // Track only the user's first successful upload.
  // Existing users with files already uploaded won't repeatedly
  // count as a "first upload" conversion.
  if (files.length === 0) {
    await trackFirstFileUpload(file?.type || "unknown");
  }

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
    <div
      className={[
        "min-h-full",
       isAndroidApp
  ? "bg-gradient-to-b from-sky-50 via-white to-white px-4 pb-28 pt-3"
  : "px-4 py-5 sm:px-6 lg:px-8 lg:py-7",
      ].join(" ")}
    >

            <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleDesktopFileSelected}
      />

      
      {/* Website header only. Android starts directly with storage card. */}
{!isAndroidApp && (
  <div className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        Home
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Access and manage your files in SafeVault.
      </p>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        to="/files"
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        View all files
        <ArrowIcon />
      </Link>

      <button
        type="button"
        onClick={handleUploadClick}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
      >
        <UploadIcon />
        Upload
      </button>
    </div>
  </div>
)}

      {/* Top Cards */}
      <div
        className={[
          "grid gap-4",
          isAndroidApp
            ? "grid-cols-1"
            : "lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]",
        ].join(" ")}
      >
        {/* Storage */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={[
            "overflow-hidden border bg-white shadow-sm",
            isAndroidApp
              ? "rounded-[2rem] border-blue-100 shadow-blue-950/5"
              : "rounded-2xl border-slate-200 p-5 sm:p-6",
          ].join(" ")}
        >
         {isAndroidApp ? (
  <div className="relative overflow-hidden p-5">
    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-100/90 blur-2xl" />
    <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-sky-100/80 blur-2xl" />

    <div className="relative">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-500">
            SafeVault
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            {usedGB.toFixed(2)} GB
          </h2>

          <p
            className={[
              "mt-1 text-sm font-semibold",
              isLowStorage ? "text-red-600" : "text-slate-500",
            ].join(" ")}
          >
            used of {totalGB.toFixed(0)} GB
          </p>
        </div>

        <Link
          to="/upgrade"
          className="shrink-0 rounded-2xl border border-blue-100 bg-white/85 px-3.5 py-2 text-xs font-black text-blue-700 shadow-sm active:scale-95"
        >
          Upgrade
        </Link>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.45 }}
          className={[
            "h-full rounded-full",
            isLowStorage ? "bg-red-500" : "bg-blue-600",
          ].join(" ")}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500">
        <span>{Math.round(percent)}% used</span>
        <span>{formatSize(totalBytes - usedBytes)} free</span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
        <button
          type="button"
          onClick={handleUploadClick}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 active:scale-[0.98]"
          aria-label="Upload file"
        >
          <UploadIcon className="h-5 w-5" />
          Upload file
        </button>

        <Link
          to="/files"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-black text-slate-700 shadow-sm active:scale-[0.98]"
          aria-label="Open files"
        >
          Files
        </Link>
      </div>

      <AnimatePresence>
        {isLowStorage && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
          >
            Storage is almost full. Delete unused files or upgrade your plan.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  </div>
) : (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Storage
                  </h2>

                  <p
                    className={`mt-1 text-sm ${
                      isLowStorage ? "text-red-600" : "text-slate-500"
                    }`}
                  >
                    <span className="font-semibold text-slate-950">
                      {usedGB.toFixed(2)} GB
                    </span>{" "}
                    of {totalGB.toFixed(0)} GB used
                  </p>
                </div>

                <Link
                  to="/upgrade"
                  className="w-fit rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Upgrade
                </Link>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.45 }}
                  className={`h-full rounded-full ${
                    isLowStorage ? "bg-red-500" : "bg-blue-600"
                  }`}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{Math.round(percent)}% used</span>
                <span>{formatSize(totalBytes - usedBytes)} available</span>
              </div>

              <AnimatePresence>
                {isLowStorage && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
                  >
                    Storage is almost full. Delete unused files or upgrade your plan.
                  </motion.p>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>

        {/* Summary */}
        <div
          className={[
            "border bg-white shadow-sm",
            isAndroidApp
              ? "rounded-[2rem] border-slate-100 p-5"
              : "rounded-2xl border-slate-200 p-5 sm:p-6",
          ].join(" ")}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-950">
              File summary
            </h2>
            {isAndroidApp && (
  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
    {files.length} items
  </span>
)}
          </div>

          <div
            className={[
              "mt-5 grid gap-3",
              isAndroidApp ? "grid-cols-4" : "grid-cols-2",
            ].join(" ")}
          >
            <SummaryItem label="All" value={files.length} compact={isAndroidApp} />
            <SummaryItem label="Images" value={imageCount} compact={isAndroidApp} />
            <SummaryItem label="Videos" value={videoCount} compact={isAndroidApp} />
            <SummaryItem label="Docs" value={documentCount} compact={isAndroidApp} />
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div
        className={[
          "mt-4 grid gap-3",
          isAndroidApp ? "grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-5",
        ].join(" ")}
      >
        <QuickLink
          to="/files"
          label="All files"
          description={isAndroidApp ? "Browse" : "Browse everything"}
          icon={<FolderIcon />}
          android={isAndroidApp}
        />

        <QuickLink
          to="/vault"
          label="Private vault"
          description={isAndroidApp ? "Locked" : "Protected files"}
          icon={<VaultIcon />}
          android={isAndroidApp}
        />

        <QuickLink
          to="/files?type=image"
          label="Images"
          description={isAndroidApp ? "Photos" : "Photos and graphics"}
          icon={<ImageIcon />}
          android={isAndroidApp}
        />

        <QuickLink
          to="/files?type=video"
          label="Videos"
          description={isAndroidApp ? "Clips" : "Video files"}
          icon={<VideoIcon />}
          android={isAndroidApp}
        />

        {!isAndroidApp && (
          <QuickLink
            to="/files?type=document"
            label="Documents"
            description="PDFs and docs"
            icon={<DocumentIcon />}
            android={isAndroidApp}
          />
        )}
      </div>

      {/* Recent Files */}
      <div
        className={[
          "mt-6 overflow-hidden border bg-white shadow-sm",
          isAndroidApp
            ? "rounded-[2rem] border-slate-100"
            : "rounded-2xl border-slate-200",
        ].join(" ")}
      >
        <div
          className={[
            "flex items-center justify-between border-b",
            isAndroidApp
              ? "border-slate-100 px-5 py-4"
              : "border-slate-200 px-5 py-4",
          ].join(" ")}
        >
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Recent files
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Latest files added to your vault
            </p>
          </div>

          <Link
            to="/files"
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-50"
          >
            View all
            <ArrowIcon />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentFiles.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
                <FolderIcon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-950">
                No files yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Upload your first file to start using SafeVault.
              </p>

              <button
                type="button"
                onClick={handleUploadClick}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
              >
                <UploadIcon />
                Upload file
              </button>
            </div>
          )}

          {recentFiles.map((file) => {
            const canPreview =
              file.type?.startsWith("image") || file.type?.startsWith("video");

            return (
              <button
                type="button"
                key={file._id}
                onClick={() => {
                  if (canPreview) {
                    setPreviewFile(file);
                  }
                }}
                className={[
                  "flex w-full items-center justify-between gap-4 text-left transition",
                  isAndroidApp
                    ? "px-5 py-4 active:bg-slate-50"
                    : "px-5 py-3.5 hover:bg-slate-50",
                ].join(" ")}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileTypeIcon file={file} />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {file.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {canPreview ? "Preview available" : "Stored securely"}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <span className="hidden text-xs text-slate-500 sm:inline">
                    {formatSize(file.size)}
                  </span>

                  <span className="text-slate-300">
                    <ArrowIcon />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Android Bottom Navigation */}
      {isAndroidApp && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 px-4 pb-4 pt-3 shadow-[0_-16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
           <BottomNavItem to="/dashboard" label="Home" active icon={<HomeIcon />} />
<BottomNavItem to="/files" label="Files" icon={<DocumentIcon />} />
<BottomNavItem to="/vault" label="Vault" icon={<VaultIcon />} />
<BottomNavItem to="/account" label="Account" icon={<UserIcon />} />
          </div>
        </div>
      )}

      

      {/* Upload HUD */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={[
              "fixed left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm border bg-white p-4 shadow-lg",
              isAndroidApp
                ? "bottom-24 rounded-[1.5rem] border-blue-100"
                : "bottom-6 rounded-xl border-slate-200",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Uploading
                </p>
                <p className="text-xs text-slate-500">
                  {uploadProgress}% complete
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <UploadIcon />
              </div>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
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
            className={[
              "fixed z-50 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg",
              isAndroidApp ? "bottom-24 left-4 right-4 text-center" : "bottom-6 right-4",
              toast.toLowerCase().includes("failed")
                ? "bg-red-600"
                : "bg-blue-600",
            ].join(" ")}
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

{showUploadOptions &&
  (isAndroidApp || isMobileDevice) &&
  createPortal(
    <div
  className={[
    "fixed inset-0 z-[9999] flex justify-center bg-slate-950/40 px-3 backdrop-blur-[2px]",
    isAndroidApp
      ? "items-end pb-3 sm:items-center sm:p-4"
      : "items-center p-3 sm:p-4",
  ].join(" ")}
  onClick={() => setShowUploadOptions(false)}
>
    <div
      className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_-10px_50px_rgba(15,23,42,0.25)]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3">
        <div className="h-1.5 w-11 rounded-full bg-slate-200" />
      </div>

      {/* Header */}
      <div className="px-6 pb-5 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-bold tracking-tight text-slate-950">
              Upload to SafeVault
            </p>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Choose where you want to upload from
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-200">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16V4m0 0L7 9m5-5 5 5M5 15v3a2 2 0 002 2h10a2 2 0 002-2v-3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 px-4 pb-4">
        {/* Photos */}
        <button
          type="button"
          onClick={() => {
            setShowUploadOptions(false);
            openMediaPicker();
          }}
          className="group flex w-full items-center gap-4 rounded-[1.5rem] border border-slate-100 bg-gradient-to-r from-blue-50/90 to-indigo-50/60 p-4 text-left shadow-sm transition-all duration-200 active:scale-[0.98]"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
            <svg
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3" y="4" width="18" height="16" rx="3" />
              <circle cx="8.5" cy="9" r="1.5" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4 17 4.5-4.5a2 2 0 012.8 0l2.2 2.2 1.5-1.5a2 2 0 012.8 0L21 16.5"
              />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-slate-900">
              Photos & Videos
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Choose memories from your gallery
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition-transform duration-200 group-active:translate-x-1">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 18 6-6-6-6"
              />
            </svg>
          </div>
        </button>

        {/* Files */}
        <button
          type="button"
          onClick={() => {
            setShowUploadOptions(false);
            openFilePicker();
          }}
          className="group flex w-full items-center gap-4 rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-4 text-left shadow-sm transition-all duration-200 active:scale-[0.98]"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-lg shadow-purple-200">
            <svg
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"
              />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-slate-900">
              Files & Documents
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              PDFs, documents, audio and more
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition-transform duration-200 group-active:translate-x-1">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 18 6-6-6-6"
              />
            </svg>
          </div>
        </button>
      </div>

      {/* Privacy hint */}
      <div className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
        <svg
          className="h-4 w-4 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          />
        </svg>

        <span className="text-xs font-medium text-slate-500">
          Your files stay private and protected
        </span>
      </div>

      {/* Cancel */}
      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={() => setShowUploadOptions(false)}
          className="w-full rounded-2xl py-3.5 text-sm font-semibold text-slate-500 transition active:scale-[0.98] active:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
    </div>,
  document.body
)}
    </div>
  );
}

function SummaryItem({ label, value, compact = false }) {
  return (
    <div
      className={[
        "border bg-slate-50",
        compact
          ? "rounded-2xl px-2 py-3 text-center"
          : "rounded-xl border-slate-200 px-4 py-3",
      ].join(" ")}
    >
      <p
        className={[
          "font-medium text-slate-500",
          compact ? "text-[10px]" : "text-xs",
        ].join(" ")}
      >
        {label}
      </p>
      <p
        className={[
          "font-bold text-slate-950",
          compact ? "mt-1 text-lg" : "mt-1 text-xl",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function QuickLink({ to, label, description, icon, android = false }) {
  return (
    <Link
      to={to}
      className={[
        "group border bg-white shadow-sm transition",
        android
          ? "rounded-[1.5rem] border-slate-100 p-4 active:scale-[0.98] active:bg-blue-50"
          : "rounded-2xl border-slate-200 p-4 hover:border-blue-200 hover:bg-blue-50/40",
      ].join(" ")}
    >
      <div
        className={[
          "flex gap-3",
          android ? "flex-col" : "items-start justify-between",
        ].join(" ")}
      >
        <div className={["flex min-w-0", android ? "flex-col gap-3" : "gap-3"].join(" ")}>
          <div
            className={[
              "flex shrink-0 items-center justify-center border bg-slate-50 text-slate-600 group-hover:border-blue-200 group-hover:bg-white group-hover:text-blue-700",
              android ? "h-11 w-11 rounded-2xl" : "h-9 w-9 rounded-lg",
            ].join(" ")}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-950">{label}</p>
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          </div>
        </div>

        {!android && (
          <span className="mt-1 text-slate-300 group-hover:text-blue-600">
            <ArrowIcon />
          </span>
        )}
      </div>
    </Link>
  );
}

function BottomNavItem({ to, label, icon, active = false }) {
  return (
    <Link
      to={to}
      className={[
        "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold active:bg-blue-50",
        active ? "text-blue-600" : "text-slate-400",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-8 w-8 place-items-center rounded-2xl",
          active ? "bg-blue-50 text-blue-600" : "text-slate-400",
        ].join(" ")}
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}

function HomeIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 11l9-8 9 8" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10v10h14V10" />
    </svg>
  );
}

function UserIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 21a8 8 0 10-16 0" />
      <circle cx="12" cy="8" r="4" strokeWidth="2" />
    </svg>
  );
}