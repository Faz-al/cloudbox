import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

import FeatureCard from "../components/FeatureCard";
import { useEffect } from "react";

export default function Home() {

  // 🔑 THIS IS THE FIX
  

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

  // ⛔ Prevent flicker while checking auth


  return (
    <>
      
      <main className="bg-gradient-to-b from-blue-50 via-white to-white">
        {/* EVERYTHING BELOW IS UNCHANGED */}




        {/* HERO */}

<section className="pt-28 sm:pt-36 pb-20 sm:pb-28 hero-animate">
  <div className="max-w-3xl mx-auto px-4 text-center">

    <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold leading-tight mb-6 hero-title">
      A safe place for everything that matters.
    </h1>

    <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto mb-8 hero-subtitle">
      Store your photos, videos, and documents securely.
      Access them anytime, from any device.
    </p>

    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center hero-cta">
      <Link
        to="/signup"
        className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-medium text-center"
      >
        Get started — Free 5GB
      </Link>

    <Link
      to="/login"
      className="px-8 py-3.5 rounded-xl border border-gray-300 text-center"
    >
      Login
    </Link>

    </div>

    <p className="text-xs text-gray-500 mt-4 hero-note">
      No credit card required
    </p>

  </div>

  {/* Hero animations */}
  <style>{`
    .hero-title,
    .hero-subtitle,
    .hero-cta,
    .hero-note {
      opacity: 0;
      transform: translateY(14px);
      animation: hero-fade-up 0.7s ease-out forwards;
    }

    .hero-title {
      animation-delay: 0.1s;
    }

    .hero-subtitle {
      animation-delay: 0.25s;
    }

    .hero-cta {
      animation-delay: 0.4s;
    }

    .hero-note {
      animation-delay: 0.55s;
    }

    @keyframes hero-fade-up {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
</section>


        {/* PRODUCT PREVIEW — VIDEO-LIKE DEMO */}
{/* PRODUCT PREVIEW — ULTRA-REAL INTERACTIVE DEMO */}
<section className="relative pb-20 sm:pb-28 -mt-6 sm:-mt-10 overflow-hidden demo-section demo-enter">

  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/40 to-transparent" />

  <div className="relative max-w-5xl mx-auto px-4">
    <div className="relative rounded-2xl bg-white shadow-md border border-gray-100 p-4 sm:p-6 overflow-hidden">

      {/* Fake browser bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-gray-400" />
        <div className="w-3 h-3 rounded-full bg-gray-300" />
        <div className="w-3 h-3 rounded-full bg-gray-300" />
      </div>

      {/* App canvas */}
      <div className="relative min-h-[220px] rounded-lg bg-gray-50 p-4 sm:p-6 overflow-hidden">

        {/* Existing file rows */}
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded w-4/5" />
          <div className="h-3 bg-gray-200 rounded w-3/5" />
          <div className="h-3 bg-gray-200 rounded w-2/5" />
        </div>

        {/* New file row */}
        <div className="new-file-row h-3 bg-gray-300 rounded w-1/2 mt-3" />

        {/* Interaction layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

          {/* Upload button */}
          <div className="upload-btn bg-blue-600 text-white text-sm px-5 py-2.5 rounded-lg font-medium shadow-sm pointer-events-auto">
            Upload file
          </div>

          {/* Message bubble */}
          <div className="status-bubble absolute">
            file securely stored
          </div>

        </div>

        {/* Real cursor */}
        <svg
          className="fake-cursor"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
        >
          {/* white outline */}
          <path
            d="M4 3L20 12L13 14L15 21L11 22L9 15L4 3Z"
            fill="white"
          />
          {/* black arrow */}
          <path
            d="M4 3L20 12L13 14L15 21L11 22L9 15L4 3Z"
            fill="#111"
          />
        </svg>

      </div>
    </div>
  </div>

  {/* Animations */}
  <style>{`



    /* ===== Section entrance (runs once on page load) ===== */
.demo-enter {
  opacity: 0;
  transform: translateY(16px);
  animation: demo-section-enter 0.6s ease-out forwards;
}

@keyframes demo-section-enter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}



  /* ▶️ When demo is active, play animations ONLY ONCE */
.demo-section.is-active .upload-btn,
.demo-section.is-active .status-bubble,
.demo-section.is-active .new-file-row,
.demo-section.is-active .fake-cursor {
  animation-iteration-count: 1;
}


    /* ⛔ stop animations by default */
.demo-section * {
  animation-play-state: paused;
}

/* ▶️ play only when section is active */
.demo-section.is-active * {
  animation-play-state: running;
}



    /* Upload button */
    .upload-btn {
      opacity: 0;
      transform: scale(0.95);
      animation: upload-appear 9s infinite;
    }

    /* Message bubble */
    .status-bubble {
      opacity: 0;
      background: #2563eb;
      color: white;
      padding: 10px 16px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 14px 30px rgba(37, 99, 235, 0.35);
      animation: bubble-appear 9s infinite;
      letter-spacing: 0.1px;
      display: inline-flex;
      align-items: center;
    }

    .status-bubble::before {
  content: "🔒";
  margin-right: 6px;
  font-size: 13px;
}

    /* New file row */
    .new-file-row {
      opacity: 0;
      animation: file-appear 9s infinite;
    }

    /* Cursor */
    .fake-cursor {
      position: absolute;
      top: 50%;
      left: 50%;
      opacity: 0;
      transform: translate(-180px, 100px);
      animation: cursor-move 9s infinite;
      filter: drop-shadow(0 3px 4px rgba(0,0,0,0.25));
    }

    @keyframes upload-appear {
      0%, 20% {
        opacity: 0;
        transform: scale(0.95);
      }
      30% {
        opacity: 1;
        transform: scale(1);
      }
      48% {
        opacity: 1;
        transform: scale(0.96);
      }
      55% {
        opacity: 0;
      }
      100% {
        opacity: 0;
      }
    }

    @keyframes cursor-move {
      0%, 25% {
        opacity: 0;
        transform: translate(-180px, 100px);
      }
      35% {
        opacity: 1;
      }
      45% {
        transform: translate(-10px, -10px);
      }
      50% {
        transform: translate(-10px, -10px) scale(0.85);
      }
      55% {
        transform: translate(-10px, -10px) scale(1);
      }
      80% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }

    @keyframes bubble-appear {
      0%, 60% {
        opacity: 0;
        transform: translateY(10px) scale(0.95);
      }
      70% {
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
      0%, 60% {
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







        {/* VALUE STATEMENTS */}
        {/* VALUE STATEMENTS */}
{/* VALUE STATEMENTS — PREMIUM */} 
<section className="pb-20 sm:pb-28 value-section">
  <div className="max-w-5xl mx-auto px-4">

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">

        <div className="p-6 sm:p-8 value-card">
          <p className="text-sm text-gray-500 mb-2">Privacy</p>
          <p className="text-base sm:text-lg text-gray-800">
            Your files stay private by default.
          </p>
        </div>

        <div className="p-6 sm:p-8 value-card">
          <p className="text-sm text-gray-500 mb-2">Access</p>
          <p className="text-base sm:text-lg text-gray-800">
            Reach your files anytime, from any device.
          </p>
        </div>

        <div className="p-6 sm:p-8 value-card">
          <p className="text-sm text-gray-500 mb-2">Reliability</p>
          <p className="text-base sm:text-lg text-gray-800">
            Everything stays exactly where you left it.
          </p>
        </div>

      </div>
    </div>

  </div>

  <style>{`
    .value-card {
      opacity: 0;
      transform: translateY(14px);
      animation: value-fade-up 0.6s ease-out forwards;
    }

    .value-card:nth-child(1) { animation-delay: 0.1s; }
    .value-card:nth-child(2) { animation-delay: 0.25s; }
    .value-card:nth-child(3) { animation-delay: 0.4s; }

    @keyframes value-fade-up {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* subtle hover depth — desktop only */
    @media (hover: hover) {
      .value-card:hover {
        background: rgba(37, 99, 235, 0.02);
      }
    }
  `}</style>
</section>




      

        {/* PRIVACY — REFINED */} 
<section className="pb-24 sm:pb-32 privacy-section">
  <div className="max-w-4xl mx-auto px-4 text-center">

    <h2 className="text-2xl sm:text-3xl font-semibold mb-4 privacy-title">
      Designed with privacy in mind
    </h2>

    <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto privacy-text">
      CloudBox keeps your files private by default.
      You decide what stays, what moves, and what’s shared.
    </p>

  </div>

  <style>{`
    .privacy-title,
    .privacy-text {
      opacity: 0;
      transform: translateY(12px);
      animation: privacy-fade 0.6s ease-out forwards;
    }

    .privacy-title { animation-delay: 0.1s; }
    .privacy-text { animation-delay: 0.25s; }

    @keyframes privacy-fade {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
</section>


        {/* HOW IT WORKS — POLISHED */} 
<section className="pb-24 sm:pb-32 how-section">
  <div className="max-w-5xl mx-auto px-4 text-center">

    <h2 className="text-2xl sm:text-3xl font-semibold mb-14 how-title">
      Get started in minutes
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
      <div className="how-step">
        <p className="text-blue-600 text-2xl mb-2">①</p>
        <p className="font-medium">Create an account</p>
      </div>

      <div className="how-step">
        <p className="text-blue-600 text-2xl mb-2">②</p>
        <p className="font-medium">Upload your files</p>
      </div>

      <div className="how-step">
        <p className="text-blue-600 text-2xl mb-2">③</p>
        <p className="font-medium">Access anytime</p>
      </div>
    </div>

  </div>

  <style>{`
    .how-title {
      opacity: 0;
      transform: translateY(12px);
      animation: how-fade 0.6s ease-out forwards;
    }

    .how-step {
      opacity: 0;
      transform: translateY(14px);
      animation: how-fade 0.6s ease-out forwards;
    }

    .how-step:nth-child(1) { animation-delay: 0.15s; }
    .how-step:nth-child(2) { animation-delay: 0.3s; }
    .how-step:nth-child(3) { animation-delay: 0.45s; }

    @keyframes how-fade {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
</section>

        {/* PRICING — REFINED */}
<section className="pb-28 sm:pb-36">
  <div className="max-w-lg mx-auto px-4 text-center">

    <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
      Simple pricing
    </h2>

    <p className="text-gray-600 text-sm sm:text-base mb-10">
      Start free. Upgrade only if you need more space.
    </p>

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10">

      <p className="text-sm text-gray-500 mb-2">
        Free plan
      </p>

      <p className="text-4xl sm:text-5xl font-semibold mb-2">
        5GB
      </p>

      <p className="text-gray-600 mb-8">
        Free, forever
      </p>

      <Link
        to="/signup"
        className="block bg-blue-600 text-white py-3.5 rounded-xl font-medium"
      >
        Get started
      </Link>


      <p className="text-xs text-gray-500 mt-4">
        No credit card required
      </p>

    </div>

  </div>
</section>
        
      </main>
    
    </>
  );
}
