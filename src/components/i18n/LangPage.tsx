import { getPageBySlug, getPages } from '@/lib/blogger';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import MarkdownLayout from '@/components/MarkdownLayout';
import Sidebar from '@/components/Sidebar';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';

export async function generateLangPageMetadata(slug: string, lang: string): Promise<Metadata> {
  const page = await getPageBySlug(slug, lang);
  if (!page) return { title: 'Not Found' };
  let desc = page.content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().substring(0, 160);
  if (desc.length === 160) desc += '...';
  return { title: `${page.title}`, description: desc };
}

export default async function LangPage({ slug, lang }: { slug: string, lang: Locale }) {
  const page = await getPageBySlug(slug, lang);
  const dict = getDictionary(lang);

  if (!page) notFound();

  return (
    <div className="layout-container">
      <aside className="layout-sidebar">
        <Sidebar lang={lang} />
      </aside>
      <main className="layout-main">
        <MarkdownLayout 
          content={page.content} 
          tocTitle={dict.toc}
          showToc={false}
          lang={lang}
        />
      </main>
    </div>
  );
}
