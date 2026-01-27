import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import SeoInternalLinks from "../components/SeoInternalLinks";


const Layout = ({ title, desc, children }) => (
  <>
    <Helmet>
      <title>{title} | SafeVault</title>
      <meta name="description" content={desc} />
    </Helmet>

<main className="bg-white">


      <header className="bg-gray-50 border-b border-gray-200">
  <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">

    <div className="flex items-center gap-3 mb-4">
      <img 
        src="/safevault-favicon.png" 
        alt="SafeVault" 
        className="w-6 h-6 rounded-md"
      />
      <span className="text-sm font-medium text-gray-500">SafeVault Cloud Storage</span>
    </div>

    <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900">{title}</h1>
    <p className="text-gray-600 text-lg mt-4">{desc}</p>
  </div>
</header>




      {/* HERO — MATCHES HOME PAGE */}
      

      {/* CONTENT SECTION (PREMIUM SAAS LOOK) */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
       

        {/* SEO TEXT CONTENT */}
        <div className="prose prose-gray max-w-none">
  {children}
</div>
<hr className="my-16 border-gray-200" />


{/* COMPARISON TABLE */}
<div className="mt-20">
  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
    SafeVault vs Google Drive & Dropbox
  </h2>

  <div className="overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow-sm">
    <table className="w-full text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-4 text-left">Feature</th>
          <th className="p-4 text-left font-semibold text-blue-600">SafeVault</th>
          <th className="p-4 text-left">Google Drive</th>
          <th className="p-4 text-left">Dropbox</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        <tr>
          <td className="p-4">End-to-end encryption</td>
          <td className="p-4 font-medium text-blue-600">Yes</td>
          <td className="p-4">No</td>
          <td className="p-4">No</td>
        </tr>
        <tr>
          <td className="p-4">File scanning / ads</td>
          <td className="p-4 font-medium text-blue-600">No</td>
          <td className="p-4">Yes</td>
          <td className="p-4">Yes</td>
        </tr>
        <tr>
          <td className="p-4">Zero-knowledge privacy</td>
          <td className="p-4 font-medium text-blue-600">Yes</td>
          <td className="p-4">No</td>
          <td className="p-4">No</td>
        </tr>
        <tr>
          <td className="p-4">Free storage</td>
          <td className="p-4 font-medium text-blue-600">5 GB</td>
          <td className="p-4">15 GB</td>
          <td className="p-4">2 GB</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>





<SeoInternalLinks />

      </section>

    </main>
  </>
);


export function SecureCloudStorage() {
  return (
    <Layout
      title="Secure Cloud Storage for Files, Photos and Videos"
      desc="SafeVault delivers enterprise-grade secure cloud storage with encryption, privacy-first design, and full control over your data."
    >
<section className="py-16">
  <div className="max-w-4xl">
    <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
      Secure cloud storage built for the privacy era
    </h2>
    <p className="text-lg text-gray-600 mt-4">
      Most cloud providers can read your files. SafeVault encrypts everything before upload so only you control access.
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
    <div className="border border-gray-200 p-6 rounded-2xl bg-white">
      <h3 className="font-medium text-gray-900">End-to-end encryption</h3>
      <p className="text-sm text-gray-600 mt-2">
        Files are encrypted on your device. SafeVault never sees your content.
      </p>
    </div>

    <div className="border border-gray-200 p-6 rounded-2xl bg-white">
      <h3 className="font-medium text-gray-900">Zero-knowledge architecture</h3>
      <p className="text-sm text-gray-600 mt-2">
        Only you hold encryption keys. Not even SafeVault can decrypt your data.
      </p>
    </div>

    <div className="border border-gray-200 p-6 rounded-2xl bg-white">
      <h3 className="font-medium text-gray-900">Private file sharing</h3>
      <p className="text-sm text-gray-600 mt-2">
        Share files with expiring links and permission control.
      </p>
    </div>
  </div>
</section>

<section className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-16 border-t border-gray-200 text-center">
  <div>
    <p className="text-2xl font-semibold text-gray-900">AES-256</p>
    <p className="text-sm text-gray-500">Encryption</p>
  </div>
  <div>
    <p className="text-2xl font-semibold text-gray-900">Zero-Knowledge</p>
    <p className="text-sm text-gray-500">Privacy</p>
  </div>
  <div>
    <p className="text-2xl font-semibold text-gray-900">No Tracking</p>
    <p className="text-sm text-gray-500">No ads</p>
  </div>
  <div>
    <p className="text-2xl font-semibold text-gray-900">Global Cloud</p>
    <p className="text-sm text-gray-500">Fast access</p>
  </div>
</section>

<section className="py-16 border-t border-gray-200 grid md:grid-cols-2 gap-12">
  <div>
    <h2 className="text-3xl font-semibold text-gray-900">
      How SafeVault encryption works
    </h2>
    <p className="text-gray-600 mt-4">
      SafeVault encrypts your files locally before they leave your device, ensuring true zero-knowledge storage.
    </p>
  </div>

  <div className="space-y-4 text-gray-700">
    <p>• Files are encrypted locally using AES-256</p>
    <p>• Encrypted data is uploaded to SafeVault servers</p>
    <p>• Only your password and device can decrypt files</p>
  </div>
</section>

<section className="py-16 border-t border-gray-200">
  <h2 className="text-3xl font-semibold text-gray-900">Who uses SafeVault</h2>

  <div className="grid sm:grid-cols-3 gap-6 mt-8">
    <div className="border border-gray-200 p-6 rounded-xl">
      <h3 className="font-medium">Individuals</h3>
      <p className="text-sm text-gray-600 mt-2">Store photos, documents, and personal backups securely.</p>
    </div>

    <div className="border border-gray-200 p-6 rounded-xl">
      <h3 className="font-medium">Businesses</h3>
      <p className="text-sm text-gray-600 mt-2">Protect contracts, intellectual property, and internal files.</p>
    </div>

    <div className="border border-gray-200 p-6 rounded-xl">
      <h3 className="font-medium">Creators & Freelancers</h3>
      <p className="text-sm text-gray-600 mt-2">Share client files privately with full control.</p>
    </div>
  </div>
</section>

<section className="py-16 border-t border-gray-200 max-w-4xl">
  <h2 className="text-3xl font-semibold text-gray-900">Security architecture</h2>
  <p className="text-lg text-gray-600 mt-4">
    Files are encrypted on your device, transferred securely, and stored without readable access.
  </p>
  <p className="text-gray-600 mt-4">
    SafeVault uses AES-256 encryption, TLS 1.3 transport security, and zero-knowledge key handling.
  </p>
</section>

<section className="py-16 border-t border-gray-200 max-w-4xl">
  <h2 className="text-3xl font-semibold text-gray-900">Frequently asked questions</h2>

  <div className="mt-8 space-y-6">
    <div>
      <h3 className="font-medium text-gray-900">Is SafeVault safer than Google Drive?</h3>
      <p className="text-gray-600 mt-2">
        Yes. Google Drive can scan files. SafeVault encrypts files before upload so no one can read them.
      </p>
    </div>

    <div>
      <h3 className="font-medium text-gray-900">Can SafeVault reset my password?</h3>
      <p className="text-gray-600 mt-2">
        No. Zero-knowledge encryption means SafeVault cannot recover encryption keys.
      </p>
    </div>
  </div>
</section>

    </Layout>
  );
}

export function PrivateCloudStorage() {
  return (
    <Layout
      title="Private Cloud Storage With Zero Tracking"
      desc="Private cloud storage where only you control your files, encryption keys, and privacy."
    >

<section className="py-20 bg-white">
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900 tracking-tight">
      Your Data, Your Rules
    </h2>

    <p className="text-lg text-gray-600 mt-6 max-w-3xl">
      Private cloud storage means you control your data without third-party surveillance, profiling, or AI scanning.
      SafeVault is built for users who want full privacy, ownership, and sovereignty over their files, photos, and documents.
    </p>

    <p className="text-gray-600 mt-4 max-w-3xl">
      Unlike traditional cloud providers, SafeVault does not monetize your data, scan your files, or build behavioral profiles.
      Your files remain encrypted, private, and accessible only by you.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 my-14">
      <div className="border border-gray-200 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-900 text-lg">No Tracking</h3>
        <p className="text-gray-600 mt-3">
          SafeVault does not scan files, track usage, or collect personal analytics. Your activity stays private.
        </p>
      </div>

      <div className="border border-gray-200 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-900 text-lg">Private Encryption Keys</h3>
        <p className="text-gray-600 mt-3">
          Only you hold encryption keys. SafeVault cannot decrypt, view, or recover your files.
        </p>
      </div>

      <div className="border border-gray-200 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-900 text-lg">Full Sharing Control</h3>
        <p className="text-gray-600 mt-3">
          Set permissions, expiration dates, and revoke access anytime with encrypted sharing links.
        </p>
      </div>
    </div>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-gray-50">
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">How Private Cloud Storage Works</h2>

    <p className="text-gray-600 mt-6 max-w-3xl">
      SafeVault uses client-side encryption to ensure your data is protected before it reaches the cloud.
      This guarantees zero-knowledge privacy and full data ownership.
    </p>

    <ul className="mt-8 space-y-3 text-gray-700 bg-white p-6 rounded-2xl border border-gray-200">
      <li>• Client-side encryption before upload using strong cryptography</li>
      <li>• Encrypted storage across distributed cloud infrastructure</li>
      <li>• Decryption only happens on your device, never on SafeVault servers</li>
      <li>• No plaintext data is stored or processed in the cloud</li>
    </ul>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-white">
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">Use Cases for Private Cloud Storage</h2>

    <ul className="mt-8 space-y-4 text-gray-700 bg-gray-50 p-6 rounded-2xl border border-gray-200">
      <li>• Journalists and activists protecting sensitive sources and documents</li>
      <li>• Businesses storing confidential contracts, IP, and internal files</li>
      <li>• Privacy-focused individuals securing personal files and backups</li>
      <li>• Creators and freelancers sharing client files without third-party access</li>
    </ul>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-gray-50">
  <div className="max-w-4xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">Security Model</h2>

    <p className="text-lg text-gray-600 mt-6">
      SafeVault is built with a privacy-first security architecture that ensures no one but you can access your data.
    </p>

    <p className="text-gray-600 mt-4">
      The platform uses zero-knowledge encryption, hardened infrastructure, secure key derivation, and encrypted file sharing protocols.
      No logs, no tracking, and no third-party analytics are used.
    </p>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-white">
  <div className="max-w-4xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">Frequently Asked Questions</h2>

    <div className="mt-8 space-y-6">
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
        <h3 className="font-semibold text-gray-900">Is SafeVault self-hosted?</h3>
        <p className="text-gray-600 mt-2">
          No. SafeVault is a managed private cloud with client-side encryption. You get privacy without managing servers.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
        <h3 className="font-semibold text-gray-900">Can SafeVault access my files?</h3>
        <p className="text-gray-600 mt-2">
          No. SafeVault never stores encryption keys, so it cannot decrypt or view your data.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
        <h3 className="font-semibold text-gray-900">Is private cloud storage legal?</h3>
        <p className="text-gray-600 mt-2">
          Yes. Private encrypted cloud storage is legal in most countries and used by enterprises, journalists, and privacy-conscious users worldwide.
        </p>
      </div>
    </div>
  </div>
</section>

    </Layout>
  );
}

export function EncryptedCloudStorage() {
  return (
    <Layout
      title="End-to-End Encrypted Cloud Storage"
      desc="Client-side encrypted cloud storage built for security and compliance."
    >

<section className="py-20 bg-white">
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900 tracking-tight">
      End-to-End Encrypted Cloud Storage
    </h2>

    <p className="text-lg text-gray-600 mt-6 max-w-3xl">
      Encrypted cloud storage ensures your files cannot be read by cloud providers, hackers, advertisers, or governments.
      SafeVault encrypts your data on your device before upload, so only you can decrypt and access your files.
    </p>

    <p className="text-gray-600 mt-4 max-w-3xl">
      Unlike traditional cloud storage services that encrypt data on their servers, SafeVault uses true client-side encryption,
      meaning your data is protected before it ever reaches the cloud.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 my-14">
      <div className="border border-gray-200 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-900 text-lg">AES-256 Encryption</h3>
        <p className="text-gray-600 mt-3">
          Industry-standard encryption used by banks, governments, and enterprise security systems worldwide.
        </p>
      </div>

      <div className="border border-gray-200 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-900 text-lg">Client-Side Encryption</h3>
        <p className="text-gray-600 mt-3">
          Files are encrypted before upload, ensuring SafeVault servers never see plaintext data.
        </p>
      </div>

      <div className="border border-gray-200 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-900 text-lg">Encrypted Sharing</h3>
        <p className="text-gray-600 mt-3">
          Share encrypted files securely with granular permission control and link expiration.
        </p>
      </div>
    </div>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-gray-50">
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">
      How Encrypted Cloud Storage Works
    </h2>

    <p className="text-gray-600 mt-6 max-w-3xl">
      SafeVault follows a zero-knowledge encryption model to ensure complete privacy and data sovereignty.
      Your encryption keys never leave your device, and no third party can decrypt your files.
    </p>

    <ul className="mt-8 space-y-3 text-gray-700 bg-white p-6 rounded-2xl border border-gray-200">
      <li>• Files are encrypted locally using AES-256 before upload</li>
      <li>• Encrypted files are transmitted using secure TLS 1.3 connections</li>
      <li>• Encrypted data is stored across distributed cloud infrastructure</li>
      <li>• Only your password and device can decrypt the data</li>
      <li>• SafeVault never stores or processes encryption keys</li>
    </ul>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-white">
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">Use Cases</h2>

    <ul className="mt-8 space-y-4 text-gray-700 bg-gray-50 p-6 rounded-2xl border border-gray-200">
      <li>• Legal and compliance-driven businesses storing confidential documents</li>
      <li>• Healthcare professionals storing sensitive patient records</li>
      <li>• Developers storing proprietary source code and intellectual property</li>
      <li>• Enterprises requiring encrypted backups and disaster recovery</li>
      <li>• Individuals protecting personal files from surveillance and data breaches</li>
    </ul>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-gray-50">
  <div className="max-w-4xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">Security Model</h2>

    <p className="text-lg text-gray-600 mt-6">
      SafeVault is designed with a cryptographic security architecture focused on confidentiality, integrity, and availability.
    </p>

    <p className="text-gray-600 mt-4">
      The platform uses cryptographic key derivation (PBKDF2 / Argon2), zero-knowledge encryption,
      hardened storage infrastructure, and strict access isolation to prevent unauthorized access.
      No plaintext data, keys, or passwords are stored on SafeVault servers.
    </p>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-white">
  <div className="max-w-4xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">Frequently Asked Questions</h2>

    <div className="mt-8 space-y-6">
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
        <h3 className="font-semibold text-gray-900">Can SafeVault decrypt my files?</h3>
        <p className="text-gray-600 mt-2">
          No. SafeVault never stores your encryption keys, so it cannot decrypt or view your files.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
        <h3 className="font-semibold text-gray-900">What happens if I forget my password?</h3>
        <p className="text-gray-600 mt-2">
          Your encrypted data cannot be recovered. This is required for true zero-knowledge privacy.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
        <h3 className="font-semibold text-gray-900">Is encrypted cloud storage compliant?</h3>
        <p className="text-gray-600 mt-2">
          Yes. End-to-end encryption is used in GDPR, HIPAA, and enterprise compliance workflows to protect sensitive data.
        </p>
      </div>
    </div>
  </div>
</section>

   </Layout>
  );
}


export function FreeCloudStorage() {
  return (
    <Layout
      title="Free Cloud Storage With Encryption"
      desc="Get 5GB free encrypted cloud storage with no ads and no tracking."
    >

<section className="py-20 bg-white">
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900 tracking-tight">
      Free Encrypted Cloud Storage
    </h2>

    <p className="text-lg text-gray-600 mt-6 max-w-3xl">
      SafeVault offers free cloud storage with full end-to-end encryption and zero tracking.
      Get started with 5GB free storage and upgrade anytime for more space and advanced features.
    </p>

    <p className="text-gray-600 mt-4 max-w-3xl">
      Unlike most free cloud storage providers, SafeVault does not show ads, scan files, or sell user data.
      Your free storage is protected with the same encryption technology used in paid plans.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 my-14">
      <div className="border border-gray-200 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-900 text-lg">5GB Free Storage</h3>
        <p className="text-gray-600 mt-3">
          Store documents, photos, and videos securely without paying anything.
        </p>
      </div>

      <div className="border border-gray-200 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-900 text-lg">No Ads or Tracking</h3>
        <p className="text-gray-600 mt-3">
          Free users are never tracked, profiled, or monetized through advertising.
        </p>
      </div>

      <div className="border border-gray-200 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-900 text-lg">Upgrade Anytime</h3>
        <p className="text-gray-600 mt-3">
          Seamlessly expand storage with premium plans when you need more space.
        </p>
      </div>
    </div>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-gray-50">
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">
      How Free Cloud Storage Works
    </h2>

    <p className="text-gray-600 mt-6 max-w-3xl">
      SafeVault provides free encrypted storage to help users experience privacy-first cloud storage without any cost.
      All files are encrypted before upload, ensuring no one else can read your data.
    </p>

    <ul className="mt-8 space-y-3 text-gray-700 bg-white p-6 rounded-2xl border border-gray-200">
      <li>• Create an account and receive 5GB of free storage instantly</li>
      <li>• Upload encrypted files from any device, browser, or app</li>
      <li>• Access your files securely from anywhere in the world</li>
      <li>• Upgrade seamlessly for more storage and premium features</li>
    </ul>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-white">
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">Use Cases</h2>

    <ul className="mt-8 space-y-4 text-gray-700 bg-gray-50 p-6 rounded-2xl border border-gray-200">
      <li>• Students storing assignments, projects, and study materials</li>
      <li>• Personal backups for photos, documents, and important files</li>
      <li>• Testing SafeVault privacy features before upgrading to paid plans</li>
      <li>• Freelancers sharing small encrypted files with clients</li>
      <li>• Anyone needing a private alternative to Google Drive or Dropbox</li>
    </ul>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-gray-50">
  <div className="max-w-4xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">Security</h2>

    <p className="text-lg text-gray-600 mt-6">
      Even free SafeVault accounts use the same encryption and privacy architecture as premium plans.
    </p>

    <p className="text-gray-600 mt-4">
      Files are encrypted using AES-256 on your device, transferred using secure TLS connections,
      and stored in zero-knowledge cloud infrastructure. SafeVault never scans, indexes, or monetizes your data.
    </p>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-white">
  <div className="max-w-4xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">Frequently Asked Questions</h2>

    <div className="mt-8 space-y-6">
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
        <h3 className="font-semibold text-gray-900">Is free storage really private?</h3>
        <p className="text-gray-600 mt-2">
          Yes. Free users get the same end-to-end encryption and zero-knowledge privacy as paid users.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
        <h3 className="font-semibold text-gray-900">How long is the free plan available?</h3>
        <p className="text-gray-600 mt-2">
          The free plan has no expiration. You can upgrade anytime for additional storage and features.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
        <h3 className="font-semibold text-gray-900">Can I downgrade back to free?</h3>
        <p className="text-gray-600 mt-2">
          Yes. You can downgrade at any time and keep your free storage quota.
        </p>
      </div>
    </div>
  </div>
</section>

    </Layout>
  );
}

export function CloudStorageIndia() {
  return (
    <Layout
      title="Best Cloud Storage in India With Privacy"
      desc="Fast encrypted cloud storage optimized for Indian users."
    >

<section className="py-20 bg-white">
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900 tracking-tight">
      Cloud Storage Optimized for India
    </h2>

    <p className="text-lg text-gray-600 mt-6 max-w-3xl">
      SafeVault delivers fast, encrypted cloud storage for Indian users with low latency, privacy-first architecture,
      and global reliability. Store files securely without surveillance or data mining.
    </p>

    <p className="text-gray-600 mt-4 max-w-3xl">
      Whether you are a startup, student, freelancer, or enterprise, SafeVault provides a private alternative
      to Google Drive, Dropbox, and OneDrive with strong encryption and full data ownership.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 my-14">
      <div className="border border-gray-200 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-900 text-lg">Low Latency Access</h3>
        <p className="text-gray-600 mt-3">
          Optimized for fast uploads and downloads across India with global CDN acceleration.
        </p>
      </div>

      <div className="border border-gray-200 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-900 text-lg">India Data Privacy Ready</h3>
        <p className="text-gray-600 mt-3">
          Built with privacy-first encryption and compliance-ready architecture for Indian data protection laws.
        </p>
      </div>

      <div className="border border-gray-200 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-900 text-lg">Global Access</h3>
        <p className="text-gray-600 mt-3">
          Access encrypted files worldwide with secure distributed cloud infrastructure.
        </p>
      </div>
    </div>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-gray-50">
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">
      How Cloud Storage Works in India
    </h2>

    <p className="text-gray-600 mt-6 max-w-3xl">
      SafeVault ensures fast performance for Indian users while maintaining global security standards.
      Files are encrypted locally and transmitted securely to cloud infrastructure optimized for Indian networks.
    </p>

    <ul className="mt-8 space-y-3 text-gray-700 bg-white p-6 rounded-2xl border border-gray-200">
      <li>• Fast CDN-backed uploads and downloads across Indian regions</li>
      <li>• Client-side encryption to prevent unauthorized access</li>
      <li>• Reliable global cloud infrastructure with redundancy</li>
      <li>• Secure access from India and abroad with encrypted connections</li>
    </ul>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-white">
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">Use Cases in India</h2>

    <ul className="mt-8 space-y-4 text-gray-700 bg-gray-50 p-6 rounded-2xl border border-gray-200">
      <li>• Startups storing company documents, designs, and internal files</li>
      <li>• Students and professionals backing up assignments and important documents</li>
      <li>• Businesses handling sensitive customer data and contracts</li>
      <li>• Freelancers sharing client files securely without third-party access</li>
      <li>• Individuals protecting personal photos and files from surveillance</li>
    </ul>
  </div>
</section>



{/* 🔥 COMPARISON SECTION (SEO GOLD) */}
<section className="py-20 border-t border-gray-200 bg-gray-50">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">
      Best Cloud Storage in India vs Google Drive vs Dropbox
    </h2>

    <p className="text-gray-600 mt-6 max-w-3xl">
      Compare SafeVault with popular cloud storage providers in India. Unlike Google Drive and Dropbox,
      SafeVault focuses on privacy, encryption, and data ownership.
    </p>

    <div className="overflow-x-auto mt-10">
      <table className="w-full border border-gray-200 bg-white rounded-xl overflow-hidden text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left font-semibold">Feature</th>
            <th className="p-4 text-left font-semibold">SafeVault</th>
            <th className="p-4 text-left font-semibold">Google Drive</th>
            <th className="p-4 text-left font-semibold">Dropbox</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="p-4">Client-side encryption</td>
            <td className="p-4 text-green-600 font-medium">Yes</td>
            <td className="p-4 text-red-600">No</td>
            <td className="p-4 text-red-600">No</td>
          </tr>
          <tr>
            <td className="p-4">Zero-knowledge privacy</td>
            <td className="p-4 text-green-600 font-medium">Yes</td>
            <td className="p-4 text-red-600">No</td>
            <td className="p-4 text-red-600">No</td>
          </tr>
          <tr>
            <td className="p-4">File scanning & AI analysis</td>
            <td className="p-4 text-green-600 font-medium">No</td>
            <td className="p-4 text-red-600">Yes</td>
            <td className="p-4 text-red-600">Yes</td>
          </tr>
          <tr>
            <td className="p-4">Ads & tracking</td>
            <td className="p-4 text-green-600 font-medium">No</td>
            <td className="p-4 text-red-600">Yes</td>
            <td className="p-4 text-red-600">Yes</td>
          </tr>
          <tr>
            <td className="p-4">India optimized performance</td>
            <td className="p-4 text-green-600 font-medium">Yes</td>
            <td className="p-4">Limited</td>
            <td className="p-4">Limited</td>
          </tr>
          <tr>
            <td className="p-4">Free storage</td>
            <td className="p-4">5GB+</td>
            <td className="p-4">15GB</td>
            <td className="p-4">2GB</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p className="text-gray-600 mt-6 max-w-4xl">
      SafeVault is designed for users in India who want fast cloud storage without sacrificing privacy.
      Unlike mainstream providers, SafeVault does not monetize user data or analyze stored files.
    </p>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-white">
  <div className="max-w-4xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">Security</h2>

    <p className="text-lg text-gray-600 mt-6">
      SafeVault follows global encryption standards while ensuring privacy for Indian users.
    </p>

    <p className="text-gray-600 mt-4">
      Files are encrypted using AES-256 on your device, transferred via secure TLS connections,
      and stored in zero-knowledge cloud infrastructure. SafeVault does not scan, track, or monetize your data.
    </p>
  </div>
</section>



<section className="py-20 border-t border-gray-200 bg-white">
  <div className="max-w-4xl mx-auto px-6">
    <h2 className="text-4xl font-semibold text-gray-900">Frequently Asked Questions</h2>

    <div className="mt-8 space-y-6">
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
        <h3 className="font-semibold text-gray-900">Is SafeVault hosted in India?</h3>
        <p className="text-gray-600 mt-2">
          SafeVault uses global cloud infrastructure with optimized routing for Indian users to ensure speed and reliability.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
        <h3 className="font-semibold text-gray-900">Is SafeVault legal in India?</h3>
        <p className="text-gray-600 mt-2">
          Yes. Encrypted cloud storage is legal and widely used by individuals and businesses in India.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
        <h3 className="font-semibold text-gray-900">Is SafeVault better than Google Drive?</h3>
        <p className="text-gray-600 mt-2">
          SafeVault focuses on privacy and encryption, while Google Drive focuses on convenience and data analytics.
        </p>
      </div>
    </div>
  </div>
</section>

 </Layout>
  );
}
