import { useEffect, useState } from 'react';
import matter from 'gray-matter';

// Dynamically import all markdown files from the blog posts directory
const importAll = (r) => {
  return r.keys().map((fileName) => ({
    file: r(fileName),
    filename: fileName.replace('./', '').replace('.md', '')
  }));
};

// Get all markdown files from the blog posts directory
const postFiles = importAll(
  require.context('../blog/posts', false, /\.md$/)
);

export const useBlogPosts = (limit = null) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const postPromises = postFiles.map(async ({ file, filename }) => {
        try {
          const response = await fetch(file);
          const content = await response.text();
          const { data } = matter(content);

          return {
            ...data,
            filename,
            slug: data.slug || filename // Use slug from frontmatter or filename as fallback
          };
        } catch (error) {
          console.error(`Error loading ${filename}:`, error);
          return null;
        }
      });

      const loadedPosts = await Promise.all(postPromises);
      const validPosts = loadedPosts.filter(post => post !== null);

      // Sort by date, newest first
      validPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Apply limit if specified
      setPosts(limit ? validPosts.slice(0, limit) : validPosts);
      setLoading(false);
    };

    loadPosts();
  }, [limit]);

  return { posts, loading };
};

export default useBlogPosts;
