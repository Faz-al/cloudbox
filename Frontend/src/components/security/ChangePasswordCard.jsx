import { useState } from "react";
import { changePassword } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  const valid =
    current &&
    next.length >= 8 &&
    next === confirm;

  const handleSubmit = async () => {
    if (!valid || loading) return;

    try {
      setLoading(true);
      setError("");

      await changePassword(current, next);

      // 🔥 auto logout everywhere
      await logout();
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-semibold tracking-tight">
          Change password
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Use a strong, unique password to keep your account secure.
        </p>
      </div>

      <div className="space-y-6 max-w-lg">
        {/* Current */}
        <div>
          <label className="text-sm font-medium">Current password</label>
          <input
            type={show ? "text" : "password"}
            className="w-full mt-1 rounded-xl border px-4 py-3"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </div>

        {/* New */}
        <div>
          <label className="text-sm font-medium">New password</label>
          <div className="relative mt-1">
            <input
              type={show ? "text" : "password"}
              className="w-full rounded-xl border px-4 py-3"
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Minimum 8 characters
          </p>
        </div>

        {/* Confirm */}
        <div>
          <label className="text-sm font-medium">Confirm new password</label>
          <input
            type={show ? "text" : "password"}
            className="w-full mt-1 rounded-xl border px-4 py-3"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-xs text-amber-600 max-w-sm">
          Changing your password will sign you out from all devices.
        </p>

        <button
          onClick={handleSubmit}
          disabled={!valid || loading}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium disabled:opacity-40"
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </div>
    </div>
  );
}
