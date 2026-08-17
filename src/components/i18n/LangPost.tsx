import { getPostBySlug, getPosts } from '@/lib/blogger';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import MarkdownLayout from '@/components/MarkdownLayout';
import Sidebar from '@/components/Sidebar';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';

export async function generateLangMetadata(slug: string, lang: string): Promise<Metadata> {
  const post = await getPostBySlug(slug, lang);
  if (!post) return { title: 'Not Found' };
  let desc = post.content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().substring(0, 160);
  if (desc.length === 160) desc += '...';
  return { title: `${post.title} | ${lang.toUpperCase()}`, description: desc };
}

export default async function LangPost({ slug, lang }: { slug: string, lang: Locale }) {
  const posts = await getPosts(lang);
  const post = posts.find(p => p.slug === slug) || null;
  const dict = getDictionary(lang);

  if (!post) notFound();

  const currentPostLabels = post.labels || [];
  let relatedPostsRaw = posts.filter(p => p.slug !== slug && !p.labels.some((l: string) => currentPostLabels.includes(l)));
  
  if (relatedPostsRaw.length < 4) {
    const otherPosts = posts.filter(p => p.slug !== slug && !relatedPostsRaw.includes(p));
    relatedPostsRaw = [...relatedPostsRaw, ...otherPosts];
  }

  const relatedPosts = relatedPostsRaw.slice(0, 4).map(p => ({
    slug: p.slug, title: p.title, published: p.published,
  }));

  const dateStr = new Date(post.published).toLocaleDateString(lang === 'am' ? 'am-ET' : 'sw-KE', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="layout-container">
      <aside className="layout-sidebar">
        <Sidebar lang={lang} />
      </aside>
      <main className="layout-main">
        <MarkdownLayout 
          title={post.title} 
          date={dateStr} 
          content={post.content} 
          tocTitle={dict.toc} 
          relatedPosts={relatedPosts}
          lang={lang}
          slug={post.slug}
        />
      </main>
    </div>
  );
}
