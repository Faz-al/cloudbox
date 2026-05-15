const fs = require('fs');
const path = require('path');

const { createClient } = require('@sanity/client');

const sanityClient = createClient({
  projectId: 'qjgj24gz',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false
});

const staticRoutes = [
  '/',
  '/blog',
  '/blog/secure-cloud-storage-guide',
  '/blog/encrypted-cloud-storage-explained',
  '/blog/best-cloud-storage-india',
  '/blog/google-drive-alternatives',
  '/blog/cloud-storage-privacy-guide',
  '/blog/how-zero-knowledge-encryption-works'
];

async function generateSitemap() {
  const baseUrl = 'https://safevault.in';

  const sanityPosts = await sanityClient.fetch(`
    *[_type == "post"]{
      "slug": slug.current
    }
  `);

  const sanityRoutes = sanityPosts.map(
    (post) => `/blog/${post.slug}`
  );

  const allRoutes = [
    ...staticRoutes,
    ...sanityRoutes
  ];

  const urls = allRoutes
    .map(
      (route) => `
      <url>
        <loc>${baseUrl}${route}</loc>
      </url>
    `
    )
    .join('');

  const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  fs.writeFileSync(
    path.resolve(__dirname, '../../public/sitemap.xml'),
    sitemap
  );

  console.log('sitemap generated');
}

generateSitemap();