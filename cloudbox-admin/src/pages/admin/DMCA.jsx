import { useEffect, useState } from "react";
import {
  getDmcaReports,
  dmcaDeleteFile,
  dmcaSuspendUser,
  dmcaResolve
} from "../../api/admin";

export default function DMCA() {
  const [reports, setReports] = useState([]);

  const load = () => getDmcaReports().then(r => setReports(r.data));

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">DMCA Takedowns</h1>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th>Name</th>
              <th>File</th>
              <th>User</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {reports.map(r => (
              <tr key={r._id} className="border-t">
                <td className="p-3">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td>{r.name}</td>
                <td>{r.relatedFile?.name || "—"}</td>
                <td>{r.relatedUser?.email || "—"}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs
                    ${r.status === "pending" ? "bg-yellow-100 text-yellow-700"
                      : r.status === "resolved" ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"}`}>
                    {r.status}
                  </span>
                </td>

                <td className="space-x-2">
                  {r.status === "pending" && (
                    <>
                      <button
                        onClick={() => dmcaDeleteFile(r._id).then(load)}
                        className="text-red-600">
                        Delete File
                      </button>

                      <button
                        onClick={() => dmcaSuspendUser(r._id).then(load)}
                        className="text-orange-600">
                        Suspend User
                      </button>

                      <button
                        onClick={() => dmcaResolve(r._id, "rejected").then(load)}
                        className="text-slate-500">
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
