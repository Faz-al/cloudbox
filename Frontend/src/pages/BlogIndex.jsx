import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function BlogIndex() {
  return (
    <>
      <Helmet>
        <title>SafeVault Blog | Secure Cloud Storage Guides</title>
        <meta
          name="description"
          content="Learn about encrypted cloud storage, privacy, and secure file storage best practices."
        />
      </Helmet>

      <main className="bg-white min-h-screen">

        {/* HERO */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-5xl sm:text-6xl font-semibold text-gray-900 tracking-tight">
              SafeVault Blog
            </h1>
            <p className="text-gray-600 text-lg mt-6 max-w-2xl mx-auto">
              Deep guides on encrypted cloud storage, privacy, and secure file protection.
              Learn how to protect your data in the AI era.
            </p>
          </div>
        </section>



    {/* BLOG GRID */}
<section className="py-20 bg-white">
  <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

    {/* EXISTING BLOGS */}
    <Link to="/blog/secure-cloud-storage-guide" className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
      <p className="text-xs text-blue-600 font-medium mb-3">GUIDE</p>
      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
        Secure Cloud Storage Guide
      </h2>
      <p className="text-gray-600 mt-3 text-sm">Beginner-to-expert guide on secure cloud storage.</p>
      <p className="mt-4 text-sm font-medium text-blue-600">Read guide →</p>
    </Link>

    <Link to="/blog/encrypted-cloud-storage-explained" className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
      <p className="text-xs text-purple-600 font-medium mb-3">EXPLAINER</p>
      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition">
        Encrypted Cloud Storage Explained
      </h2>
      <p className="text-gray-600 mt-3 text-sm">Learn how encryption and zero-knowledge storage works.</p>
      <p className="mt-4 text-sm font-medium text-purple-600">Read explainer →</p>
    </Link>

    <Link to="/blog/best-cloud-storage-india" className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
      <p className="text-xs text-green-600 font-medium mb-3">COMPARISON</p>
      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition">
        Best Cloud Storage in India
      </h2>
      <p className="text-gray-600 mt-3 text-sm">Compare Google Drive, Dropbox, and SafeVault.</p>
      <p className="mt-4 text-sm font-medium text-green-600">Read comparison →</p>
    </Link>


    {/* 🔥 NEW BLOGS */}
    <Link to="/blog/google-drive-alternatives" className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
      <p className="text-xs text-orange-600 font-medium mb-3">ALTERNATIVES</p>
      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition">
        Google Drive Alternatives
      </h2>
      <p className="text-gray-600 mt-3 text-sm">Best privacy-focused alternatives to Google Drive.</p>
      <p className="mt-4 text-sm font-medium text-orange-600">Read article →</p>
    </Link>

    <Link to="/blog/cloud-storage-privacy-guide" className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
      <p className="text-xs text-indigo-600 font-medium mb-3">PRIVACY</p>
      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition">
        Cloud Storage Privacy Guide
      </h2>
      <p className="text-gray-600 mt-3 text-sm">Learn how to keep your cloud files private.</p>
      <p className="mt-4 text-sm font-medium text-indigo-600">Read guide →</p>
    </Link>

    <Link to="/blog/how-zero-knowledge-encryption-works" className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
      <p className="text-xs text-pink-600 font-medium mb-3">TECH</p>
      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition">
        How Zero Knowledge Encryption Works
      </h2>
      <p className="text-gray-600 mt-3 text-sm">Deep technical explanation of zero-knowledge encryption.</p>
      <p className="mt-4 text-sm font-medium text-pink-600">Read article →</p>
    </Link>

  </div>
</section>




        {/* CTA SECTION */}
        <section className="py-20 bg-gray-50 border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold text-gray-900">
              Ready to secure your files?
            </h2>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              SafeVault encrypts your files before upload so only you can access them.
            </p>

            <div className="mt-8">
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
              >
                Get started free
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
