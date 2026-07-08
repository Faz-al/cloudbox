import SeoInternalLinks from "./SeoInternalLinks";

export default function BlogLayout({
  title,
  desc,
  children
}) {
  return (
    <main className="bg-[#fafafa] min-h-screen">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-slate-50 via-white to-white">

        {/* BACKGROUND GLOW */}

        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-100 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 pt-32 pb-20">

          {/* BADGE */}

          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">

            <div className="w-2 h-2 rounded-full bg-blue-500" />

            <span className="text-sm font-medium text-gray-600">
              SafeVault Security Blog
            </span>
          </div>

          {/* TITLE */}

          <h1 className="mt-8 text-5xl sm:text-6xl font-semibold tracking-tight text-gray-900 leading-[1.05]">
            {title}
          </h1>

          {/* DESCRIPTION */}

          <p className="mt-8 text-xl leading-9 text-gray-600 max-w-3xl">
            {desc}
          </p>

        </div>
      </section>

      {/* ARTICLE */}

      <section className="py-16">

        <article className="max-w-4xl mx-auto px-6">

          {/* CONTENT CARD */}

          <div className="bg-white border border-gray-200 rounded-[32px] shadow-sm p-8 sm:p-14">

            <div className="max-w-3xl mx-auto">
              {children}
            </div>

          </div>

        </article>

      </section>

      {/* INTERNAL LINKS */}

      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <SeoInternalLinks />
        </div>
      </section>

    </main>
  );
}