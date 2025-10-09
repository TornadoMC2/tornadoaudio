# Dynamic Sitemap Generator

This project includes an automated sitemap generator that dynamically creates the `sitemap.xml` file based on your blog posts.

## How It Works

The sitemap generator:
1. Automatically scans the `src/blog/posts/` directory for all `.md` files
2. Reads the frontmatter from each markdown file to get the `slug` and `date`
3. Generates a complete sitemap with all blog posts included
4. Uses the `slug` field from frontmatter for SEO-friendly URLs

## Automatic Generation

The sitemap is automatically regenerated:
- **Before every build** - The `prebuild` script runs the generator before building your app
- **Manually** - Run `npm run generate-sitemap` anytime you want to update the sitemap

## Adding New Blog Posts

When you add a new blog post, the sitemap will automatically include it on the next build. No manual updates needed!

### Steps:
1. Create a new `.md` file in `src/blog/posts/`
2. Add frontmatter with at minimum: `title`, `date`, `slug`, `author`, `excerpt`
3. Run `npm run generate-sitemap` to update the sitemap immediately
4. Or just run `npm run build` - it will automatically regenerate the sitemap

### Example Frontmatter:
```markdown
---
title: "Your Post Title"
date: "2025-10-08"
author: "Hunter Johanson"
excerpt: "A brief description of your post"
image: "/logo512.png"
tags: ["mixing", "tutorial"]
slug: "your-post-slug"
---
```

## Manual Regeneration

To manually regenerate the sitemap at any time:

```bash
npm run generate-sitemap
```

This is useful when:
- You add a new blog post and want to update the sitemap immediately
- You modify post dates or slugs
- You want to verify the sitemap before deployment

## Generated Sitemap Location

The sitemap is generated at: `public/sitemap.xml`

This file is automatically copied to the `build/` directory during the build process and deployed with your app.

## SEO Benefits

The dynamic sitemap ensures:
- ✅ All blog posts are properly indexed by search engines
- ✅ Correct URLs using the `slug` from frontmatter
- ✅ Accurate last modified dates from post metadata
- ✅ Proper priority and change frequency settings
- ✅ No manual maintenance required

## Troubleshooting

If blog posts aren't appearing in the sitemap:
1. Verify the `.md` file is in `src/blog/posts/`
2. Check that frontmatter includes `slug` and `date` fields
3. Run `npm run generate-sitemap` and check for errors
4. Verify the post slug matches what's in the frontmatter

## Technical Details

- **Generator Script**: `scripts/generate-sitemap.js`
- **Uses**: `gray-matter` to parse frontmatter
- **Sorts**: Posts by date (newest first)
- **Output**: Standard XML sitemap format

