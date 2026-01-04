export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-20 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-10">

        <div className="flex flex-col items-center gap-6 text-center">

          <div>
            <p className="font-semibold text-gray-900">CloudBox</p>
            <p className="text-sm text-gray-600">
              Simple, secure cloud storage
            </p>
          </div>

          <nav className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900 transition">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-900 transition">
              Terms
            </a>
            <a href="#" className="hover:text-gray-900 transition">
              Contact
            </a>
          </nav>

          <p className="text-xs text-gray-500">
            © 2026 CloudBox
          </p>

        </div>

      </div>
    </footer>
  );
}
