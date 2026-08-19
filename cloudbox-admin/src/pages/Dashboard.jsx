import { useEffect, useState } from "react";
import { getStats } from "../api/admin";

function formatNumber(value) {
  if (value === null || value === undefined) return "0";
  return new Intl.NumberFormat("en-IN").format(value);
}

function UsersIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 20a5 5 0 00-10 0M12 12a4 4 0 100-8 4 4 0 000 8zM20 20a4 4 0 00-3-3.87M17 4.5a3.5 3.5 0 010 7"
      />
    </svg>
  );
}

function FilesIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        d="M14 3v6h5"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 13a5 5 0 007.07 0l2-2a5 5 0 00-7.07-7.07l-1.15 1.15"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14 11a5 5 0 00-7.07 0l-2 2A5 5 0 0012 20.07l1.15-1.15"
      />
    </svg>
  );
}

function StatCard({ title, value, sub, icon, tone = "blue" }) {
  const toneClasses = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
  };

  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-slate-500">{title}</p>

        <div
          className={[
            "grid h-10 w-10 place-items-center rounded-2xl ring-1",
            toneClasses[tone],
          ].join(" ")}
        >
          {icon}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-3xl font-black tracking-tight text-slate-950">
          {formatNumber(value)}
        </p>

        {sub && <p className="mt-1.5 text-xs font-medium text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}

function StatusItem({ title, value, tone = "green" }) {
  const toneClasses = {
    green: "bg-emerald-500 shadow-emerald-500/40",
    blue: "bg-blue-500 shadow-blue-500/40",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-center gap-2">
        <span
          className={[
            "h-2.5 w-2.5 rounded-full shadow-[0_0_0_4px]",
            toneClasses[tone],
          ].join(" ")}
        />
        <p className="text-sm font-semibold text-slate-500">{title}</p>
      </div>

      <p className="mt-3 text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then((r) => setStats(r.data));
  }, []);

  if (!stats) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-40 animate-pulse rounded-xl bg-slate-100" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded-xl bg-slate-100" />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="h-40 animate-pulse rounded-[1.5rem] bg-slate-100" />
          <div className="h-40 animate-pulse rounded-[1.5rem] bg-slate-100" />
          <div className="h-40 animate-pulse rounded-[1.5rem] bg-slate-100" />
        </div>

        <div className="h-48 animate-pulse rounded-[1.5rem] bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
            Admin Dashboard
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Overview
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            SafeVault platform activity, storage usage, and public access status.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            System
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm font-bold text-emerald-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]" />
            Operational
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats.users}
          sub="Registered accounts"
          tone="blue"
          icon={<UsersIcon />}
        />

        <StatCard
          title="Total Files"
          value={stats.files}
          sub="Stored across all users"
          tone="emerald"
          icon={<FilesIcon />}
        />

        <StatCard
          title="Public Links"
          value={stats.publicFiles}
          sub="Externally accessible"
          tone="violet"
          icon={<LinkIcon />}
        />
      </div>

      {/* System Panel */}
      <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)] sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-950">
              Platform Status
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Current operational state of SafeVault services.
            </p>
          </div>

          <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
            All systems normal
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatusItem title="Storage" value="Operational" tone="green" />
          <StatusItem title="Public Access" value="Enabled" tone="blue" />
          <StatusItem title="Security" value="Monitoring active" tone="green" />
        </div>
      </div>
    </div>
  );
}