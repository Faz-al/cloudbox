import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

import { unlockVault, setupVaultPin, unvaultFile } from "../utils/api";
import { API_BASE } from "../utils/api";

import FileRow from "../components/FileRow";
import ImagePreview from "../components/ImagePreview";

function BackIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function LockIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11V8a5 5 0 0110 0v3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 11h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2" />
    </svg>
  );
}

function UnlockIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11V8a4 4 0 00-7.7-1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 11h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z" />
    </svg>
  );
}

function ShieldIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
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

function FolderIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8.5a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  );
}

function UploadIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16V8m0 0l-3 3m3-3l3 3M4 16.5A4.5 4.5 0 018.5 12H9a6 6 0 1111 3.5" />
    </svg>
  );
}

export default function Vault() {
  const isAndroidApp = Capacitor.getPlatform() === "android";

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);
  const [pin, setPin] = useState("");
  const [locked, setLocked] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const res = await fetch(`${API_BASE}/files/vault/status`, {
        credentials: "include",
      });

      const data = await res.json();

      if (data.status === "not_set") {
        setNeedsSetup(true);
        setLocked(false);
        setFiles([]);
        setLoading(false);
        return;
      }

      if (data.status === "locked") {
        setLocked(true);
        setNeedsSetup(false);
        setFiles([]);
        setLoading(false);
        return;
      }

      const filesRes = await fetch(`${API_BASE}/files/vault`, {
        credentials: "include",
      });

      const filesData = await filesRes.json();

      setFiles(Array.isArray(filesData) ? filesData : []);
      setLocked(false);
      setNeedsSetup(false);
      setLoading(false);
    };

    load();
  }, []);

  const handleLockVault = () => {
    setFiles([]);
    setLocked(true);
    setPin("");
    setError("");
  };

  const handleSetupPin = async () => {
    if (pin.length < 4) return;

    try {
      setSubmitting(true);
      setError("");

      await setupVaultPin(pin);

      setPin("");
      setNeedsSetup(false);
      setLocked(true);
    } catch {
      setError("Could not set PIN. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlockVault = async () => {
    try {
      setSubmitting(true);
      setError("");

      await unlockVault(pin);

      const res = await fetch(`${API_BASE}/files/vault`, {
        credentials: "include",
      });

      const data = await res.json();

      setFiles(Array.isArray(data) ? data : []);
      setLocked(false);
      setPin("");
    } catch {
      setError("Incorrect PIN");
      setPin("");
    } finally {
      setSubmitting(false);
    }
  };

  const previewFiles = files.filter(
    (f) =>
      !f.isFolder &&
      (f.type?.startsWith("image") || f.type?.startsWith("video"))
  );

  return (
    <>
      <div
        className={[
          "min-h-full",
          isAndroidApp
            ? "bg-gradient-to-b from-indigo-50 via-white to-white px-4 pb-28 pt-5"
            : "bg-slate-50 px-4 py-5 sm:px-6 lg:px-8 lg:py-7",
        ].join(" ")}
      >
        <main className="mx-auto w-full max-w-6xl">
          {/* Header */}
          <div
            className={[
              "mb-5",
              isAndroidApp
                ? ""
                : "rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Link
                  to="/dashboard"
                  className={[
                    "mb-3 inline-flex w-fit items-center gap-2 text-sm font-semibold transition",
                    isAndroidApp
                      ? "rounded-full bg-white px-3 py-2 text-indigo-600 shadow-sm active:scale-95"
                      : "text-indigo-600 hover:text-indigo-700",
                  ].join(" ")}
                >
                  <BackIcon />
                  Dashboard
                </Link>

                <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-500">
                  Private Vault
                </p>

                <h1
                  className={[
                    "mt-2 font-bold tracking-tight text-slate-950",
                    isAndroidApp ? "text-3xl" : "text-2xl sm:text-3xl",
                  ].join(" ")}
                >
                  {needsSetup
                    ? "Secure your vault"
                    : locked
                    ? "Vault locked"
                    : "Vault unlocked"}
                </h1>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                  {needsSetup
                    ? "Create a PIN to protect private cloud files inside SafeVault."
                    : locked
                    ? "Enter your PIN to access your hidden private files."
                    : "Your private vault is open. You can preview files or move them back to regular storage."}
                </p>
              </div>

              {!loading && !locked && !needsSetup && (
                <button
                  type="button"
                  onClick={handleLockVault}
                  className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
                >
                  <LockIcon className="h-4 w-4" />
                  Lock
                </button>
              )}
            </div>
          </div>

          {/* Hero status card */}
          <div
            className={[
              "relative mb-5 overflow-hidden rounded-[2rem] border bg-white shadow-sm",
              isAndroidApp ? "border-indigo-100" : "border-slate-200",
            ].join(" ")}
          >
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-indigo-100 blur-3xl" />
            <div className="absolute -bottom-20 left-10 h-52 w-52 rounded-full bg-blue-100/70 blur-3xl" />

            <div className="relative p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={[
                      "grid h-16 w-16 shrink-0 place-items-center rounded-[1.5rem] text-white shadow-lg",
                      !loading && !locked && !needsSetup
                        ? "bg-emerald-500 shadow-emerald-500/20"
                        : "bg-indigo-600 shadow-indigo-600/20",
                    ].join(" ")}
                  >
                    {!loading && !locked && !needsSetup ? (
                      <UnlockIcon className="h-7 w-7" />
                    ) : (
                      <LockIcon className="h-7 w-7" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-950">
                      {loading
                        ? "Checking vault security"
                        : needsSetup
                        ? "PIN setup required"
                        : locked
                        ? "Protected by PIN"
                        : "Unlocked session"}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {loading
                        ? "Please wait while SafeVault loads your vault status."
                        : needsSetup
                        ? "Set a private PIN before moving files into the vault."
                        : locked
                        ? "Your vault files are hidden until you unlock them."
                        : `${files.length} private ${files.length === 1 ? "file" : "files"} available.`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:w-[260px]">
                  <VaultMetric label="Files" value={files.length} />
                  <VaultMetric label="Photos" value={files.filter((f) => f.type?.startsWith("image")).length} />
                  <VaultMetric label="Videos" value={files.filter((f) => f.type?.startsWith("video")).length} />
                </div>
              </div>
            </div>
          </div>

          {/* Main vault body */}
          <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
            {loading && (
              <div className="flex min-h-[280px] items-center justify-center p-10">
                <div className="text-center">
                  <div className="mx-auto grid h-14 w-14 animate-pulse place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <ShieldIcon />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    Loading secure vault…
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Checking your private storage status
                  </p>
                </div>
              </div>
            )}

            {!loading && needsSetup && (
              <VaultPinPanel
                title="Create your Vault PIN"
                description="Use a PIN with at least 4 digits. You will need this PIN whenever the vault is locked."
                pin={pin}
                setPin={setPin}
                error={error}
                submitting={submitting}
                buttonLabel="Set PIN"
                onSubmit={handleSetupPin}
                mode="setup"
              />
            )}

            {!loading && locked && !needsSetup && (
              <VaultPinPanel
                title="Enter Vault PIN"
                description="Unlock your private vault to view hidden files."
                pin={pin}
                setPin={setPin}
                error={error}
                submitting={submitting}
                buttonLabel="Unlock Vault"
                onSubmit={handleUnlockVault}
                mode="unlock"
              />
            )}

            {!loading && !locked && !needsSetup && (
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 bg-emerald-50/60 px-5 py-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Vault unlocked · Protected by PIN
                  </div>

                  <button
                    onClick={handleLockVault}
                    className="text-xs font-bold text-slate-500 transition hover:text-slate-950"
                  >
                    Lock Vault
                  </button>
                </div>

                {files.length === 0 ? (
                  <div className="px-6 py-14 text-center">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-indigo-50 text-indigo-600">
                      <VaultIconLarge />
                    </div>

                    <h3 className="mt-5 text-base font-bold text-slate-950">
                      Your vault is empty
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Move files from All files into the Vault to hide and protect them with your PIN.
                    </p>

                    <Link
                      to="/files"
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
                    >
                      <FolderIcon />
                      Go to files
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {files.map((file) => (
                      <FileRow
                        key={file._id}
                        file={file}
                        onPreview={(file) => {
                          if (!file.isFolder) setPreview(file);
                        }}
                        onUnvault={async (id) => {
                          await unvaultFile(id);
                          setFiles((prev) => prev.filter((f) => f._id !== id));
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {isAndroidApp && (
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 px-4 pb-4 pt-3 shadow-[0_-16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
                <BottomNavItem to="/dashboard" label="Home" icon={<HomeIcon />} />
                <BottomNavItem to="/files" label="Files" icon={<FolderIcon />} />
                <BottomNavItem to="/vault" label="Vault" active icon={<LockIcon className="h-4 w-4" />} />
                <Link
                  to="/files"
                  className="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold text-indigo-600 active:bg-indigo-50"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-2xl bg-indigo-600 text-white">
                    <UploadIcon />
                  </span>
                  Add
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>

      <ImagePreview
        files={previewFiles}
        activeFile={preview}
        onClose={() => setPreview(null)}
      />
    </>
  );
}

function VaultPinPanel({
  title,
  description,
  pin,
  setPin,
  error,
  submitting,
  buttonLabel,
  onSubmit,
  mode,
}) {
  return (
    <div className="mx-auto flex min-h-[360px] max-w-md flex-col justify-center px-6 py-10">
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-[1.5rem] bg-indigo-50 text-indigo-600">
          {mode === "setup" ? <ShieldIcon className="h-7 w-7" /> : <LockIcon className="h-7 w-7" />}
        </div>

        <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <div className="mt-7">
        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          Vault PIN
        </label>

        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ""));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && pin.length >= 4 && !submitting) {
              onSubmit();
            }
          }}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-slate-950 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          placeholder="••••"
        />

        {error && (
          <p className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        <button
          disabled={pin.length < 4 || submitting}
          onClick={onSubmit}
          className="mt-5 w-full rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Please wait…" : buttonLabel}
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-slate-400">
          Keep this PIN safe. It protects access to your private vault.
        </p>
      </div>
    </div>
  );
}

function VaultMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white/80 px-3 py-3 text-center shadow-sm">
      <p className="text-lg font-black text-slate-950">{value}</p>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  );
}

function VaultIconLarge() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11V8a5 5 0 0110 0v3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 11h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2" />
    </svg>
  );
}

function BottomNavItem({ to, label, icon, active = false }) {
  return (
    <Link
      to={to}
      className={[
        "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold active:bg-indigo-50",
        active ? "text-indigo-600" : "text-slate-400",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-8 w-8 place-items-center rounded-2xl",
          active ? "bg-indigo-50 text-indigo-600" : "text-slate-400",
        ].join(" ")}
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}