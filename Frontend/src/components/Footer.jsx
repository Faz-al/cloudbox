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

          <nav className="flex gap-6 text-sm text-gray-600 flex-wrap justify-center">
  <Link to="/cloud-storage" className="hover:text-gray-900 font-medium">
    Cloud Storage
  </Link>

  <Link to="/blog" className="hover:text-gray-900">
    Blog
  </Link>

  <Link to="/faq" className="hover:text-gray-900">
    FAQ
  </Link>

  <Link to="/privacy" className="hover:text-gray-900">Privacy</Link>
  <Link to="/terms" className="hover:text-gray-900">Terms</Link>
  <Link to="/dmca" className="hover:text-gray-900">DMCA</Link>
  <Link to="/contact" className="hover:text-gray-900">Contact</Link>
</nav>


          





          <p className="text-xs text-gray-500">
            © 2026 SafeVault
          </p>

        </div>

      </div>
    </footer>
  );
}
