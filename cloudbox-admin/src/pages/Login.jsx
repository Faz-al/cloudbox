import { useState } from "react";
import { login } from "../api/admin";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    await login({ email, password });
    nav("/");
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 p-8 shadow-sm">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            CloudBox Admin
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to manage the platform
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@cloudbox.com"
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <button
            onClick={submit}
            className="w-full mt-4 rounded-lg bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800"
          >
            Sign in
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Internal CloudBox administration
        </div>

      </div>
    </div>
  );
}
