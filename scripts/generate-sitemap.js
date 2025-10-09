const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Paths
const postsDirectory = path.join(__dirname, '../src/blog/posts');
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

// Read all markdown files from the posts directory
const getPostFiles = () => {
  const files = fs.readdirSync(postsDirectory);
  return files.filter(file => file.endsWith('.md'));
};

// Extract metadata from markdown files
const getPostMetadata = (filename) => {
  const filePath = path.join(postsDirectory, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);

  return {
    slug: data.slug || filename.replace('.md', ''),
    date: data.date || new Date().toISOString().split('T')[0],
    title: data.title || '',
    excerpt: data.excerpt || ''
  };
};

// Generate sitemap XML
const generateSitemap = () => {
  const postFiles = getPostFiles();
  const posts = postFiles.map(getPostMetadata);

  // Sort posts by date, newest first
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const currentDate = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://tornadoaudio.net/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://tornadoaudio.net/logo512.png</image:loc>
      <image:title>Tornado Audio Professional Audio Mixing Services Logo</image:title>
      <image:caption>Professional audio mixing services by Hunter Johanson - Transform your recordings into radio-ready tracks</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://tornadoaudio.net/logo192.png</image:loc>
      <image:title>Tornado Audio Logo 192px</image:title>
      <image:caption>Tornado Audio professional mixing engineer Hunter Johanson logo</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://tornadoaudio.net/#services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tornadoaudio.net/#portfolio</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://tornadoaudio.net/#pricing</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tornadoaudio.net/#contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://tornadoaudio.net/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${posts.map(post => `  <url>
    <loc>https://tornadoaudio.net/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
  <url>
    <loc>https://tornadoaudio.net/privacy-policy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://tornadoaudio.net/terms-of-service</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
`;

  return sitemap;
};

// Write sitemap to file
const writeSitemap = () => {
  try {
    const sitemap = generateSitemap();
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    console.log('✅ Sitemap generated successfully!');
    console.log(`📍 Location: ${sitemapPath}`);

    const postFiles = getPostFiles();
    console.log(`📝 Included ${postFiles.length} blog posts`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
};

// Run the generator
writeSitemap();

