import { useEffect } from "react";

export default function Upgrade() {
  useEffect(() => {
    document.title = "Upgrade · CloudBox";
  }, []);

  return (
    <div className="px-6 py-14 max-w-7xl mx-auto animate-fade-in">
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
            className="mt-8 w-full py-3 rounded-lg bg-gray-200 text-gray-500 text-sm cursor-not-allowed"
          >
            Current plan
          </button>
        </div>

        {/* PRO */}
        <div className="relative rounded-2xl border-2 border-blue-600 p-8 bg-white shadow-[0_30px_60px_rgba(37,99,235,0.15)]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
            Most popular
          </div>

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

          <button className="mt-8 w-full py-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
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

          <button className="mt-8 w-full py-3 rounded-lg bg-gray-900 text-white text-sm hover:bg-black transition">
            Contact sales
          </button>
        </div>
      </div>

      {/* WHY UPGRADE */}
      <div className="mb-24">
        <h2 className="text-3xl font-semibold text-gray-900 text-center">
          Why upgrade to CloudBox?
        </h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <Feature
            title="Enterprise-grade security"
            desc="Your files are protected with industry-standard encryption at rest and in transit."
          />
          <Feature
            title="Blazing fast performance"
            desc="Optimized uploads and downloads with intelligent chunking and retry logic."
          />
          <Feature
            title="Access anywhere"
            desc="Use CloudBox seamlessly across devices without worrying about sync conflicts."
          />
          <Feature
            title="Professional workflows"
            desc="Preview, organize, and manage files like a modern SaaS product."
          />
          <Feature
            title="Reliability you can trust"
            desc="Built for scale with redundancy and uptime guarantees."
          />
          <Feature
            title="Priority support"
            desc="Get faster responses and dedicated assistance when you need it."
          />
        </div>
      </div>

      {/* SECURITY */}
      <div className="bg-gray-50 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-semibold text-gray-900">
          Security & compliance
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-gray-600 leading-relaxed">
          CloudBox is designed with security at its core — from encrypted storage
          to controlled access, auditability, and enterprise-ready architecture.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-700">
          <span className="px-4 py-2 bg-white rounded-full border">
            AES-256 Encryption
          </span>
          <span className="px-4 py-2 bg-white rounded-full border">
            Secure access tokens
          </span>
          <span className="px-4 py-2 bg-white rounded-full border">
            Role-based access
          </span>
          <span className="px-4 py-2 bg-white rounded-full border">
            Activity monitoring
          </span>
          <span className="px-4 py-2 bg-white rounded-full border">
            Data isolation
          </span>
        </div>
      </div>

      {/* Animation */}
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

function Feature({ title, desc }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}
