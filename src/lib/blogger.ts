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

// Convert [1] or [١] into custom HTML footnotes to match the books exactly
function convertFootnotesToMarkdown(content: string) {
  if (content.match(/<a.*?href=\"#.*?fn.*?<\/a>/)) {
      return content;
  }
  
  // First, convert eastern arabic numerals inside brackets to english numerals
  let processed = content.replace(/\\?\[([١٢٣٤٥٦٧٨٩٠0-9]+)\\?\]/g, (match, num) => {
    let engNum = num.replace(/[١٢٣٤٥٦٧٨٩٠]/g, (d: string) => '١٢٣٤٥٦٧٨٩٠'.indexOf(d) + 1);
    // If it was originally escaped, preserve the escape sequence so the next regex matches it correctly
    if (match.startsWith('\\')) {
        return `\\[${engNum}\\]`;
    }
    return `[${engNum}]`;
  });
  
  // Handle `[[1]](#ref1)` text at the beginning of a line (definition)
  processed = processed.replace(/^\\?\[\\?\[(\d+)\\?\]\\?\]\(#(.*?ref.*?)\)\s*(.*)$/gm, (match, num, target, text) => {
    return `<p id="fn-${num}" style="margin-bottom: 1rem; border-top: 1px solid var(--secondary); padding-top: 1rem;">
  <a href="#ref-${num}" style="font-weight: bold; color: var(--primary); text-decoration: none;">[${num}] ↩</a> ${text}
</p>`;
  });

  // Handle `[1] text` or `[1]: text` at the beginning of a line (definition)
  processed = processed.replace(/^\\?\[([0-9]+)\\?\]:?\s*(.*)$/gm, (match, num, text) => {
    return `<p id="fn-${num}" style="margin-bottom: 1rem; border-top: 1px solid var(--secondary); padding-top: 1rem;">
  <a href="#ref-${num}" style="font-weight: bold; color: var(--primary); text-decoration: none;">[${num}] ↩</a> ${text}
</p>`;
  });
  
  // Handle inline reference `[[1]](#fn1)`
  processed = processed.replace(/\[\[(\d+)\]\]\(#(.*?)\)/g, (match, num, target) => {
    return `<sup id="ref-${num}"><a href="#fn-${num}" style="text-decoration: none; color: var(--primary-color);">[${num}]</a></sup>`;
  });

  // Handle inline reference `[1]`
  processed = processed.replace(/\[([0-9]+)\](?! ↩)/g, (match, num) => {
    return `<sup id="ref-${num}"><a href="#fn-${num}" style="text-decoration: none; color: var(--primary-color);">[${num}]</a></sup>`;
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
    let contentHtml = processedContent.toString();

    // Replace the manual 'هوامش:' paragraphs with our beautiful section header
    const footnoteHeader = '<div class="footnote-section">\n<h3 style="color: var(--primary); text-align: right; margin-bottom: 2rem;">الْهَوَامِشُ وَالْمَرَاجِعُ</h3>\n</div>';
    contentHtml = contentHtml.replace(/<p><strong>(هوامش|الهوامش|الهوامش والمراجع):<\/strong><\/p>/g, footnoteHeader);
    
    // Replace the remark-gfm generated 'Footnotes' header with an Arabic header
    contentHtml = contentHtml.replace(/<h2[^>]*>Footnotes<\/h2>/i, '<h2 id="footnote-label" style="color: var(--primary); text-align: right; margin-top: 3rem; margin-bottom: 2rem;">الْهَوَامِشُ وَالْمَرَاجِعُ</h2>');

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
    let contentHtml = processedContent.toString();

    // Replace the manual 'هوامش:' paragraphs with our beautiful section header
    const footnoteHeader = '<div class="footnote-section">\n<h3 style="color: var(--primary); text-align: right; margin-bottom: 2rem;">الْهَوَامِشُ وَالْمَرَاجِعُ</h3>\n</div>';
    contentHtml = contentHtml.replace(/<p><strong>(هوامش|الهوامش|الهوامش والمراجع):<\/strong><\/p>/g, footnoteHeader);
    
    // Replace the remark-gfm generated 'Footnotes' header with an Arabic header
    contentHtml = contentHtml.replace(/<h2[^>]*>Footnotes<\/h2>/i, '<h2 id="footnote-label" style="color: var(--primary); text-align: right; margin-top: 3rem; margin-bottom: 2rem;">الْهَوَامِشُ وَالْمَرَاجِعُ</h2>');

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
