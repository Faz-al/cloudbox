import { useEffect, useState } from "react";
import { getMe } from "../utils/api";





export default function AccountSettings() {
  // TEMP (later from AuthContext / API)
 const [email, setEmail] = useState("");





 useEffect(() => {
  document.title = "Account Settings · SafeVault";

  getMe()
    .then((user) => {
      if (user?.email) {
        setEmail(user.email);
      }
    })
    .catch(() => {
      // silent fail, keep UI stable
    });
}, []);


  return (
    <div className="px-6 py-10 max-w-5xl animate-fade-in">




      {/* Header */}


{/* Header */}
<div className="mb-14">
  <div
    className="
      relative overflow-hidden
      rounded-2xl
      bg-gradient-to-br from-blue-50 via-white to-purple-50
      border border-gray-200
      p-8
    "
  >
    {/* subtle background accent */}
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-60" />
    <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-100 rounded-full blur-3xl opacity-60" />

    <div className="relative">
      <p className="text-xs font-medium text-blue-600 mb-2">
        Account
      </p>

      <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
        Account settings
      </h1>

      <p className="mt-2 max-w-xl text-sm text-gray-600 leading-relaxed">
        Control how your profile appears, manage preferences, and review account details.
      </p>
    </div>
  </div>
</div>




      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — Profile card */}
        <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Profile
          </h2>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold">
              {email ? email[0].toUpperCase() : "?"}

            </div>

            <div>
              <button
                disabled
                className="text-sm font-medium text-gray-400 cursor-not-allowed"
              >
                Change profile photo
              </button>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG up to 5MB (coming soon)
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              disabled
              placeholder="Not set"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              disabled
              value={email}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">
              To protect your account, email updates are managed through support.
            </p>
          </div>
        </div>

        {/* RIGHT — Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Preferences */}
          <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Preferences
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
                >
                  <option>English (US)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time zone
                </label>
                <select
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
                >
                  <option>Asia / Kolkata</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Preferences are automatically configured based on your device and location.


            </p>
          </div>

          {/* Account status */}
          <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Account status
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  SafeVault Free Plan
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Upgrade to unlock more storage and features
                </p>
              </div>

              <button
                disabled
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm cursor-not-allowed"
              >
                Manage plan
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-2xl border border-red-100 shadow-[0_20px_40px_rgba(0,0,0,0.04)] p-6">
            <h2 className="text-base font-semibold text-red-600 mb-2">
              Danger zone
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Permanently delete your SafeVault account and all stored files.
            </p>

            <button
              disabled
              className="px-4 py-2 rounded-lg bg-red-100 text-red-400 text-sm cursor-not-allowed"
            >
              Delete account
            </button>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
