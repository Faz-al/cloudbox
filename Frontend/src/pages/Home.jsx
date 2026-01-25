import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

import FeatureCard from "../components/FeatureCard";
import { useEffect } from "react";
import ZeroTrustCollapseField from "../components/ZeroTrustCollapseField";
import IntentFieldSystem from "../components/IntentFieldSystem";





export default function Home() {
  useEffect(() => {
    const section = document.querySelector(".demo-section");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-active");
        } else {
          section.classList.remove("is-active");
          void section.offsetWidth;
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);




  useEffect(() => {
  const items = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  items.forEach(el => observer.observe(el));

  return () => observer.disconnect();
}, []);













  return (
    <>
    

      <main className="bg-gradient-to-b from-slate-50 via-white to-white">
        {/* ================= HERO ================= */}
        {/* ================= HERO ================= */}
<section className="relative overflow-hidden pt-28 sm:pt-36 pb-24 sm:pb-32">
  {/* Background layers */}
  <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-white to-white" />
  <div className="absolute inset-0 hero-grid opacity-[0.04]" />
  <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] hero-glow" />

  <div className="relative max-w-3xl mx-auto px-4 text-center">
    <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold leading-tight mb-6 hero-title text-gray-900">
      Your private cloud.
      <br />
      Built for security, not surveillance.
    </h1>

    <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto mb-10 hero-subtitle">
      SafeVault encrypts, protects, and isolates your files by default —
      so only you control your data, always.
    </p>

    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center hero-cta">
      <Link
        to="/signup"
        className="relative bg-blue-600 text-white px-8 py-3.5 rounded-xl font-medium text-center overflow-hidden group"
      >
        <span className="relative z-10">Create secure account</span>
        <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition" />
      </Link>

      <Link
        to="/login"
        className="px-8 py-3.5 rounded-xl border border-gray-300 bg-white/70 backdrop-blur-sm text-center hover:border-gray-400 transition"
      >
        Sign in
      </Link>
    </div>

    <p className="text-xs text-gray-500 mt-5 hero-note">
      5GB free · No credit card · Private by default
    </p>
  </div>

  {/* Animations */}
  <style>{`
    /* subtle grid */
    .hero-grid {
      background-image:
        linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    /* glow */
    .hero-glow {
      background: radial-gradient(
        circle,
        rgba(37,99,235,0.18),
        rgba(37,99,235,0.05),
        transparent 70%
      );
      filter: blur(60px);
      animation: glow-pulse 6s ease-in-out infinite;
    }

    @keyframes glow-pulse {
      0%, 100% {
        transform: translateX(-50%) scale(1);
        opacity: 0.6;
      }
      50% {
        transform: translateX(-50%) scale(1.08);
        opacity: 0.9;
      }
    }

    /* entrance */
    .hero-title,
    .hero-subtitle,
    .hero-cta,
    .hero-note {
      opacity: 0;
      transform: translateY(14px);
      animation: hero-fade-up 0.9s ease-out forwards;
    }

    .hero-title { animation-delay: 0.1s; }
    .hero-subtitle { animation-delay: 0.25s; }
    .hero-cta { animation-delay: 0.4s; }
    .hero-note { animation-delay: 0.55s; }

    @keyframes hero-fade-up {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
</section>


       
        {/* ================= PRODUCT DEMO ================= */}
    
     {/* ================= PRODUCT DEMO ================= */}
<section className="relative pb-24 sm:pb-32 -mt-8 sm:-mt-12 overflow-hidden demo-section demo-enter">
  {/* Ambient background */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-100/40 to-transparent" />

  <div className="relative max-w-6xl mx-auto px-4">
    {/* Section header */}
    <div className="text-center mb-10 sm:mb-14">
      

      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
        Every file is secured the moment it arrives
      </h2>
    </div>

    {/* Demo container */}
    <div className="relative rounded-2xl bg-white border border-gray-200 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] p-4 sm:p-6 overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-gray-400" />
        <div className="w-3 h-3 rounded-full bg-gray-300" />
        <div className="w-3 h-3 rounded-full bg-gray-300" />
      </div>

      {/* App canvas */}
      <div className="relative min-h-[240px] rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 overflow-hidden">
        {/* Existing files (establish context like a paused video frame) */}
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded w-4/5" />
          <div className="h-3 bg-gray-200 rounded w-3/5" />
          <div className="h-3 bg-gray-200 rounded w-2/5" />
        </div>

        {/* Incoming file (story beat: something new enters the system) */}
        <div className="new-file-row h-3 bg-gray-300 rounded w-1/2 mt-4" />

        {/* Interaction layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Upload action */}
          <div className="upload-btn bg-blue-600 text-white text-sm px-5 py-2.5 rounded-lg font-medium shadow-sm pointer-events-auto">
            Encrypted upload
          </div>

          {/* System state (acts like a video subtitle, not a toast) */}
          <div className="status-bubble absolute">
            Secured · Private · Isolated
          </div>
        </div>

        {/* Cursor (feels like a recorded screen, not animation) */}
        <svg
  className="fake-cursor"
  width="28"
  height="28"
  viewBox="0 0 32 32"
  fill="none"
>
  <path
    d="M4 2L26 14L18 17L21 28L15 30L12 19L4 2Z"
    fill="#ffffff"
    stroke="rgba(0,0,0,0.35)"
    strokeWidth="1"
    strokeLinejoin="round"
  />
</svg>



      </div>
    </div>
  </div>

  {/* Animations (unchanged timing, tuned for video-like pacing) */}
  <style>{`
    /* Section entrance */
    .demo-enter {
      opacity: 0;
      transform: translateY(18px);
      animation: demo-enter 0.8s ease-out forwards;
    }

    @keyframes demo-enter {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Pause by default */
    .demo-section * {
      animation-play-state: paused;
    }

    /* Play when active */
    .demo-section.is-active * {
      animation-play-state: running;
    }

    /* Upload button (story beat: action) */
    .upload-btn {
      opacity: 0;
      transform: scale(0.96);
      animation: upload-appear 12s infinite;
      position: relative;
    }

    .upload-btn::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: rgba(255,255,255,0.35);
      opacity: 0;
      transform: scale(0.85);
      animation: click-ripple 12s infinite;
    }

    @keyframes click-ripple {
      0%, 42% {
        opacity: 0;
        transform: scale(0.85);
      }
      45% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0;
        transform: scale(1.15);
      }
      100% {
        opacity: 0;
      }
    }

    /* Status bubble (story beat: system conclusion) */
    .status-bubble {
      opacity: 0;
      background: #2563eb;
      color: white;
      padding: 10px 16px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 18px 40px rgba(37, 99, 235, 0.35);
      animation: bubble-appear 12s infinite;
      display: inline-flex;
      align-items: center;
      letter-spacing: 0.3px;
    }

    .status-bubble::before {
      content: "🔒";
      margin-right: 6px;
      font-size: 13px;
    }

    /* New file appears quietly (story beat: secured asset) */
    .new-file-row {
      opacity: 0;
      animation: file-appear 12s infinite;
    }

    /* Cursor (feels like recorded intent) */
    .fake-cursor {
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: none;
  overflow: visible;

  /* THIS IS THE FIX */
  transform:
    translate(-180px, 110px)
    translate(-6px, -6px);

  animation: cursor-move 12s infinite;

  filter:
    drop-shadow(0 1px 1px rgba(0,0,0,0.25))
    drop-shadow(0 3px 6px rgba(0,0,0,0.15));
}


    @keyframes upload-appear {
      0%, 26% {
        opacity: 0;
        transform: scale(0.96);
      }
      35% {
        opacity: 1;
        transform: scale(1);
      }
      55% {
        opacity: 1;
      }
      65% {
        opacity: 0;
      }
    }

    @keyframes cursor-move {
  /* hidden */
  0%, 28% {
    opacity: 0;
    transform: translate(-180px, 110px);
  }

  /* appear */
  36% {
    opacity: 1;
  }

  /* move to target */
  46% {
    transform: translate(-10px, -10px);
  }

  /* HOLD POSITION (IMPORTANT) */
  45%, 47% {
    transform: translate(-10px, -10px);
  }

  /* fade out */
  100% {
    opacity: 100;
  }

  100% {
    opacity: 0;
  }
}


    @keyframes bubble-appear {
      0%, 60% {
        opacity: 0;
        transform: translateY(12px) scale(0.96);
      }
      69% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      90% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }

    @keyframes file-appear {
      0%, 61% {
        opacity: 0;
        transform: translateY(-6px);
      }
      70% {
        opacity: 1;
        transform: translateY(0);
      }
      100% {
        opacity: 1;
      }
    }
  `}</style>
</section>


        {/* ================= VALUES ================= */}
        {/* ================= VALUES ================= */}
{/* ================= ZERO-TRUST COLLAPSE FIELD ================= */}
<ZeroTrustCollapseField />






        {/* ================= PRIVACY ================= */}
   {/* ================= INSTANT UTILITY ================= */}
<section className="pb-28 sm:pb-36 relative">
  <div className="max-w-5xl mx-auto px-4">

    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-8">

      {/* Free storage */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center shadow-[0_12px_40px_-28px_rgba(0,0,0,0.25)]">
        <p className="text-3xl font-semibold text-gray-900 mb-2">
          5&nbsp;GB
        </p>
        <p className="text-sm text-gray-600">
          Free storage
        </p>
      </div>

      {/* Photos */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center">
        <p className="text-lg font-medium text-gray-900 mb-1">
          Photos & videos
        </p>
        <p className="text-xs text-gray-500">
          Keep memories private
        </p>
      </div>

      {/* Documents */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center">
        <p className="text-lg font-medium text-gray-900 mb-1">
          Documents
        </p>
        <p className="text-xs text-gray-500">
          Work. Personal. Safe.
        </p>
      </div>

      {/* Zero risk */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center">
        <p className="text-lg font-medium text-gray-900 mb-1">
          No commitment
        </p>
        <p className="text-xs text-gray-500">
          Start. Stop. Your choice.
        </p>
      </div>

    </div>

    {/* Subtle CTA */}
    <div className="mt-12 text-center">
      <Link
        to="/signup"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
      >
        Start with 5 GB free
        <span aria-hidden>→</span>
      </Link>
    </div>
  </div>
</section>




       {/* ================= HOW IT WORKS ================= */}
{/* ================= HOW IT WORKS ================= */}
{/* ================= HOW IT WORKS ================= */}

<section className="relative pb-24 sm:pb-32 -mt-8 sm:-mt-12 overflow-hidden text-center">


    {/* Headline */}


    
    
      <IntentFieldSystem />
      

      

    

    
    
  
</section>




{/* ================= EXIT GUARANTEE ================= */}
<section className="pb-32 sm:pb-25 relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/20 to-transparent" />

  <div className="relative max-w-3xl mx-auto px-4 text-center">

    {/* Headline */}
    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 leading-snug">
      You are never locked in.
    </h2>

    {/* Subline */}
    <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto mb-12">
      SafeVault is designed so you can start, use, or leave
      without friction, penalties, or hidden dependencies.
    </p>

    {/* Guarantees */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-14">

      <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center">
        <p className="text-sm font-medium text-gray-900 mb-1">
          No lock-in
        </p>
        <p className="text-xs text-gray-500">
          Download everything. Leave anytime.
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center">
        <p className="text-sm font-medium text-gray-900 mb-1">
          No hidden costs
        </p>
        <p className="text-xs text-gray-500">
          Free means free. Always.
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center">
        <p className="text-sm font-medium text-gray-900 mb-1">
          No loss of control
        </p>
        <p className="text-xs text-gray-500">
          Your data remains yours.
        </p>
      </div>

    </div>

    {/* Final CTA */}
    <Link
      to="/signup"
      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3.5 rounded-xl font-medium"
    >
      Start with 5 GB free
    </Link>

    {/* Quiet footer line */}
    <p className="mt-6 text-xs text-gray-400 tracking-wide">
      No credit card · No commitment · No pressure
    </p>
  </div>
</section>


      </main>
    </>
  );
}
