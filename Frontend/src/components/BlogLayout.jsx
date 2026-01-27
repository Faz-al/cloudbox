import { Link } from "react-router-dom";
import SeoInternalLinks from "./SeoInternalLinks";

export default function BlogLayout({ title, desc, children }) {
  return (
<main className="bg-white">

      {/* HERO */}
      <section className="pt-28 pb-16 border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
            SafeVault Blog
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900">{title}</h1>
          <p className="text-gray-600 text-lg mt-4">{desc}</p>
        </div>
      </section>

      {/* CONTENT */}
      <article className="max-w-3xl mx-auto px-4 py-16 prose prose-lg prose-gray">
        {children}
      </article>

      {/* CTA */}
     

      <SeoInternalLinks />
    </main>
  );
}
