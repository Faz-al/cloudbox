import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Layout = ({ title, desc, children }) => (
  <>
    <Helmet>
      <title>{title} | SafeVault</title>
      <meta name="description" content={desc} />
    </Helmet>

    <div className="sv-page">
      {/* HERO */}
      <section className="sv-hero">
        <div className="sv-hero-inner">
          <h1>{title}</h1>
          <p>{desc}</p>

          <div className="sv-cta">
            <Link to="/signup" className="sv-btn-primary">Get Started Free</Link>
            <Link to="/login" className="sv-btn-secondary">Login</Link>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="sv-content">{children}</section>
    </div>
  </>
);

export function SecureCloudStorage() {
  return (
    <Layout
      title="Secure Cloud Storage for Files, Photos and Videos"
      desc="SafeVault delivers enterprise-grade secure cloud storage with encryption, privacy-first design, and full control over your data."
    >
      <h2>Why Secure Cloud Storage Matters</h2>
      <p>Cloud breaches and data leaks are increasing. SafeVault protects your personal and business files with zero-knowledge encryption.</p>

      <div className="sv-grid">
        <div className="sv-card">
          <h3>End-to-End Encryption</h3>
          <p>Your files are encrypted before upload. Only you can decrypt them.</p>
        </div>
        <div className="sv-card">
          <h3>Zero Data Tracking</h3>
          <p>No scanning, no profiling, no ads. Your data stays private.</p>
        </div>
        <div className="sv-card">
          <h3>Secure File Sharing</h3>
          <p>Share files with expiration links and permission control.</p>
        </div>
      </div>
    </Layout>
  );
}

export function PrivateCloudStorage() {
  return (
    <Layout
      title="Private Cloud Storage With Zero Tracking"
      desc="Private cloud storage where only you control your files, encryption keys, and privacy."
    >
      <h2>Your Data, Your Rules</h2>
      <p>SafeVault is built for privacy-first users, businesses, and creators.</p>
    </Layout>
  );
}

export function EncryptedCloudStorage() {
  return (
    <Layout
      title="End-to-End Encrypted Cloud Storage"
      desc="Client-side encrypted cloud storage built for security and compliance."
    >
      <h2>Military-Grade Encryption</h2>
      <p>Files are encrypted locally using AES-256 before upload.</p>
    </Layout>
  );
}

export function FreeCloudStorage() {
  return (
    <Layout
      title="Free Cloud Storage With Encryption"
      desc="Get 5GB free encrypted cloud storage with no ads and no tracking."
    >
      <h2>Start Free, Upgrade Anytime</h2>
      <p>SafeVault offers scalable storage for individuals and businesses.</p>
    </Layout>
  );
}

export function CloudStorageIndia() {
  return (
    <Layout
      title="Best Cloud Storage in India With Privacy"
      desc="Fast encrypted cloud storage optimized for Indian users."
    >
      <h2>Optimized for India</h2>
      <p>Low latency, global infrastructure, and strong encryption.</p>
    </Layout>
  );
}
