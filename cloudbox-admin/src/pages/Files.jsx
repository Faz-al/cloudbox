import { useEffect, useState } from "react";
import { getFiles, deleteFile, flagFile, downloadFile } from "../api/admin";


const API_BASE = import.meta.env.VITE_API_URL;




export default function Files() {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(null);

  const getPreviewUrl = (file) =>
  `${API_BASE}/admin/files/${file._id}/download`;


  useEffect(() => {
  const id = sessionStorage.getItem("admin_selected_file");
  if (id && files.length) {
    const found = files.find(f => f._id === id);
    if (found) setSelected(found);
    sessionStorage.removeItem("admin_selected_file");
  }
}, [files]);



  

  useEffect(() => {
    getFiles().then(r => setFiles(r.data));
  }, []);

  return (
    <div className="grid grid-cols-[1fr_420px] gap-8">

      {/* Files table */}
      <div className="space-y-8">

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Files</h1>
          <p className="text-sm text-slate-500 mt-1">
            Click a file to inspect and preview
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-500">
                <th className="px-6 py-4 text-left">File</th>
                <th className="px-6 py-4 text-left">Owner</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {files.map(f => (
                <tr
  key={f._id}
  onClick={() => setSelected(f)}
  className={`cursor-pointer ${
    f.isFlagged
      ? "bg-red-50 hover:bg-red-100"
      : "hover:bg-slate-50"
  } ${selected?._id === f._id ? "ring-2 ring-red-300" : ""}`}
>

                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{f.name}</div>
                    <div className="text-xs text-slate-400">{f._id}</div>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {f.user?.email}
                  </td>

                  <td className="px-6 py-4">
                    {f.isFlagged ? (
  <span className="inline-flex items-center rounded-full bg-red-100 text-red-700 px-2 py-1 text-xs font-medium">
    ⚠ Flagged
  </span>
) : (
  <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-1 text-xs font-medium">
    Clean
  </span>
)}

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* File Inspector */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit sticky top-24 self-start">


        {!selected ? (
          <div className="text-sm text-slate-400">
            Select a file to inspect
          </div>
        ) : (
          <div className="space-y-6">

            <div className="space-y-1">
  <p className="text-xs text-slate-500">File</p>
  <p className="font-medium text-slate-900 break-all">
    {selected.name}
  </p>
</div>


           <div className="border rounded-lg bg-slate-50 p-2 flex items-center justify-center min-h-[200px]">
  {selected.type?.startsWith("image") && (
    <img
      src={getPreviewUrl(selected)}
      className="max-h-[300px] rounded shadow"
    />
  )}

  {selected.type?.startsWith("video") && (
    <video
      src={getPreviewUrl(selected)}
      controls
      className="max-h-[300px] rounded shadow"
    />
  )}

  {selected.type === "application/pdf" && (
    <iframe
      src={getPreviewUrl(selected)}
      className="w-full h-[300px] rounded border"
    />
  )}

  {!selected.type && (
    <p className="text-slate-400 text-sm">
      No preview available
    </p>
  )}
</div>
 




<div className="space-y-1">
  <p className="text-xs text-slate-500">Owner</p>
  <p className="font-medium text-slate-800">
    {selected.user?.email}
  </p>
</div>

<div className="space-y-1">
  <p className="text-xs text-slate-500">Status</p>
  <p
    className={`font-medium ${
      selected.isFlagged ? "text-yellow-700" : "text-green-700"
    }`}
  >
    {selected.isFlagged ? "Flagged" : "Clean"}
  </p>
</div>


            <div>
  <p className="text-xs text-slate-500">Location</p>
  <div className="flex gap-2 mt-1">
    <span className="rounded-full bg-slate-100 text-slate-800 px-3 py-1 text-xs">
  {selected.isVaulted ? "Vault" : "Home"}
</span>

{!selected.isFlagged && !selected.isVaulted && selected.isShared && selected.shareEnabled && (
  <span className="rounded-full bg-blue-50 text-blue-600 px-3 py-1 text-xs">
    Public
  </span>
)}


  </div>
</div>


            <div className="space-y-2">
              <button
                onClick={() => downloadFile(selected._id)}
                className="w-full rounded-lg border border-slate-300 bg-white text-slate-800 py-2 text-sm hover:bg-slate-50"
              >
                Download
              </button>

              <button
                onClick={async () => {
  await deleteFile(selected._id);
  const res = await getFiles();
  setFiles(res.data);
  setSelected(null);
}}

                className="w-full rounded-lg border border-red-200 bg-red-50 text-red-600 py-2 text-sm"
              >
                Delete
              </button>

              {!selected.isFlagged && (
                <button
                  onClick={async () => {
  await flagFile(selected._id, "Suspicious");
  const res = await getFiles();
  setFiles(res.data);
  setSelected(res.data.find(f => f._id === selected._id));
}}

                  className="w-full rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-700 py-2 text-sm"
                >
                  Flag as suspicious
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
