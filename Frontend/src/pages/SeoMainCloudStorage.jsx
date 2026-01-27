import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import SeoInternalLinks from "../components/SeoInternalLinks";

export default function CloudStorageMain() {
  return (
    <>
      <Helmet>
        <title>Secure Cloud Storage | SafeVault</title>
        <meta
          name="description"
          content="Private encrypted cloud storage built for security and privacy-first users."
        />

        {/* SOFTWARE SCHEMA FOR SEO */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "SafeVault Secure Cloud Storage",
            "applicationCategory": "CloudStorage",
            "operatingSystem": "Web",
            "description": "Privacy-first encrypted cloud storage with zero-knowledge encryption.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        `}
        </script>
      </Helmet>

      <main className="bg-white overflow-hidden">

        {/* HERO SECTION */}
        <section className="relative pt-32 pb-32 bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="max-w-6xl mx-auto px-6 text-center relative z-10">

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-gray-900 tracking-tight leading-tight">
              A cloud built for privacy.
            </h1>

            <p className="text-gray-600 text-xl mt-8 max-w-2xl mx-auto">
              SafeVault encrypts your files before they leave your device.  
              No tracking. No AI scanning. No access by anyone but you.
            </p>

            <div className="mt-12 flex justify-center gap-4">
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-10 py-4 rounded-xl font-medium text-lg shadow-lg shadow-blue-200"
              >
                Get started
              </Link>

              {/* FIXED LINK */}
              <Link
                to="/secure-cloud-storage"
                className="bg-white border border-gray-300 hover:border-gray-400 transition px-8 py-4 rounded-xl font-medium text-gray-900"
              >
                Learn more
              </Link>
            </div>
          </div>

          {/* Soft Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 via-transparent to-purple-100/30 blur-3xl" />
        </section>



        {/* PRIVACY MESSAGE */}
        <section className="py-28 bg-white border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-6 text-center">

            <p className="text-sm text-blue-600 font-medium mb-4">
              Your files. Your keys. Your cloud.
            </p>

            <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900">
              Designed for the surveillance era
            </h2>

            <p className="text-gray-600 mt-6 text-lg max-w-3xl mx-auto">
              Most cloud providers scan your files and build profiles.  
              SafeVault encrypts everything on your device so no one can read it — not even us.
            </p>

          </div>
        </section>



        {/* FEATURES GRID */}
        <section className="py-28 bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl font-semibold text-gray-900">
                Encrypt before upload
              </h3>
              <p className="text-gray-600 mt-4 text-lg">
                Files are encrypted locally on your device. Only you hold the keys.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl font-semibold text-gray-900">
                No tracking or profiling
              </h3>
              <p className="text-gray-600 mt-4 text-lg">
                SafeVault does not scan your files, show ads, or build profiles.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl font-semibold text-gray-900">
                Private sharing
              </h3>
              <p className="text-gray-600 mt-4 text-lg">
                Share encrypted files with expiring links and permission controls.
              </p>
            </div>

          </div>
        </section>



        {/* TRUST GRID */}
        <section className="py-24 bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">

            <div className="bg-gradient-to-b from-white to-gray-50 border border-gray-200 p-8 rounded-2xl">
              <p className="text-2xl font-semibold text-gray-900">AES-256</p>
              <p className="text-sm text-gray-500 mt-1">Encryption</p>
            </div>

            <div className="bg-gradient-to-b from-white to-gray-50 border border-gray-200 p-8 rounded-2xl">
              <p className="text-2xl font-semibold text-gray-900">Zero-Knowledge</p>
              <p className="text-sm text-gray-500 mt-1">Privacy</p>
            </div>

            <div className="bg-gradient-to-b from-white to-gray-50 border border-gray-200 p-8 rounded-2xl">
              <p className="text-2xl font-semibold text-gray-900">No Tracking</p>
              <p className="text-sm text-gray-500 mt-1">No ads</p>
            </div>

            <div className="bg-gradient-to-b from-white to-gray-50 border border-gray-200 p-8 rounded-2xl">
              <p className="text-2xl font-semibold text-gray-900">India Optimized</p>
              <p className="text-sm text-gray-500 mt-1">Fast servers</p>
            </div>

          </div>
        </section>



        {/* SEO CONTENT SECTION */}
        <section className="py-28 bg-gray-50 border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-6 space-y-8">

            <h2 className="text-4xl font-semibold text-gray-900">
              Secure Cloud Storage Built for Privacy
            </h2>

            <p className="text-lg text-gray-600">
              SafeVault is a privacy-first cloud storage platform that encrypts your files on your device before upload.
              Unlike traditional cloud providers, SafeVault cannot scan, track, or access your data.
            </p>

            <p className="text-gray-600">
              With zero-knowledge encryption, only you control your encryption keys. Even SafeVault cannot decrypt your files.
              This makes SafeVault ideal for individuals, businesses, and creators who need true data ownership.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900">
              SafeVault vs Traditional Cloud Storage
            </h3>

            <ul className="list-disc ml-6 text-gray-600 space-y-2">
              <li>Traditional providers scan files and metadata</li>
              <li>SafeVault encrypts files before upload</li>
              <li>Traditional providers monetize data with ads</li>
              <li>SafeVault has no ads, no tracking, no profiling</li>
            </ul>

          </div>
        </section>



        {/* USE CASES */}
        <section className="py-28 bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-semibold text-gray-900 text-center">
              Who Uses SafeVault?
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="border border-gray-200 p-6 rounded-2xl bg-white">
                <h3 className="font-semibold text-gray-900">Individuals</h3>
                <p className="text-gray-600 mt-2">
                  Store personal photos, documents, and backups securely.
                </p>
              </div>

              <div className="border border-gray-200 p-6 rounded-2xl bg-white">
                <h3 className="font-semibold text-gray-900">Businesses</h3>
                <p className="text-gray-600 mt-2">
                  Protect contracts, IP, and confidential company files.
                </p>
              </div>

              <div className="border border-gray-200 p-6 rounded-2xl bg-white">
                <h3 className="font-semibold text-gray-900">Creators & Freelancers</h3>
                <p className="text-gray-600 mt-2">
                  Share client files privately with full control.
                </p>
              </div>
            </div>
          </div>
        </section>



        {/* FAQ SECTION */}
        <section className="py-24 bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-6 space-y-6">
            <h2 className="text-3xl font-semibold text-gray-900">
              Secure Cloud Storage FAQ
            </h2>

            <div>
              <h3 className="font-medium text-gray-900">Is SafeVault safer than Google Drive?</h3>
              <p className="text-gray-600 mt-2">
                Yes. Google Drive can scan files. SafeVault encrypts files before upload so only you can read them.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900">Can SafeVault reset my password?</h3>
              <p className="text-gray-600 mt-2">
                No. Zero-knowledge encryption means SafeVault cannot recover your encryption keys.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900">Is SafeVault free?</h3>
              <p className="text-gray-600 mt-2">
                SafeVault offers free encrypted storage with optional premium upgrades.
              </p>
            </div>
          </div>
        </section>



        {/* SEO INTERNAL LINKS */}
        <SeoInternalLinks />

      </main>
    </>
  );
}
