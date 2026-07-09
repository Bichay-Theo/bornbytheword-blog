import { getPageBySlug, getPages } from '@/lib/blogger';
import { notFound } from 'next/navigation';
import MarkdownLayout from '@/components/MarkdownLayout';

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <MarkdownLayout 
      content={page.content} 
      tocTitle="محتويات الكتاب" 
    />
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
