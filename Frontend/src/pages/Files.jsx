import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import FileRow from "../components/FileRow";
import FileGridItem from "../components/FileGridItem";
import ImagePreview from "../components/ImagePreview";
import { moveToTrash, getFiles, createFolder } from "../utils/api";
import { API_BASE } from "../utils/api";
import { uploadFile } from "../utils/api";
import { vaultFile } from "../utils/api";








export default function Files() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const folderFromURL = searchParams.get("folder");
  const filterType = searchParams.get("type");


  const fileInputRef = useRef(null);

  /* ---------------- NAV STATE ---------------- */

  const [history, setHistory] = useState(
    folderFromURL ? [null, folderFromURL] : [null]
  );
  const [historyIndex, setHistoryIndex] = useState(
    folderFromURL ? 1 : 0
  );

  const currentFolder = history[historyIndex];
  const [confirm, setConfirm] = useState(null);


  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);


  const [uploading, setUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);

const [uploadError, setUploadError] = useState("");


  /* ---------------- UI STATE ---------------- */

  

  const [view, setView] = useState("list");
  

  const [files, setFiles] = useState([]);

  const [mode, setMode] = useState("files"); // files | trash

  const [preview, setPreview] = useState(null);
  const [slideDir, setSlideDir] = useState("forward"); // animation

  const [selected, setSelected] = useState(new Set());

  const toggleSelect = (id) => {
  setSelected((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
};

const isSelected = (id) => selected.has(id);



  /* ---------------- NAV HELPERS ---------------- */

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

  /* ---------------- KEYBOARD ---------------- */

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

  /* ---------------- DATA ---------------- */

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


  /* ---------------- FILTER ---------------- */

  const filteredFiles =
  mode === "trash"
    ? files
    : files.filter((file) => {
        if (!filterType) return true;
        if (filterType === "image") return file.type?.startsWith("image");
        if (filterType === "video") return file.type?.startsWith("video");
        if (filterType === "document")
          return (
            file.type?.includes("pdf") ||
            file.type?.includes("word") ||
            file.type?.includes("officedocument")
          );
        return true;
      });


  const previewFiles = files.filter(
  (f) =>
    !f.isFolder &&
    (f.type?.startsWith("image") || f.type?.startsWith("video"))
);



  /* ---------------- ACTIONS ---------------- */

  const handleFileSelected = (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  let index = 0;

  const uploadNext = () => {
    if (index >= files.length) {
      setUploading(false);
      setUploadProgress(0);
      reloadFiles();
      return;
    }

    const file = files[index++];
    uploadSingleFile(file, uploadNext);
  };

  uploadNext();
  e.target.value = null;
};


const reloadFiles = async () => {
  const data = await getFiles(
    currentFolder ? `?parent=${currentFolder}` : ""
  );
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

  const data = await getFiles(
    currentFolder ? `?parent=${currentFolder}` : ""
  );
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

const clearSelection = () => setSelected(new Set());

const selectAll = () => {
  const allowed = filteredFiles.filter(f => {
    if (mode === "files") return !f.isFolder; // only files can be bulk-vaulted
    return true; // trash allows everything
  });

  setSelected(new Set(allowed.map(f => f._id)));
};


const selectedFiles = filteredFiles.filter(f => selected.has(f._id));
const hasFolders = selectedFiles.some(f => f.isFolder);



const bulkDelete = () => {
  setConfirm({
    title: `Delete ${selectedIds.length} files?`,
    message: "These files will be moved to Trash.",
    action: async () => {
      for (const id of selectedIds) {
        await moveToTrash(id);
      }

      const data = await getFiles(
        currentFolder ? `?parent=${currentFolder}` : ""
      );
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

      setFiles(prev => prev.filter(f => !selected.has(f._id)));
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

  setFiles(prev => prev.filter(f => !selected.has(f._id)));
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

      setFiles(prev => prev.filter(f => !selected.has(f._id)));
      clearSelection();
      setConfirm(null);
    },
  });
};




















  /* ---------------- BREADCRUMB ---------------- */

  const breadcrumb = history
    .slice(1)
    .map((id) => files.find((f) => f._id === id))
    .filter(Boolean);

  /* ---------------- RENDER ---------------- */

  return (
    <>
      

      <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">

       <Sidebar
  onAllFiles={() => {
    setMode("files");
    goToRoot();
  }}
  onTrash={() => {
    setMode("trash");
    setHistory([null]);
    setHistoryIndex(0);
    navigate("/files");
  }}
  onVault={() => navigate("/vault")}
/>

        {/* Mobile sidebar */}
{mobileSidebarOpen && (
  <div className="fixed inset-0 z-50 md:hidden">
    {/* backdrop */}
    <div
      className="absolute inset-0 bg-black/30"
      onClick={() => setMobileSidebarOpen(false)}
    />

    {/* drawer */}
    <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
      <Sidebar
  forceOpen
  onAllFiles={() => {
    setMode("files");
    goToRoot();
    setMobileSidebarOpen(false);
  }}
  onTrash={() => {
    setMode("trash");
    setHistory([null]);
    setHistoryIndex(0);
    navigate("/files");
    setMobileSidebarOpen(false);
  }}
  onVault={() => {
    navigate("/vault");
    setMobileSidebarOpen(false);
  }}
/>

    </div>
  </div>
)}
        


        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 overflow-x-hidden">

          {/* Mobile header */}
<div className="flex items-center gap-3 mb-4 md:hidden">
  <button
    onClick={() => setMobileSidebarOpen(true)}
    className="
      p-2
      rounded-lg
      border
      border-gray-200
      bg-white
      hover:bg-blue-50
      hover:border-blue-200
      transition
    "
    aria-label="Open menu"
  >
    <svg
      className="w-5 h-5 text-gray-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>

  <span className="text-sm font-medium text-gray-700">
    Files
  </span>
</div>


          <Breadcrumb path={breadcrumb} onNavigate={navigateToFolder} />

          

          <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={goBack}
                disabled={historyIndex <= 0}
                className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-30"
              >
                ←
              </button>
              <button
                onClick={goForward}
                disabled={historyIndex >= history.length - 1}
                className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-30"
              >
                →
              </button>
              <button
                onClick={goToParent}
                disabled={historyIndex <= 0}
                className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-30"
              >
                ↑
              </button>
            </div>

            


            {mode === "files" && (
  <div className="flex items-center gap-3">

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
                className="border px-4 py-2 rounded text-sm hover:bg-gray-50"
              >
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
                onClick={() => fileInputRef.current.click()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Upload
              </button>
              </div>
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

    className="border px-4 py-2 rounded text-sm text-red-600 hover:bg-red-50"
  >
    Empty Trash
  </button>
)}




                <div className="flex gap-2">
  <button
    onClick={() => setView("list")}
    className={`px-3 py-1 border rounded text-sm ${
      view === "list" ? "bg-gray-200" : ""
    }`}
  >
    List
  </button>

  <button
    onClick={() => setView("grid")}
    className={`px-3 py-1 border rounded text-sm ${
      view === "grid" ? "bg-gray-200" : ""
    }`}
  >
    Grid
  </button>
</div>




          {selected.size > 0 && (
<div className="mb-4 p-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-3">
    <div className="text-sm font-medium text-gray-700">

      {selected.size} selected
    </div>

    <div className="flex flex-wrap gap-2">
      <button
        onClick={selectAll}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
      >
        Select all
      </button>

      <button
        onClick={clearSelection}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-600"
      >
        Clear
      </button>

      {mode === "files" && (
        <>
          <button
  onClick={bulkVault}
  disabled={hasFolders}
  className={`px-3 py-1.5 text-sm rounded-md border transition
    ${
      hasFolders
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        : "bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
    }
  `}
>
  Move to Vault
</button>



          <button
            onClick={bulkDelete}
            className="px-3 py-1.5 text-sm rounded-md border border-red-300 text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </>
      )}

      {mode === "trash" && (
        <>
          <button
            onClick={bulkRestore}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Restore
          </button>

          <button
            onClick={bulkDeleteForever}
            className="px-3 py-1.5 text-sm rounded-md border border-red-300 text-red-600 hover:bg-red-50"
          >
            Delete Forever
          </button>
        </>
      )}
    </div>
  </div>
)}





    





          </div>

          <div
            className={`transition-all duration-300 ${
              slideDir === "forward"
                ? "animate-slide-left"
                : "animate-slide-right"
            }`}
          >
            {filteredFiles.length === 0 ? (
              <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
                No files here yet
              </div>
            ) : view === "list" ? (
              <div className="bg-white border rounded-xl">
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
          await vaultFile(id);

          setFiles((prev) => prev.filter((f) => f._id !== id));
        }
      : null
  }
            onOpenFolder={(id) => navigateToFolder(id)}
          />

                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">

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



            {uploading && (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border shadow-xl rounded-full px-6 py-3 text-sm text-gray-700 z-50">
    Uploading… {uploadProgress}%
  </div>
)}

{uploadError && (
  <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-red-600 text-white px-5 py-2 rounded-lg text-sm shadow-xl z-50">
    {uploadError}
  </div>
)}










        </main>

              {confirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-5">
      <h3 className="text-lg font-semibold mb-2">
        {confirm.title}
      </h3>

      <p className="text-sm text-gray-600 mb-5">
        {confirm.message}
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setConfirm(null)}
          className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={confirm.action}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}





      </div>

      <ImagePreview
  files={previewFiles}
  activeFile={preview}
  onClose={() => setPreview(null)}
/>

    </>
  );
}
