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

export async function getPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = await Promise.all(fileNames.map(async (fileName) => {
    if (!fileName.endsWith('.md')) return null;
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);
    // Use remark to convert markdown into HTML string
    const processedContent = await remark().use(gfm).use(html).process(matterResult.content);
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
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(pagesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);
    const processedContent = await remark().use(gfm).use(html).process(matterResult.content);
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
