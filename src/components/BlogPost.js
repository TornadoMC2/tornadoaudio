import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import matter from 'gray-matter';
import './Blog.css';
import Header from './Header';

// Dynamically import all markdown files
const importAll = (r) => {
  const posts = {};
  r.keys().forEach((fileName) => {
    const fileContent = r(fileName);
    const slug = fileName.replace('./', '').replace('.md', '');
    posts[slug] = fileContent;
  });
  return posts;
};

const postMap = importAll(
  require.context('../blog/posts', false, /\.md$/)
);

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [content, setContent] = useState('');
  const [actualSlug, setActualSlug] = useState(slug);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);

  // Calculate reading time (average 200 words per minute)
  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadPost = async () => {
      try {
        // Find the post file by slug (check both filename and slug field in frontmatter)
        let postFile = postMap[slug];
        let foundSlug = slug;

        // If not found by exact slug, try to find by slug in frontmatter
        if (!postFile) {
          for (const [, file] of Object.entries(postMap)) {
            const response = await fetch(file);
            const markdown = await response.text();
            const { data } = matter(markdown);

            if (data.slug === slug) {
              postFile = file;
              foundSlug = data.slug;
              break;
            }
          }
        }

        if (!postFile) {
          setLoading(false);
          return;
        }

        const response = await fetch(postFile);
        const markdown = await response.text();
        const { data, content: postContent } = matter(markdown);

        setPost(data);
        setContent(postContent);
        setActualSlug(data.slug || foundSlug);
        setReadingTime(calculateReadingTime(postContent));
        setLoading(false);
      } catch (error) {
        console.error('Error loading post:', error);
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-page">
        <Header />
        <div className="container">
          <div className="blog-post-content">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-page">
        <Header />
        <div className="container">
          <div className="blog-post-content">
            <h1>Post Not Found</h1>
            <p>Sorry, we couldn't find that blog post.</p>
            <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
          </div>
        </div>
      </div>
    );
  }

  const postUrl = `https://tornadoaudio.net/blog/${actualSlug}`;
  const shareText = encodeURIComponent(post.title);

  return (
    <div className="blog-page">
      <Helmet>
        <title>{post.title} | Tornado Audio Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="author" content={post.author} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={postUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://tornadoaudio.net${post.image}`} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        {post.tags && post.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={`https://tornadoaudio.net${post.image}`} />

        {/* Schema.org Article markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": `https://tornadoaudio.net${post.image}`,
            "datePublished": post.date,
            "author": {
              "@type": "Person",
              "name": post.author,
              "url": "https://tornadoaudio.net"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Tornado Audio",
              "logo": {
                "@type": "ImageObject",
                "url": "https://tornadoaudio.net/logo512.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": postUrl
            },
            "url": postUrl
          })}
        </script>
      </Helmet>

      <Header />

      <article className="blog-post">
        <div className="container">
          <Link to="/blog" className="back-to-blog">← Back to Blog</Link>

          {/* Featured Image */}
          {post.image && (
            <div className="blog-featured-image">
              <img src={post.image} alt={post.title} />
            </div>
          )}

          <header className="blog-post-header">
            {/* Category Badge */}
            {post.tags && post.tags.length > 0 && (
              <div className="blog-category-badge">
                <span className="category-main">{post.tags[0]}</span>
              </div>
            )}

            <h1>{post.title}</h1>

            {/* Enhanced Meta Info */}
            <div className="blog-post-meta">
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <time dateTime={post.date}>
                  {new Date(post.date + 'T12:00:00').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <div className="meta-item">
                <span className="meta-icon">✍️</span>
                <span className="blog-author">{post.author}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">⏱️</span>
                <span className="reading-time">{readingTime} min read</span>
              </div>
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="blog-post-excerpt">{post.excerpt}</p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="blog-tags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="blog-tag">{tag}</span>
                ))}
              </div>
            )}
          </header>

          <div className="blog-post-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* Author Bio Section */}
          <div className="author-bio">
            <div className="author-bio-content">
              <div className="author-avatar">
                <span className="avatar-icon">🎵</span>
              </div>
              <div className="author-info">
                <h3>About {post.author}</h3>
                <p>
                  Professional mixing engineer at Tornado Audio with years of experience
                  in music production. Specializing in rock, metal, and indie music,
                  Hunter has helped hundreds of artists achieve their sonic vision.
                </p>
                <div className="author-social">
                  <a
                    href="https://instagram.com/tornadoaudio_mixing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="author-link"
                  >
                    Follow on Instagram →
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="blog-post-footer">
            <div className="share-buttons">
              <h3>Share this post:</h3>
              <div className="share-links">
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(postUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-button twitter"
                >
                  Share on Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-button facebook"
                >
                  Share on Facebook
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-button linkedin"
                >
                  Share on LinkedIn
                </a>
              </div>
            </div>

            <div className="blog-cta">
              <h3>Ready to transform your recordings?</h3>
              <p>Get professional mixing services starting at just $40.</p>
              <Link to="/#contact" className="cta-button">Get Started Today</Link>
            </div>
          </div>

          <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
        </div>
      </article>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-content">
            <div className="footer-social">
              <h4>Follow Tornado Audio</h4>
              <div className="social-links">
                <a
                  href="https://instagram.com/tornadoaudio_mixing"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Tornado Audio on Instagram"
                >
                  <span className="social-icon" role="img" aria-label="Instagram">📸</span>
                  <span>@tornadoaudio_mixing</span>
                </a>
              </div>
            </div>
            <div className="footer-copyright">
              <p>&copy; 2025 Tornado Audio - Professional Audio Mixing by Hunter Johanson. All rights reserved.</p>
              <p>
                <small>Professional audio mixing services for musicians, bands, and independent artists worldwide.</small>
              </p>
              <div className="footer-links">
                <Link to="/">Home</Link> |
                <Link to="/blog">Blog</Link> |
                <Link to="/privacy-policy">Privacy Policy</Link> |
                <Link to="/terms-of-service">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default BlogPost;
