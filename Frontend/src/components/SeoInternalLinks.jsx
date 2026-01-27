import { Link } from "react-router-dom";

export default function SeoInternalLinks() {
  return (
    <section className="bg-gray-50 border-t border-gray-200 py-12 text-sm text-gray-600">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-sm font-medium text-gray-700 mb-6">
          Explore SafeVault Cloud Storage
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Link to="/cloud-storage" className="hover:text-blue-600">Cloud Storage</Link>
          <Link to="/secure-cloud-storage" className="hover:text-blue-600">Secure Cloud Storage</Link>
          <Link to="/private-cloud-storage" className="hover:text-blue-600">Private Cloud Storage</Link>
          <Link to="/encrypted-cloud-storage" className="hover:text-blue-600">Encrypted Cloud Storage</Link>
          <Link to="/free-cloud-storage" className="hover:text-blue-600">Free Cloud Storage</Link>
          <Link to="/cloud-storage-india" className="hover:text-blue-600">Cloud Storage in India</Link>

          <Link to="/blog/secure-cloud-storage-guide" className="hover:text-blue-600">Secure Cloud Storage Guide</Link>
          <Link to="/blog/encrypted-cloud-storage-explained" className="hover:text-blue-600">Encrypted Cloud Storage Explained</Link>
          
          <Link to="/blog/best-cloud-storage-india" className="hover:text-blue-600">Best Cloud Storage India</Link>
          <Link to="/blog/google-drive-alternatives" className="hover:text-blue-600">Google Drive Alternatives</Link>
<Link to="/blog/cloud-storage-privacy-guide" className="hover:text-blue-600">Cloud Storage Privacy Guide</Link>
<Link to="/blog/how-zero-knowledge-encryption-works" className="hover:text-blue-600">Zero Knowledge Encryption Explained</Link>

          
          <Link to="/faq" className="hover:text-blue-600">Cloud Storage FAQ</Link>
        </div>
      </div>
    </section>
  );
}
