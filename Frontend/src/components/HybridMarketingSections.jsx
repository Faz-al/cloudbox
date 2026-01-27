import { Link } from "react-router-dom";

export default function HybridMarketingSections() {
  return (
    <>

{/* ================= TRUST LOGOS ================= */}
<section className="py-16 bg-white border-t border-gray-200">
  <div className="max-w-6xl mx-auto px-4 text-center">
    <p className="text-xs uppercase tracking-widest text-gray-400 mb-6">
      Trusted by privacy-first users worldwide
    </p>
    <div className="flex flex-wrap justify-center gap-12 text-gray-500 font-medium text-sm">
      <span>Creators</span>
      <span>Startups</span>
      <span>Security Engineers</span>
      <span>Developers</span>
      <span>Privacy Advocates</span>
    </div>
  </div>
</section>


{/* ================= SECURITY STORY ================= */}
<section className="py-28 bg-gradient-to-b from-white to-slate-50">
  <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

    <div>
      <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6">
        Security before upload. Not after.
      </h2>
      <p className="text-gray-600 text-lg mb-6">
        SafeVault encrypts files on your device. No one else can read them. Not even us.
      </p>

      <ul className="space-y-4 text-gray-700 text-base">
        <li>• Client-side AES-256 encryption</li>
        <li>• Zero-knowledge architecture</li>
        <li>• No tracking, no AI scanning</li>
        <li>• Secure expiring share links</li>
      </ul>
    </div>

    <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
      <div className="h-40 bg-gradient-to-br from-blue-100 to-white rounded-xl flex items-center justify-center text-blue-600 font-semibold">
        🔒 Encryption Pipeline Visualization
      </div>
    </div>

  </div>
</section>


{/* ================= USE CASES ================= */}
<section className="py-24 bg-white">
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="text-3xl font-semibold text-gray-900 text-center mb-14">
      Built for everyone who values privacy
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      <div className="bg-white border p-8 rounded-2xl shadow-sm">
        <h3 className="font-semibold">Personal</h3>
        <p className="text-sm text-gray-600 mt-2">Photos, videos, personal files — private forever.</p>
      </div>

      <div className="bg-white border p-8 rounded-2xl shadow-sm">
        <h3 className="font-semibold">Creators</h3>
        <p className="text-sm text-gray-600 mt-2">Protect intellectual property and raw content.</p>
      </div>

      <div className="bg-white border p-8 rounded-2xl shadow-sm">
        <h3 className="font-semibold">Teams</h3>
        <p className="text-sm text-gray-600 mt-2">Secure collaboration without surveillance.</p>
      </div>
    </div>
  </div>
</section>


{/* ================= TESTIMONIALS ================= */}
<section className="py-24 bg-gradient-to-b from-white to-slate-50">
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="text-3xl font-semibold text-gray-900 text-center mb-14">
      Loved by security-focused professionals
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      <div className="bg-white border p-8 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-700 mb-4">
          “SafeVault is the only cloud I trust with confidential projects.”
        </p>
        <p className="text-xs text-gray-500">Security Engineer</p>
      </div>

      <div className="bg-white border p-8 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-700 mb-4">
          “Finally a cloud without AI surveillance or ads.”
        </p>
        <p className="text-xs text-gray-500">Content Creator</p>
      </div>

      <div className="bg-white border p-8 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-700 mb-4">
          “Private storage without enterprise complexity.”
        </p>
        <p className="text-xs text-gray-500">Startup Founder</p>
      </div>
    </div>
  </div>
</section>


{/* ================= PRICING TEASER ================= */}
<section className="py-24 bg-white">
  <div className="max-w-6xl mx-auto px-4 text-center">
    <h2 className="text-3xl font-semibold text-gray-900 mb-10">
      Simple pricing
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      <div className="bg-white border p-8 rounded-2xl shadow-sm">
        <h3 className="font-semibold">Free</h3>
        <p className="text-3xl font-bold mt-4">₹0</p>
        <p className="text-sm text-gray-500 mt-2">5GB encrypted</p>
      </div>

      <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-xl scale-105">
        <h3 className="font-semibold">Pro</h3>
        <p className="text-3xl font-bold mt-4">₹199/mo</p>
        <p className="text-sm text-blue-100 mt-2">1TB secure</p>
      </div>

      <div className="bg-white border p-8 rounded-2xl shadow-sm">
        <h3 className="font-semibold">Enterprise</h3>
        <p className="text-3xl font-bold mt-4">Custom</p>
        <p className="text-sm text-gray-500 mt-2">Unlimited storage</p>
      </div>
    </div>
  </div>
</section>


{/* ================= FINAL CTA ================= */}
<section className="py-28 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
  <h2 className="text-4xl font-semibold mb-6">
    Own your digital life.
  </h2>

  <p className="text-blue-100 text-lg mb-10">
    Join SafeVault and control your data forever.
  </p>

  <Link to="/signup" className="bg-white text-blue-700 px-10 py-4 rounded-xl font-semibold text-lg shadow-xl">
    Start with 5 GB free
  </Link>

  <p className="text-xs text-blue-200 mt-6">
    No credit card · Private by default
  </p>
</section>

    </>
  );
}
