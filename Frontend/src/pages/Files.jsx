import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import Breadcrumb from "../components/Breadcrumb";
import FileRow from "../components/FileRow";
import FileGridItem from "../components/FileGridItem";
import ImagePreview from "../components/ImagePreview";
import { moveToTrash, getFiles, createFolder } from "../utils/api";
import { API_BASE } from "../utils/api";
import { trackFirstFileUpload } from "../utils/analytics";
import { vaultFile } from "../utils/api";

function BackIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function UploadIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 16V8m0 0l-3 3m3-3l3 3M4 16.5A4.5 4.5 0 018.5 12H9a6 6 0 1111 3.5"
      />
    </svg>
  );
}

function FolderPlusIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8.5a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11v5m-2.5-2.5h5" />
    </svg>
  );
}

function FolderIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8.5a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  );
}

function VaultIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11V8a5 5 0 0110 0v3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 11h12v9H6v-9z" />
    </svg>
  );
}

function TrashIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 7h12M10 11v6M14 11v6M9 7V5h6v2M8 7l1 13h6l1-13" />
    </svg>
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

function ViewIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function GridIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h7v7H4V4zM13 4h7v7h-7V4zM4 13h7v7H4v-7zM13 13h7v7h-7v-7z" />
    </svg>
  );
}

export default function Files({ initialMode = "files" }) {
  const navigate = useNavigate();
  const isAndroidApp = Capacitor.getPlatform() === "android";

  const [searchParams] = useSearchParams();
  const folderFromURL = searchParams.get("folder");
  const filterType = searchParams.get("type");

  const fileInputRef = useRef(null);

  const [history, setHistory] = useState(folderFromURL ? [null, folderFromURL] : [null]);
  const [historyIndex, setHistoryIndex] = useState(folderFromURL ? 1 : 0);

  const currentFolder = history[historyIndex];
  const [confirm, setConfirm] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  const [view, setView] = useState("list");
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState(initialMode);

  const [preview, setPreview] = useState(null);
  const [slideDir, setSlideDir] = useState("forward");

  const [selected, setSelected] = useState(new Set());

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const isSelected = (id) => selected.has(id);

  const navigateToFolder = (folderId) => {
    setSlideDir("forward");
    const next = history.slice(0, historyIndex + 1);
    setHistory([...next, folderId]);
    setHistoryIndex(next.length);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setSlideDir("back");
      setHistoryIndex(historyIndex - 1);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setSlideDir("forward");
      setHistoryIndex(historyIndex + 1);
    }
  };

  const goToParent = () => {
    if (historyIndex > 0) goBack();
  };

  const goToRoot = () => {
    setHistory([null]);
    setHistoryIndex(0);
    navigate("/files");
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "[") {
        e.preventDefault();
        goBack();
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "]") {
        e.preventDefault();
        goForward();
      }

      if (e.key === "Backspace") {
        goToParent();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    const load = async () => {
      if (mode === "trash") {
        const res = await fetch(`${API_BASE}/files/trash`, {
          credentials: "include",
        });
        const data = await res.json();
        setFiles(data);
      } else {
        const query = currentFolder ? `?parent=${currentFolder}` : "";
        const data = await getFiles(query);
        setFiles(data);
      }
    };

    load();
  }, [currentFolder, mode]);

  useEffect(() => {
    setSelected(new Set());
  }, [currentFolder, mode]);

  useEffect(() => {
    if (filterType === "image" || filterType === "video") {
      setView("grid");
    } else {
      setView("list");
    }
  }, [filterType]);

  const filteredFiles =
    mode === "trash"
      ? files
      : files.filter((file) => {
          if (!filterType) return true;
          if (filterType === "image") return file.type?.startsWith("image");
          if (filterType === "video") return file.type?.startsWith("video");
          if (filterType === "document") {
            return (
              file.type?.includes("pdf") ||
              file.type?.includes("word") ||
              file.type?.includes("officedocument")
            );
          }
          return true;
        });

  const previewFiles = files.filter(
    (f) => !f.isFolder && (f.type?.startsWith("image") || f.type?.startsWith("video"))
  );




  const uploadSelectedFiles = (selectedFiles) => {
  if (!selectedFiles.length) return;

  let index = 0;

const uploadNext = async () => {
  if (index >= selectedFiles.length) {
  setUploading(false);
  setUploadProgress(0);

  // Track the user's first successful upload.
  // Only fire when they had no files before this upload.
  if (files.length === 0 && selectedFiles.length > 0) {
    await trackFirstFileUpload(
      selectedFiles[0]?.type || "unknown"
    );
  }

  reloadFiles();
  return;
}

    const file = selectedFiles[index++];
    uploadSingleFile(file, uploadNext);
  };

  uploadNext();
};

const openMediaPicker = async () => {
  try {
    const result = await FilePicker.pickMedia({
      limit: 0,
    });

    if (!result.files?.length) return;

    const selectedFiles = [];

    for (const pickedFile of result.files) {
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

        selectedFiles.push(
          new File(
            [blob],
            pickedFile.name || "upload",
            {
              type:
                pickedFile.mimeType ||
                blob.type ||
                "application/octet-stream",
            }
          )
        );
      } catch (error) {
        console.error("Failed to prepare media:", error);
      }
    }

    uploadSelectedFiles(selectedFiles);
  } catch (error) {
    console.error("Media picker cancelled or failed:", error);
  }
};

const openFilePicker = async () => {
  try {
    const result = await FilePicker.pickFiles({
      limit: 0,
    });

    if (!result.files?.length) return;

    const selectedFiles = [];

    for (const pickedFile of result.files) {
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

        selectedFiles.push(
          new File(
            [blob],
            pickedFile.name || "upload",
            {
              type:
                pickedFile.mimeType ||
                blob.type ||
                "application/octet-stream",
            }
          )
        );
      } catch (error) {
        console.error("Failed to prepare file:", error);
      }
    }

    uploadSelectedFiles(selectedFiles);
  } catch (error) {
    console.error("File picker cancelled or failed:", error);
  }
};






 const handleFileSelected = (e) => {
  const selectedFiles = Array.from(e.target.files);

  if (!selectedFiles.length) return;

  uploadSelectedFiles(selectedFiles);

  e.target.value = null;
};


  const reloadFiles = async () => {
    const data = await getFiles(currentFolder ? `?parent=${currentFolder}` : "");
    setFiles(data);
  };

  const uploadSingleFile = (file, onDone) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("file", file);
    if (currentFolder) formData.append("parent", currentFolder);

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
      if (xhr.status < 200 || xhr.status >= 300) {
        setUploading(false);
        setUploadProgress(0);
        setUploadError("Upload failed (storage full or file rejected)");
        return;
      }

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

      setTimeout(() => {
        setUploadError("");
        onDone();
      }, 400);
    };

    xhr.onerror = () => {
      setUploading(false);
      setUploadProgress(0);
      setUploadError("Network error during upload");
    };

    xhr.open("POST", `${API_BASE}/files/upload`);
    xhr.withCredentials = true;
    xhr.send(formData);
  };

  const handleDelete = async (id) => {
    await moveToTrash(id);

    const data = await getFiles(currentFolder ? `?parent=${currentFolder}` : "");
    setFiles(data);
  };

  const restoreFile = async (id) => {
    await fetch(`${API_BASE}/files/trash/${id}/restore`, {
      method: "POST",
      credentials: "include",
    });
    setFiles((prev) => prev.filter((f) => f._id !== id));
  };

  const deleteForever = async (id) => {
    await fetch(`${API_BASE}/files/trash/${id}/permanent`, {
      method: "DELETE",
      credentials: "include",
    });
    setFiles((prev) => prev.filter((f) => f._id !== id));
  };

  const selectedIds = Array.from(selected);
  window.__cloudboxSelectionActive = selectedIds.length > 0;

  const clearSelection = () => setSelected(new Set());

  const selectAll = () => {
    const allowed = filteredFiles.filter((f) => {
      if (mode === "files") return !f.isFolder;
      return true;
    });

    setSelected(new Set(allowed.map((f) => f._id)));
  };

  const selectedFiles = filteredFiles.filter((f) => selected.has(f._id));
  const hasFolders = selectedFiles.some((f) => f.isFolder);

  const bulkDelete = () => {
    setConfirm({
      title: `Delete ${selectedIds.length} files?`,
      message: "These files will be moved to Trash.",
      action: async () => {
        for (const id of selectedIds) {
          await moveToTrash(id);
        }

        const data = await getFiles(currentFolder ? `?parent=${currentFolder}` : "");
        setFiles(data);
        clearSelection();
        setConfirm(null);
      },
    });
  };

  const bulkVault = () => {
    setConfirm({
      title: `Move ${selectedIds.length} files to Vault?`,
      message: "These files will be hidden and protected by your vault PIN.",
      action: async () => {
        for (const id of selectedIds) {
          await vaultFile(id);
        }

        setFiles((prev) => prev.filter((f) => !selected.has(f._id)));
        clearSelection();
        setConfirm(null);
      },
    });
  };

  const bulkRestore = async () => {
    for (const id of selectedIds) {
      await fetch(`${API_BASE}/files/trash/${id}/restore`, {
        method: "POST",
        credentials: "include",
      });
    }

    setFiles((prev) => prev.filter((f) => !selected.has(f._id)));
    clearSelection();
  };

  const bulkDeleteForever = () => {
    setConfirm({
      title: `Permanently delete ${selectedIds.length} files?`,
      message: "This cannot be undone.",
      action: async () => {
        for (const id of selectedIds) {
          await fetch(`${API_BASE}/files/trash/${id}/permanent`, {
            method: "DELETE",
            credentials: "include",
          });
        }

        setFiles((prev) => prev.filter((f) => !selected.has(f._id)));
        clearSelection();
        setConfirm(null);
      },
    });
  };

  const breadcrumb = history
    .slice(1)
    .map((id) => files.find((f) => f._id === id))
    .filter(Boolean);

  const pageTitle =
    mode === "trash"
      ? "Trash"
      : filterType === "image"
      ? "Images"
      : filterType === "video"
      ? "Videos"
      : filterType === "document"
      ? "Documents"
      : "All files";

  const pageDescription =
    mode === "trash"
      ? "Restore or permanently delete removed files."
      : currentFolder
      ? "Browsing inside your cloud folder."
      : "Browse and manage your cloud files.";

  return (
    <>
      <div
        className={[
          "min-h-full",
          isAndroidApp
            ? "bg-gradient-to-b from-sky-50 via-white to-white px-4 pb-28 pt-5"
            : "bg-slate-50 px-4 py-5 sm:px-6 lg:px-8 lg:py-7",
        ].join(" ")}
      >
        <main className="mx-auto h-full max-w-7xl">
          {/* Header */}
          <div
            className={[
              "mb-5",
              isAndroidApp
                ? ""
                : "rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl",
            ].join(" ")}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <Link
                  to="/dashboard"
                  className={[
                    "mb-3 inline-flex w-fit items-center gap-2 text-sm font-semibold transition",
                    isAndroidApp
                      ? "rounded-full bg-white px-3 py-2 text-blue-600 shadow-sm active:scale-95"
                      : "text-blue-600 hover:text-blue-700",
                  ].join(" ")}
                >
                  <BackIcon />
                  Dashboard
                </Link>

                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-500">
                  SafeVault Cloud
                </p>

                <h1
                  className={[
                    "mt-2 font-bold tracking-tight text-slate-950",
                    isAndroidApp ? "text-3xl" : "text-2xl sm:text-3xl",
                  ].join(" ")}
                >
                  {pageTitle}
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {pageDescription}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={goBack}
                  disabled={historyIndex <= 0}
                  className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-30"
                  title="Back"
                >
                  <BackIcon />
                </button>

                <button
                  onClick={goForward}
                  disabled={historyIndex >= history.length - 1}
                  className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-30"
                  title="Forward"
                >
                  <ArrowIcon />
                </button>

                <button
                  onClick={goToParent}
                  disabled={historyIndex <= 0}
                  className="hidden h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-30 sm:inline-flex"
                >
                  Up
                </button>

                {currentFolder && (
                  <button
                    onClick={goToRoot}
                    className="hidden h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 sm:inline-flex"
                  >
                    Root
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5">
              <Breadcrumb path={breadcrumb} onNavigate={navigateToFolder} />
            </div>
          </div>

          {/* Toolbar */}
          {selected.size === 0 ? (
            <div
              className={[
                "mb-5 flex flex-col gap-3 rounded-[1.5rem] border bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between",
                isAndroidApp ? "border-slate-100" : "border-slate-200",
              ].join(" ")}
            >
              <div className="flex flex-wrap items-center gap-2">
                <ViewToggle view={view} setView={setView} />

                <span className="hidden h-8 w-px bg-slate-100 sm:block" />

                <Link
                  to="/files"
                  className={[
                    "rounded-2xl px-3 py-2 text-sm font-semibold transition",
                    !filterType && mode === "files"
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  All
                </Link>

                <Link
                  to="/files?type=image"
                  className={[
                    "rounded-2xl px-3 py-2 text-sm font-semibold transition",
                    filterType === "image"
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  Images
                </Link>

                <Link
                  to="/files?type=video"
                  className={[
                    "rounded-2xl px-3 py-2 text-sm font-semibold transition",
                    filterType === "video"
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  Videos
                </Link>

                <Link
                  to="/files?type=document"
                  className={[
                    "rounded-2xl px-3 py-2 text-sm font-semibold transition",
                    filterType === "document"
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  Docs
                </Link>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {mode === "files" && (
                  <>
                    <button
                      onClick={async () => {
                        const name = prompt("Folder name");
                        if (!name) return;
                        await createFolder(name, currentFolder);
                        const data = await getFiles(
                          currentFolder ? `?parent=${currentFolder}` : ""
                        );
                        setFiles(data);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      <FolderPlusIcon />
                      New Folder
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      className="hidden"
                      onChange={handleFileSelected}
                    />

                    <button
                      onClick={() => setShowUploadOptions(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
                    >
                      <UploadIcon />
                      Upload
                    </button>
                  </>
                )}

                {mode === "trash" && files.length > 0 && (
                  <button
                    onClick={async () => {
                      if (!window.confirm("Permanently delete all items in trash?")) return;
                      await fetch(`${API_BASE}/files/trash`, {
                        method: "DELETE",
                        credentials: "include",
                      });
                      setFiles([]);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
                  >
                    <TrashIcon />
                    Empty Trash
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-5 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-3 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-blue-950">
                    {selected.size} selected
                  </p>
                  <p className="text-xs text-blue-700/70">
                    Choose what you want to do with these files.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={selectAll}
                    className="rounded-2xl border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    Select all
                  </button>

                  <button
                    onClick={clearSelection}
                    className="rounded-2xl border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-slate-500 shadow-sm hover:bg-slate-50"
                  >
                    Clear
                  </button>

                  {mode === "files" && (
                    <>
                      <button
                        onClick={bulkVault}
                        disabled={hasFolders}
                        className={[
                          "rounded-2xl px-3 py-2 text-sm font-semibold shadow-sm transition",
                          hasFolders
                            ? "cursor-not-allowed bg-slate-100 text-slate-400"
                            : "bg-slate-950 text-white hover:bg-slate-800",
                        ].join(" ")}
                      >
                        Move to Vault
                      </button>

                      <button
                        onClick={bulkDelete}
                        className="rounded-2xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </>
                  )}

                  {mode === "trash" && (
                    <>
                      <button
                        onClick={bulkRestore}
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                      >
                        Restore
                      </button>

                      <button
                        onClick={bulkDeleteForever}
                        className="rounded-2xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50"
                      >
                        Delete Forever
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div
            className={`transition-all duration-300 ${
              slideDir === "forward" ? "animate-slide-left" : "animate-slide-right"
            }`}
          >
            {filteredFiles.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-100 bg-white px-6 py-14 text-center shadow-sm">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-blue-50 text-blue-700">
                  {mode === "trash" ? <TrashIcon className="h-6 w-6" /> : <FolderIcon className="h-6 w-6" />}
                </div>

                <h3 className="mt-5 text-base font-bold text-slate-950">
                  {mode === "trash" ? "Trash is empty" : "No files here yet"}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  {mode === "trash"
                    ? "Deleted files will appear here before they are permanently removed."
                    : "Upload files or create a folder to start organizing your cloud storage."}
                </p>

                {mode === "files" && (
                  <button
                    onClick={() => setShowUploadOptions(true)}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
                  >
                    <UploadIcon />
                    Upload file
                  </button>
                )}
              </div>
            ) : view === "list" ? (
              <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
                {filteredFiles.map((file) => (
                  <FileRow
                    key={file._id}
                    file={file}
                    selected={isSelected(file._id)}
                    onSelect={() => toggleSelect(file._id)}
                    onPreview={(file) => {
                      if (!file.isFolder) setPreview(file);
                    }}
                    onDelete={mode === "trash" ? deleteForever : handleDelete}
                    onRestore={mode === "trash" ? restoreFile : null}
                    onVault={
                      mode === "files" && !file.isFolder
                        ? async (id) => {
                            try {
                              await vaultFile(id);
                              setFiles((prev) => prev.filter((f) => f._id !== id));
                            } catch (err) {
                              if (err?.message === "Vault locked") {
                                setConfirm({
                                  title: "Vault is locked",
                                  message:
                                    "Your vault is currently locked. Unlock it before moving files into it.",
                                  action: () => {
                                    navigate("/vault");
                                    setConfirm(null);
                                  },
                                  confirmLabel: "Go to Vault",
                                });
                              } else {
                                alert("Failed to move file to vault");
                              }
                            }
                          }
                        : null
                    }
                    onOpenFolder={(id) => navigateToFolder(id)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
                {filteredFiles.map((file) => (
                  <FileGridItem
                    key={file._id}
                    file={file}
                    selected={isSelected(file._id)}
                    onSelect={() => toggleSelect(file._id)}
                    onPreview={(file) => {
                      if (!file.isFolder) setPreview(file);
                    }}
                    onOpenFolder={(id) => navigateToFolder(id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Android Bottom Navigation */}
          {isAndroidApp && (
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 px-4 pb-4 pt-3 shadow-[0_-16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
               <BottomNavItem to="/dashboard" label="Home" icon={<HomeIcon />} />
<BottomNavItem to="/files" label="Files" active icon={<FolderIcon />} />
<BottomNavItem to="/vault" label="Vault" icon={<VaultIcon />} />
<BottomNavItem to="/account" label="Account" icon={<UserIcon />} />
              </div>
            </div>
          )}

          {uploading && (
            <div
              className={[
                "fixed left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-[1.5rem] border border-blue-100 bg-white p-4 text-sm text-slate-700 shadow-2xl",
                isAndroidApp ? "bottom-24" : "bottom-6",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-950">Uploading…</p>
                  <p className="text-xs text-slate-500">{uploadProgress}% complete</p>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                  <UploadIcon />
                </div>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {uploadError && (
            <div
              className={[
                "fixed left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl bg-red-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-xl",
                isAndroidApp ? "bottom-24" : "bottom-20",
              ].join(" ")}
            >
              {uploadError}
            </div>
          )}
        </main>

        {confirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-[2rem] bg-white p-5 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-950">{confirm.title}</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {confirm.message}
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setConfirm(null)}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={confirm.action}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold text-white ${
                    confirm.confirmLabel
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {confirm.confirmLabel || "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>


        {showUploadOptions && (
  <div
    className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/40 p-3 backdrop-blur-[2px] sm:items-center"
    onClick={() => setShowUploadOptions(false)}
  >
    <div
      className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.28)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 pb-5 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <UploadIcon className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-950">
              Upload to SafeVault
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Choose what you want to upload
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowUploadOptions(false)}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-lg text-slate-400 shadow-sm transition hover:bg-white hover:text-slate-700"
          >
            ×
          </button>
        </div>
      </div>

      <div className="space-y-3 px-5 py-5">
        <button
          type="button"
          onClick={() => {
            setShowUploadOptions(false);
            openMediaPicker();
          }}
          className="group flex w-full items-center gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/70 to-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl shadow-lg shadow-blue-500/20">
            🖼️
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-bold text-slate-900">
              Photos & Videos
            </div>

            <div className="mt-1 text-sm text-slate-500">
              Choose from your gallery
            </div>
          </div>

          <ArrowIcon className="h-5 w-5 text-blue-400 transition group-hover:translate-x-1" />
        </button>

        <button
          type="button"
          onClick={() => {
            setShowUploadOptions(false);
            openFilePicker();
          }}
          className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
            📁
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-bold text-slate-900">
              Files & Documents
            </div>

            <div className="mt-1 text-sm text-slate-500">
              PDFs, audio, documents and more
            </div>
          </div>

          <ArrowIcon className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1" />
        </button>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3">
        <button
          type="button"
          onClick={() => setShowUploadOptions(false)}
          className="w-full rounded-xl py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-800"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}





      <ImagePreview
        files={previewFiles}
        activeFile={preview}
        onClose={() => setPreview(null)}
      />
    </>
  );
}

function ViewToggle({ view, setView }) {
  return (
    <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
      <button
        onClick={() => setView("list")}
        className={[
          "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold transition",
          view === "list" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-900",
        ].join(" ")}
      >
        <ViewIcon />
        List
      </button>

      <button
        onClick={() => setView("grid")}
        className={[
          "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold transition",
          view === "grid" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-900",
        ].join(" ")}
      >
        <GridIcon />
        Grid
      </button>
    </div>
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

function UserIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 21a8 8 0 10-16 0" />
      <circle cx="12" cy="8" r="4" strokeWidth="2" />
    </svg>
  );
}