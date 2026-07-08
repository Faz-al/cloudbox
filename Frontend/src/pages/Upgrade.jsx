import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

function BackIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function CrownIcon({ className = "h-6 w-6" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8l4 4 4-7 4 7 4-4v10H4V8z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 20h16" />
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

function StorageIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <ellipse cx="12" cy="6" rx="8" ry="3" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </svg>
  );
}

function SupportIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 10a6 6 0 10-12 0v4a6 6 0 0012 0v-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 19c1 1.2 2.3 2 4 2s3-.8 4-2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11H3v4h2M19 11h2v4h-2" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
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

function VaultIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11V8a5 5 0 0110 0v3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 11h12v9H6v-9z" />
    </svg>
  );
}

function UserIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 21a8 8 0 10-16 0" />
      <circle cx="12" cy="8" r="4" strokeWidth="2" />
    </svg>
  );
}

export default function Upgrade() {
  const isAndroidApp = Capacitor.getPlatform() === "android";

  useEffect(() => {
    document.title = "Upgrade · SafeVault";
  }, []);

  return (
    <div
      className={[
        "min-h-full animate-fade-in",
        isAndroidApp
          ? "bg-gradient-to-b from-blue-50 via-white to-white px-4 pb-28 pt-5"
          : "bg-slate-50 px-4 py-5 sm:px-6 lg:px-8 lg:py-7",
      ].join(" ")}
    >
      <main className="mx-auto max-w-6xl">
        {/* Header */}
        <div
          className={[
            "mb-5",
            isAndroidApp
              ? ""
              : "rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl",
          ].join(" ")}
        >
          <Link
            to="/dashboard"
            className={[
              "mb-3 inline-flex w-fit items-center gap-2 text-sm font-semibold transition",
              isAndroidApp
                ? "rounded-full bg-white px-3 py-2 text-blue-600 shadow-sm active:scale-95"
                : "text-blue-600 hover:text-blue-700",
            ].join(" ")}
          >
            <BackIcon />
            Dashboard
          </Link>

          <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-5 shadow-sm sm:p-8">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-100 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-sky-100 blur-3xl" />

            <div className="relative grid gap-6 lg:grid-cols-[1fr_340px] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-500">
                  Upgrade Center
                </p>

                <h1
                  className={[
                    "mt-3 font-black tracking-tight text-slate-950",
                    isAndroidApp ? "text-3xl" : "text-4xl",
                  ].join(" ")}
                >
                  Expand your SafeVault workspace
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Need more storage, business access, or advanced account support?
                  Upgrade requests are reviewed by SafeVault support so your account
                  gets the right setup.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="mailto:support@safevault.in?subject=SafeVault%20Upgrade%20Request"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-95"
                  >
                    <SupportIcon className="h-4 w-4" />
                    Contact support
                  </a>

                  <Link
                    to="/account"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
                  >
                    View account
                  </Link>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <CrownIcon />
                </div>

                <p className="mt-5 text-sm font-bold text-slate-950">
                  Manual upgrade review
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Storage and workspace upgrades are currently handled through support
                  to keep accounts configured correctly.
                </p>

                <div className="mt-5 rounded-2xl bg-blue-50 px-4 py-3 text-xs font-semibold leading-5 text-blue-700">
                  Response available through SafeVault support.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current plan + support flow */}
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Current Plan */}
          <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <ShieldIcon />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Current plan
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  SafeVault Free
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your account includes secure cloud storage for personal use.
                  Upgrade support is available when you need more space or business features.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">
                  Included storage
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700 shadow-sm">
                  5 GB
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-[18%] rounded-full bg-emerald-500" />
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Storage usage is shown on your dashboard based on your uploaded files.
              </p>
            </div>

            <ul className="mt-6 space-y-3">
              <Feature>Secure file upload and download</Feature>
              <Feature>Private Vault protection</Feature>
              <Feature>Image and video preview</Feature>
              <Feature>Account security controls</Feature>
            </ul>
          </section>

          {/* Upgrade request */}
          <section className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <StorageIcon />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
                  Request options
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Tell us what you need
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Contact support for storage expansion, account review, or business workspace access.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <RequestCard
                icon={<StorageIcon />}
                title="More storage"
                text="For users who need extra upload space."
              />

              <RequestCard
                icon={<ShieldIcon />}
                title="Security review"
                text="For account protection and access checks."
              />

              <RequestCard
                icon={<CrownIcon />}
                title="Business access"
                text="For professional or team requirements."
              />
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-bold text-blue-900">
                Upgrade requests are handled securely
              </p>

              <p className="mt-1 text-sm leading-6 text-blue-700/80">
                Support will review your account requirements and guide you with the available options.
              </p>

              <a
                href="mailto:support@safevault.in?subject=SafeVault%20Upgrade%20Request&body=Hello%20SafeVault%20Support%2C%0A%0AI%20would%20like%20to%20request%20an%20upgrade%20for%20my%20SafeVault%20account.%0A%0AAccount%20email%3A%20%0AStorage%20needed%3A%20%0APurpose%3A%20%0A%0AThank%20you."
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-95 sm:w-auto"
              >
                <SupportIcon className="h-4 w-4" />
                Send upgrade request
              </a>
            </div>
          </section>
        </div>

        {/* Info cards */}
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <InfoCard
            icon={<StorageIcon />}
            title="Storage expansion"
            text="Request additional cloud storage when your workspace grows."
          />
          <InfoCard
            icon={<ShieldIcon />}
            title="Account protection"
            text="Keep security controls, sessions, and private vault features aligned."
          />
          <InfoCard
            icon={<SupportIcon />}
            title="Support assisted"
            text="Upgrade requests are reviewed before changes are applied to your account."
          />
        </div>

        {isAndroidApp && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 px-4 pb-4 pt-3 shadow-[0_-16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
              <BottomNavItem to="/dashboard" label="Home" icon={<HomeIcon />} />
              <BottomNavItem to="/files" label="Files" icon={<FolderIcon />} />
              <BottomNavItem to="/vault" label="Vault" icon={<VaultIcon />} />
              <BottomNavItem to="/account" label="Account" icon={<UserIcon />} />
            </div>
          </div>
        )}
      </main>

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
          animation: fade-in 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}

function Feature({ children }) {
  return (
    <li className="flex items-center gap-3 text-sm font-semibold text-slate-600">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckIcon />
      </span>
      {children}
    </li>
  );
}

function RequestCard({ icon, title, text }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-black text-slate-950">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
        {icon}
      </div>

      <h3 className="mt-4 text-base font-black text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function BottomNavItem({ to, label, icon, active = false }) {
  return (
    <Link
      to={to}
      className={[
        "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold active:bg-blue-50",
        active ? "text-blue-600" : "text-slate-400",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-8 w-8 place-items-center rounded-2xl",
          active ? "bg-blue-50 text-blue-600" : "text-slate-400",
        ].join(" ")}
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}