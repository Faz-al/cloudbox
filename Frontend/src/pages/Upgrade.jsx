import { useEffect } from "react";

export default function Upgrade() {
  useEffect(() => {
    document.title = "Upgrade · CloudBox";
  }, []);

  return (
    <div className="px-6 py-14 max-w-7xl mx-auto relative">
      {/* ===== BLOCK OVERLAY ===== */}
      {/* BLOCK OVERLAY */}
<div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm pointer-events-none flex items-center justify-center">
  <div className="pointer-events-auto text-center max-w-md px-6 bg-white rounded-2xl p-8 shadow-xl">
    <h2 className="text-2xl font-semibold text-gray-900">
      Upgrade via support
    </h2>
    <p className="mt-3 text-gray-600 leading-relaxed">
      Plan upgrades are currently handled manually.
      <br />
      Please contact support to upgrade your CloudBox account.
    </p>

    <a
      href="mailto:support@pawsh.live"
      className="inline-block mt-6 px-6 py-3 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-black transition"
    >
      Contact support
    </a>
  </div>
</div>


      {/* ===== ORIGINAL PAGE (DIMMED) ===== */}
      <div className="animate-fade-in opacity-40 pointer-events-none">
        {/* HERO */}
        <div className="text-center mb-20">
          <h1 className="text-[40px] font-semibold tracking-tight text-gray-900">
            Upgrade your CloudBox experience
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 leading-relaxed">
            Get more storage, advanced security, and professional-grade features
            trusted by teams and businesses.
          </p>
        </div>

        {/* PLANS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {/* FREE */}
          <div className="rounded-2xl border border-gray-200 p-8 bg-white">
            <h3 className="text-lg font-semibold text-gray-900">Free</h3>
            <p className="mt-1 text-sm text-gray-500">For personal use</p>

            <div className="mt-6">
              <span className="text-4xl font-semibold text-gray-900">₹0</span>
              <span className="text-sm text-gray-500"> / month</span>
            </div>

            <ul className="mt-8 space-y-4 text-sm text-gray-600">
              <li>✔ 5 GB secure storage</li>
              <li>✔ Basic file upload & download</li>
              <li>✔ Standard encryption</li>
              <li>✔ Single device login</li>
            </ul>

            <button
              disabled
              className="mt-8 w-full py-3 rounded-lg bg-gray-200 text-gray-500 text-sm"
            >
              Current plan
            </button>
          </div>

          {/* PRO */}
          <div className="relative rounded-2xl border-2 border-blue-600 p-8 bg-white">
            <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
            <p className="mt-1 text-sm text-gray-500">
              For professionals & creators
            </p>

            <div className="mt-6">
              <span className="text-4xl font-semibold text-gray-900">₹499</span>
              <span className="text-sm text-gray-500"> / month</span>
            </div>

            <ul className="mt-8 space-y-4 text-sm text-gray-700">
              <li>✔ 1 TB ultra-fast storage</li>
              <li>✔ Advanced file preview</li>
              <li>✔ Encrypted downloads & links</li>
              <li>✔ Multiple device sessions</li>
              <li>✔ Priority upload speeds</li>
              <li>✔ Email support</li>
            </ul>

            <button className="mt-8 w-full py-3 rounded-lg bg-blue-600 text-white text-sm">
              Upgrade to Pro
            </button>
          </div>

          {/* BUSINESS */}
          <div className="rounded-2xl border border-gray-200 p-8 bg-white">
            <h3 className="text-lg font-semibold text-gray-900">Business</h3>
            <p className="mt-1 text-sm text-gray-500">
              For teams & enterprises
            </p>

            <div className="mt-6">
              <span className="text-4xl font-semibold text-gray-900">₹999</span>
              <span className="text-sm text-gray-500"> / user / month</span>
            </div>

            <ul className="mt-8 space-y-4 text-sm text-gray-700">
              <li>✔ Unlimited storage</li>
              <li>✔ Team folders & permissions</li>
              <li>✔ Activity logs & audit trails</li>
              <li>✔ Admin dashboard</li>
              <li>✔ Priority + phone support</li>
              <li>✔ SLA-backed uptime</li>
            </ul>

            <button className="mt-8 w-full py-3 rounded-lg bg-gray-900 text-white text-sm">
              Contact sales
            </button>
          </div>
        </div>

        {/* WHY UPGRADE */}
        <div className="mb-24">
          <h2 className="text-3xl font-semibold text-gray-900 text-center">
            Why upgrade to CloudBox?
          </h2>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
