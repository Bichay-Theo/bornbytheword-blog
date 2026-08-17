import LangPost, { generateLangMetadata } from '@/components/i18n/LangPost';
import { getPosts } from '@/lib/blogger';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return generateLangMetadata(slug, "sw");
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LangPost slug={slug} lang="sw" />;
}

export async function generateStaticParams() {
  const posts = await getPosts("sw");
  if (posts.length === 0) return [{ slug: 'placeholder' }];
  return posts.map(p => ({ slug: p.slug }));
}
