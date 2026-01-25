import { Link } from "react-router-dom";



export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-20 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-10">

        <div className="flex flex-col items-center gap-6 text-center">

          <div>
            <p className="font-semibold text-gray-900">SafeVault</p>
            <p className="text-sm text-gray-600">
              Simple, secure cloud storage
            </p>
          </div>

          <nav className="flex gap-6 text-sm text-gray-600">
  <Link to="/privacy" className="hover:text-gray-900 transition">
    Privacy
  </Link>

  <Link to="/terms" className="hover:text-gray-900 transition">
    Terms
  </Link>

  <Link to="/dmca" className="hover:text-gray-900 transition">
    DMCA
  </Link>

  <Link to="/contact" className="hover:text-gray-900 transition">
    Contact
  </Link>
</nav>
          

          {/* SEO Content (for Google, subtle for users) */}
<div className="max-w-4xl mx-auto text-[11px] text-gray-400 leading-relaxed mt-6 text-center">

  <h2 className="text-xs font-medium text-gray-500">
    Secure Cloud Storage for Photos, Videos and Files
  </h2>

  <p className="mt-1">
    SafeVault is a privacy-first cloud storage platform for storing photos, videos,
    documents and personal files securely. SafeVault encrypts your data and keeps it private by default.
    Get 5GB free secure cloud storage today.
  </p>

</div>




          <p className="text-xs text-gray-500">
            © 2026 SafeVault
          </p>

        </div>

      </div>
    </footer>
  );
}
