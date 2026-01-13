import { useEffect, useState } from "react";
import { getActivity } from "../api/admin";

export default function Activity() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getActivity().then(r => setLogs(r.data));
  }, []);

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Activity & Abuse Logs
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Platform-wide audit trail
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500">
              <th className="px-6 py-4 text-left">Time</th>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Action</th>
              <th className="px-6 py-4 text-left">File</th>
              <th className="px-6 py-4 text-left">Context</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {logs.map(log => (
              <tr key={log._id} className="hover:bg-slate-50">

                <td className="px-6 py-4 text-slate-500 text-xs">
                  {new Date(log.createdAt).toLocaleString()}
                </td>

                <td
  className="px-6 py-4 text-blue-600 hover:underline cursor-pointer"
  onClick={() => {
    if (log.user?._id) {
      sessionStorage.setItem("admin_selected_user", log.user._id);
      window.location.href = "/users";
    }
  }}
>
  {log.user?.email || "System"}
</td>


                <td className="px-6 py-4">
                  <span
  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
    log.action.includes("flag") || log.action.includes("delete") || log.action.includes("suspend")
      ? "bg-red-50 text-red-600"
      : "bg-slate-100 text-slate-700"
  }`}
>
  {log.action}
</span>

                </td>

                <td
  className="px-6 py-4 text-blue-600 hover:underline cursor-pointer"
  onClick={() => {
    if (log.file?._id) {
      sessionStorage.setItem("admin_selected_file", log.file._id);
      window.location.href = "/files";
    }
  }}
>
  {log.file?.name || "—"}
</td>


                <td className="px-6 py-4 text-xs text-slate-500">
  {log.file && (
    <>
      {log.file.isVaulted ? "Vault" : "Home"}
      {!log.file.isVaulted && log.file.isShared && " · Public"}
    </>
  )}
  {log.meta?.reason && ` — ${log.meta.reason}`}
</td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
