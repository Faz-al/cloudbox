import { useEffect, useState } from "react";
import { unlockVault, setupVaultPin, unvaultFile } from "../utils/api";
import { API_BASE } from "../utils/api";

import FileRow from "../components/FileRow";
import ImagePreview from "../components/ImagePreview";

export default function Vault() {
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

  return (
    <div className="min-h-[70vh] flex justify-center">
      <div className="w-full max-w-4xl p-6">
        <h1 className="text-xl font-semibold mb-6">Vault</h1>

        <div className="bg-white border rounded-2xl overflow-hidden">

          {/* STATUS BAR */}
          {!loading && !locked && !needsSetup && (
            <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50 text-xs text-gray-600">
              <span>Vault · Unlocked · Protected by PIN</span>
              <button
                onClick={handleLockVault}
                className="text-xs text-gray-600 hover:text-black"
              >
                Lock Vault
              </button>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="p-10 text-sm text-gray-500 animate-pulse">
              Loading secure vault…
            </div>
          )}

          {/* SETUP PIN */}
          {!loading && needsSetup && (
            <div className="p-10 max-w-sm mx-auto">
              <h2 className="text-xl font-semibold mb-2">
                Secure your Vault
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Create a PIN to protect your private files
              </p>

              <input
                type="password"
                inputMode="numeric"
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError("");
                }}
                className="w-full border rounded-lg px-4 py-3 text-lg tracking-widest mb-4"
              />

              {error && (
                <p className="text-sm text-red-600 mb-3">{error}</p>
              )}

              <button
                disabled={pin.length < 4 || submitting}
                onClick={async () => {
                  if (pin.length < 4) return;

                  setSubmitting(true);
                  await setupVaultPin(pin);
                  setSubmitting(false);

                  setPin("");
                  setNeedsSetup(false);
                  setLocked(true);
                }}
                className="w-full bg-black text-white py-3 rounded-xl font-medium disabled:opacity-40"
              >
                Set PIN
              </button>
            </div>
          )}

          {/* LOCKED */}
          {!loading && locked && !needsSetup && (
            <div className="p-10 max-w-sm mx-auto">
              <h2 className="text-xl font-semibold mb-2">
                Vault Locked
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Enter your PIN to access private files
              </p>

              <input
                type="password"
                inputMode="numeric"
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError("");
                }}
                className="w-full border rounded-lg px-4 py-3 text-lg tracking-widest mb-4"
              />

              {error && (
                <p className="text-sm text-red-600 mb-3">{error}</p>
              )}

              <button
                disabled={pin.length < 4 || submitting}
                onClick={async () => {
                  try {
                    setSubmitting(true);
                    await unlockVault(pin);
                    setSubmitting(false);

                    const res = await fetch(
                      `${API_BASE}/files/vault`,
                      { credentials: "include" }
                    );
                    const data = await res.json();

                    setFiles(Array.isArray(data) ? data : []);
                    setLocked(false);
                    setPin("");
                  } catch {
                    setSubmitting(false);
                    setError("Incorrect PIN");
                    setPin("");
                  }
                }}
                className="w-full bg-black text-white py-3 rounded-xl font-medium disabled:opacity-40"
              >
                Unlock Vault
              </button>
            </div>
          )}

          {/* UNLOCKED */}
          {!loading && !locked && !needsSetup && (
            <div className="p-4">
              {files.length === 0 && (
                <div className="p-10 text-center text-sm text-gray-500">
                  Your vault is empty
                </div>
              )}

              <div className="divide-y">
                {files.map((file) => (
                  <FileRow
                    key={file._id}
                    file={file}
                    onPreview={(file) => {
                      if (!file.isFolder) setPreview(file);
                    }}
                    onUnvault={async (id) => {
                      await unvaultFile(id);
                      setFiles((prev) =>
                        prev.filter((f) => f._id !== id)
                      );
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <ImagePreview
          files={files.filter(
            (f) =>
              !f.isFolder &&
              (f.type?.startsWith("image") ||
                f.type?.startsWith("video"))
          )}
          activeFile={preview}
          onClose={() => setPreview(null)}
        />
      </div>
    </div>
  );
}
