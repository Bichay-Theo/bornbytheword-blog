import { getPageBySlug, getPages } from '@/lib/blogger';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import MarkdownLayout from '@/components/MarkdownLayout';
import Sidebar from '@/components/Sidebar';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  
  if (!page) {
    return { title: 'صفحة غير موجودة' };
  }

  let description = page.content
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim()
    .substring(0, 160);

  if (description.length === 160) {
    description += '...';
  }

  return {
    title: `${page.title} | المدونة`,
    description: description || 'مدونة شاء فولدنا بكلمة الحق',
    openGraph: {
      title: page.title,
      description: description,
      type: 'article',
    }
  };
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="layout-container">
      <aside className="layout-sidebar">
        <Sidebar lang="ar" />
      </aside>
      <main className="layout-main">
        <MarkdownLayout 
          content={page.content} 
          tocTitle="محتويات الكتاب"
          showToc={false}
        />
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  const pages = await getPages();
  if (pages.length === 0) {
    return [{ slug: 'placeholder' }];
  }
  return pages.map((page) => ({
    slug: page.slug,
  }));
}
