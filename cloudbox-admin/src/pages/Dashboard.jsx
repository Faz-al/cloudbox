import { useEffect, useState } from "react";
import { getStats } from "../api/admin";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then(r => setStats(r.data));
  }, []);

  if (!stats) return null;

  const StatCard = ({ title, value, sub }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <div className="h-8 w-8 rounded-full bg-slate-100" />
      </div>

      <div className="mt-4">
        <p className="text-3xl font-semibold text-slate-900">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          SafeVault platform activity
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.users}
          sub="Registered accounts"
        />
        <StatCard
          title="Total Files"
          value={stats.files}
          sub="Stored across all users"
        />
        <StatCard
          title="Public Links"
          value={stats.publicFiles}
          sub="Externally accessible"
        />
      </div>

      {/* System Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <h2 className="text-sm font-medium text-slate-900 mb-4">
          Platform Status
        </h2>

        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-slate-500">Storage</p>
            <p className="font-medium text-slate-900 mt-1">Operational</p>
          </div>

          <div>
            <p className="text-slate-500">Public Access</p>
            <p className="font-medium text-slate-900 mt-1">Enabled</p>
          </div>

          <div>
            <p className="text-slate-500">Security</p>
            <p className="font-medium text-slate-900 mt-1">Monitoring active</p>
          </div>
        </div>
      </div>

    </div>
  );
}
