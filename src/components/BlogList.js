import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './Blog.css';
import Header from './Header';
import useBlogPosts from '../hooks/useBlogPosts';

function BlogList() {
  const { posts, loading } = useBlogPosts(); // Use the dynamic hook

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-page">
      <Helmet>
        <title>Blog - Audio Mixing Tips & Tutorials | Tornado Audio</title>
        <meta name="description" content="Expert audio mixing tips, tutorials, and industry insights from professional mixing engineer Hunter Johanson. Learn mixing techniques, production advice, and more." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tornadoaudio.net/blog" />

        {/* Open Graph */}
        <meta property="og:title" content="Blog - Audio Mixing Tips | Tornado Audio" />
        <meta property="og:description" content="Expert audio mixing tips and tutorials from professional mixing engineer Hunter Johanson." />
        <meta property="og:url" content="https://tornadoaudio.net/blog" />
        <meta property="og:type" content="blog" />

        {/* Twitter */}
        <meta name="twitter:title" content="Blog - Audio Mixing Tips | Tornado Audio" />
        <meta name="twitter:description" content="Expert audio mixing tips and tutorials from professional mixing engineer Hunter Johanson." />
      </Helmet>

      <Header />

      <div className="blog-hero">
        <div className="container">
          <h1>Audio Mixing Blog</h1>
          <p className="blog-subtitle">
            Tips, tutorials, and insights from professional mixing engineer Hunter Johanson
          </p>
        </div>
      </div>

      <div className="container">
        <div className="blog-list">
          {loading ? (
            <p>Loading blog posts...</p>
          ) : (
            posts.map((post) => (
              <article key={post.slug} className="blog-card">
                <Link to={`/blog/${post.slug}`} className="blog-card-link">
                  <div className="blog-card-content">
                    <div className="blog-meta">
                      <time dateTime={post.date}>
                        {new Date(post.date + 'T12:00:00').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <span className="blog-author">By {post.author}</span>
                    </div>
                    <h2>{post.title}</h2>
                    <p className="blog-excerpt">{post.excerpt}</p>
                    <div className="blog-tags">
                      {post.tags && post.tags.map((tag, index) => (
                        <span key={index} className="blog-tag">{tag}</span>
                      ))}
                    </div>
                    <span className="read-more">Read More →</span>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </div>

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

export default BlogList;
