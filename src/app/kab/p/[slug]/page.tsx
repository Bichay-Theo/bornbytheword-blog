import LangPage, { generateLangPageMetadata } from '@/components/i18n/LangPage';
import { getPages } from '@/lib/blogger';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return generateLangPageMetadata(slug, "kab");
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LangPage slug={slug} lang="kab" />;
}

export async function generateStaticParams() {
  const pages = await getPages("kab");
  if (pages.length === 0) return [{ slug: 'placeholder' }];
  return pages.map(p => ({ slug: p.slug }));
}
