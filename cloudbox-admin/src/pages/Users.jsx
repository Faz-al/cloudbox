import { useEffect, useState } from "react";
import { getUsers, suspendUser, unsuspendUser, getFiles } from "../api/admin";


function getFileTypeLabel(file) {
  const name = file?.name || "";
  const mime = file?.type || "";

  if (file?.isFolder || mime === "folder") return "FOLDER";

  const extension = name.includes(".")
    ? name.split(".").pop().toUpperCase()
    : "";

  if (extension) return extension;

  if (mime.includes("jpeg")) return "JPG";
  if (mime.includes("png")) return "PNG";
  if (mime.includes("webp")) return "WEBP";
  if (mime.includes("gif")) return "GIF";
  if (mime.includes("pdf")) return "PDF";
  if (mime.includes("mp4")) return "MP4";
  if (mime.includes("quicktime")) return "MOV";
  if (mime.includes("word")) return "DOCX";
  if (mime.includes("excel") || mime.includes("spreadsheet")) return "XLSX";
  if (mime.includes("powerpoint") || mime.includes("presentation")) return "PPTX";
  if (mime.includes("zip")) return "ZIP";
  if (mime.includes("text")) return "TXT";

  return "FILE";
}

function getParentId(file) {
  if (!file) return null;

  if (typeof file.parent === "string") return file.parent;
  if (file.parent?._id) return file.parent._id;

  if (typeof file.folder === "string") return file.folder;
  if (file.folder?._id) return file.folder._id;

  if (typeof file.parentId === "string") return file.parentId;
  if (typeof file.folderId === "string") return file.folderId;

  return null;
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [openedFolder, setOpenedFolder] = useState(null);

  useEffect(() => {
    getUsers().then(r => setUsers(r.data));
    getFiles().then(r => setFiles(r.data));
  }, []);

  const allSelectedUserFiles = selectedUser
  ? files.filter((f) => f.user?._id === selectedUser._id)
  : [];

const userFiles = selectedUser
  ? allSelectedUserFiles.filter((f) => {
      const parentId = getParentId(f);

      if (openedFolder) {
        return parentId === openedFolder._id;
      }

      return !parentId;
    })
  : [];

const [previewFile, setPreviewFile] = useState(null);



  return (
    <div className="grid grid-cols-[1fr_420px] gap-8">

      {/* Users list */}
      <div className="space-y-8">

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500 mt-1">
            Click a user to inspect their activity
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-500">
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Storage</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr
                  key={u._id}
                  onClick={() => {
  setSelectedUser(u);
  setOpenedFolder(null);
}}
                  className={`cursor-pointer hover:bg-slate-50 ${
                    selectedUser?._id === u._id ? "bg-slate-100" : ""
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {Math.round(u.usedStorage / 1024 / 1024)} MB
                  </td>
                  <td className="px-6 py-4">
                    {u.isSuspended ? (
                      <span className="text-xs text-red-600">Suspended</span>
                    ) : (
                      <span className="text-xs text-green-600">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Inspector */}
     <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit sticky top-24 self-start">


        {!selectedUser ? (
          <div className="text-sm text-slate-400">
            Select a user to view details
          </div>
        ) : (
          <div className="space-y-6">

            <div>
              <p className="text-xs text-slate-500">User</p>
              <p className="font-medium text-slate-900">
                {selectedUser.email}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Status</p>
              <p className="font-medium">
                {selectedUser.isSuspended ? "Suspended" : "Active"}
              </p>
            </div>

            <div>
<div className="flex items-center justify-between gap-3 mb-2">
  <div>
    <p className="text-xs text-slate-500">
      {openedFolder ? "Folder contents" : "Files uploaded"}
    </p>

    {openedFolder && (
      <p className="text-sm font-medium text-slate-900 mt-1">
        {openedFolder.name}
      </p>
    )}
  </div>

  {openedFolder && (
    <button
      type="button"
      onClick={() => setOpenedFolder(null)}
      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
    >
      Back
    </button>
  )}
</div>

             <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-64 overflow-auto text-sm bg-white">
  {userFiles.map(f => (
    <div
      key={f._id}
      onClick={(e) => {
  e.stopPropagation();

  if (f.isFolder || f.type === "folder") {
    setOpenedFolder(f);
    setPreviewFile(null);
    return;
  }

  setPreviewFile(f);
}}


      className="px-3 py-2 flex justify-between items-center text-slate-900 hover:bg-slate-50 cursor-pointer"
    >
      <div>
        <div className="flex items-center gap-2">
  <div className="font-medium truncate">{f.name}</div>

  <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
    {getFileTypeLabel(f)}
  </span>
</div>

<div className="text-xs text-slate-400">
  {!f.isVaulted && f.isShared && f.shareEnabled ? "Public" : "Private"} ·{" "}
  {f.isVaulted ? "Vault" : "Home"} · {f.type || "Unknown type"}
</div>
      </div>

      {f.isFolder || f.type === "folder" ? (
  <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
    Open
  </span>
) : (
  <span
    className={`text-xs ${
      f.isFlagged ? "text-yellow-600" : "text-green-600"
    }`}
  >
    {f.isFlagged ? "Flagged" : "Clean"}
  </span>
)}
    </div>
  ))}

  {userFiles.length === 0 && (
    <div className="px-3 py-6 text-center text-slate-400">
      No files uploaded
    </div>
  )}
</div>


            </div>

           {!selectedUser.isSuspended ? (
  <button
    onClick={async () => {
      await suspendUser(selectedUser._id, "Admin");
      const res = await getUsers();
      setUsers(res.data);
      setSelectedUser(res.data.find(u => u._id === selectedUser._id));
    }}
    className="w-full rounded-lg border border-red-200 bg-red-50 text-red-600 py-2 text-sm font-medium"
  >
    Suspend User
  </button>
) : (
  <button
    onClick={async () => {
      await unsuspendUser(selectedUser._id);
      const res = await getUsers();
      setUsers(res.data);
      setSelectedUser(res.data.find(u => u._id === selectedUser._id));
    }}
    className="w-full rounded-lg border border-green-200 bg-green-50 text-green-700 py-2 text-sm font-medium"
  >
    Unsuspend User
  </button>
)}


          </div>
        )}
      </div>

{previewFile && !(previewFile.isFolder || previewFile.type === "folder") && (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
    <div className="w-[500px] bg-white h-full p-6 overflow-auto">

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">{previewFile.name}</h2>
        <button
          onClick={() => setPreviewFile(null)}
          className="text-slate-500 hover:text-black"
        >
          Close
        </button>
      </div>

      <div className="border rounded bg-slate-50 p-3 flex justify-center mb-4">
        {previewFile.type?.startsWith("image") && (
          <img src={`${import.meta.env.VITE_API_URL}/admin/files/${previewFile._id}/download`} className="max-h-[300px]" />
        )}
        {previewFile.type?.startsWith("video") && (
          <video src={`${import.meta.env.VITE_API_URL}/admin/files/${previewFile._id}/download`} controls className="max-h-[300px]" />
        )}
        {previewFile.type === "application/pdf" && (
  <iframe
    src={`${import.meta.env.VITE_API_URL}/admin/files/${previewFile._id}/download`}
    className="w-full h-[300px] rounded border"
  />
)}

      </div>

      <div className="space-y-3 text-sm">
  <div>
    <b>Owner:</b> {previewFile.user?.email}
  </div>

  <div>
    <b>File type:</b> {getFileTypeLabel(previewFile)}
  </div>

  <div>
    <b>MIME type:</b> {previewFile.type || "Unknown"}
  </div>

  <div>
    <b>Location:</b> {previewFile.isVaulted ? "Vault" : "Home"}
  </div>

  <div>
    <b>Status:</b> {previewFile.isFlagged ? "Flagged" : "Clean"}
  </div>
</div>

    </div>
  </div>
)}










    </div>
  );
}
