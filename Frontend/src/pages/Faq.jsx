import { Helmet } from "react-helmet-async";

export default function Faq() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is SafeVault encrypted?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. SafeVault uses client-side encryption and zero-knowledge architecture."
        }
      },
      {
        "@type": "Question",
        "name": "Is SafeVault free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. SafeVault offers free cloud storage with paid upgrades."
        }
      },
      {
        "@type": "Question",
        "name": "How is SafeVault different from Google Drive?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SafeVault does not scan files, track users, or show ads. Privacy is default."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>SafeVault FAQ - Secure Cloud Storage Questions</title>
        <meta name="description" content="Frequently asked questions about SafeVault encrypted cloud storage." />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
        <p className="mt-4 text-gray-600">
          Everything you need to know about SafeVault encrypted cloud storage.
        </p>

        <div className="mt-10 space-y-4">

          <details className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <summary className="cursor-pointer font-semibold text-gray-900">
              Is SafeVault encrypted?
            </summary>
            <p className="mt-2 text-gray-600">
              Yes. Files are encrypted before upload. Only you can decrypt them.
            </p>
          </details>

          <details className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <summary className="cursor-pointer font-semibold text-gray-900">
              Is SafeVault free?
            </summary>
            <p className="mt-2 text-gray-600">
              Yes. You get free storage with optional paid upgrades.
            </p>
          </details>

          <details className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <summary className="cursor-pointer font-semibold text-gray-900">
              How is SafeVault different from Google Drive or Dropbox?
            </summary>
            <p className="mt-2 text-gray-600">
              SafeVault is privacy-first. No tracking, no ads, no file scanning.
            </p>
          </details>

          <details className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <summary className="cursor-pointer font-semibold text-gray-900">
              Where are SafeVault servers located?
            </summary>
            <p className="mt-2 text-gray-600">
              SafeVault uses secure global infrastructure optimized for India.
            </p>
          </details>

        </div>
      </div>
    </>
  );
}
