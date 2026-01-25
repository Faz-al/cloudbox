export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-slate-800">
      <h1 className="text-4xl font-bold mb-6">Contact SafeVault</h1>

      <p className="text-lg text-slate-600 max-w-2xl">
        We’re here to help. Whether you have a question about your account,
        file access, billing, copyright, or anything else, our team is ready
        to assist you.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="border rounded-xl p-6 bg-white shadow-sm">
          <h2 className="font-semibold text-lg mb-2">Support & General Inquiries</h2>
          <p className="text-slate-600 mb-4">
            For help with your account, files, payments, or technical issues.
          </p>
          <p className="font-medium text-slate-900">support@SafeVault.app</p>
        </div>

        <div className="border rounded-xl p-6 bg-white shadow-sm">
          <h2 className="font-semibold text-lg mb-2">Copyright & DMCA</h2>
          <p className="text-slate-600 mb-4">
            For reporting copyright infringement or submitting legal notices.
          </p>
          <p className="font-medium text-slate-900">dmca@SafeVault.app</p>
        </div>
      </div>

      <div className="mt-16 text-sm text-slate-500 max-w-2xl">
        <p>
          SafeVault is a cloud storage and file sharing platform designed to
          provide secure, reliable, and user-controlled access to your digital
          content. We aim to respond to all legitimate inquiries as quickly as
          possible.
        </p>
      </div>
    </div>
  );
}
