import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const pagesDirectory = path.join(process.cwd(), 'content/pages');

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  published: string;
  updated: string;
  slug: string;
  labels: string[];
}

export interface BlogPage {
  id: string;
  title: string;
  content: string;
  slug: string;
}

// Convert [1] or [١] into [^1] and definitions into [^1]: 
function convertFootnotesToMarkdown(content: string) {
  // If the content already has HTML footnotes (like the compiled books), don't touch them!
  // We can detect this if there is already a footnote definition pattern like `id=".*?-fn-.*?`
  if (content.match(/<a.*?href=\"#.*?fn.*?<\/a>/)) {
      return content;
  }
  
  // First, convert eastern arabic numerals inside brackets to english numerals and use [^...] syntax
  let processed = content.replace(/\[([١٢٣٤٥٦٧٨٩٠0-9]+)\]/g, (match, num) => {
    let engNum = num.replace(/[١٢٣٤٥٦٧٨٩٠]/g, (d: string) => '١٢٣٤٥٦٧٨٩٠'.indexOf(d) + 1);
    return `[^${engNum}]`;
  });
  
  // Second, for footnote definitions that appear at the beginning of a line like `[^1] text`, add a colon
  processed = processed.replace(/^\[\^([0-9]+)\](?!:)/gm, '[^$1]:');
  
  // Third, automatically fix any custom [[1]](#something) style footnotes
  processed = processed.replace(/\[\[(\d+)\]\]\(#(.*?)\)/g, (match, num, target) => {
    let sourceId = '';
    if (target.includes('fn')) {
        sourceId = target.replace('fn', 'ref');
    } else if (target.includes('ref')) {
        sourceId = target.replace('ref', 'fn');
    } else {
        sourceId = target + '-source';
    }
    return `<sup id="${sourceId}"><a href="#${target}" style="text-decoration: none; color: var(--primary-color);">[${num}]</a></sup>`;
  });
  
  return processed;
}

export async function getPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = await Promise.all(fileNames.map(async (fileName) => {
    if (!fileName.endsWith('.md')) return null;
    const slug = fileName.replace(/\.md$/, '').replace(/\s+/g, '-');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);
    
    // Automatically convert user footnotes [1] into remark-gfm footnotes [^1]
    const contentWithFootnotes = convertFootnotesToMarkdown(matterResult.content);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark().use(gfm).use(html, { sanitize: false }).process(contentWithFootnotes);
    const contentHtml = processedContent.toString();

    return {
      id: slug,
      slug,
      title: matterResult.data.title || slug,
      published: matterResult.data.date || new Date().toISOString(),
      updated: matterResult.data.updated || matterResult.data.date || new Date().toISOString(),
      labels: matterResult.data.labels || [],
      content: contentHtml,
    };
  }));

  const validPosts = posts.filter(Boolean) as BlogPost[];
  // Sort by date DESC
  return validPosts.sort((a, b) => (a.published < b.published ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getPosts();
  return posts.find(post => post.slug === slug) || null;
}

export async function getPages(): Promise<BlogPage[]> {
  if (!fs.existsSync(pagesDirectory)) return [];
  const fileNames = fs.readdirSync(pagesDirectory);
  
  const pages = await Promise.all(fileNames.map(async (fileName) => {
    if (!fileName.endsWith('.md')) return null;
    const slug = fileName.replace(/\.md$/, '').replace(/\s+/g, '-');
    const fullPath = path.join(pagesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);
    
    const contentWithFootnotes = convertFootnotesToMarkdown(matterResult.content);

    const processedContent = await remark().use(gfm).use(html, { sanitize: false }).process(contentWithFootnotes);
    const contentHtml = processedContent.toString();

    return {
      id: slug,
      slug,
      title: matterResult.data.title || slug,
      content: contentHtml,
    };
  }));

  return pages.filter(Boolean) as BlogPage[];
}

export async function getPageBySlug(slug: string): Promise<BlogPage | null> {
  const pages = await getPages();
  return pages.find(page => page.slug === slug) || null;
}
