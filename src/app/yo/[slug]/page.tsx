import LangPost, { generateLangMetadata } from '@/components/i18n/LangPost';
import { getPosts } from '@/lib/blogger';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return generateLangMetadata(slug, "yo");
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LangPost slug={slug} lang="yo" />;
}

export async function generateStaticParams() {
  const posts = await getPosts("yo");
  if (posts.length === 0) return [{ slug: 'placeholder' }];
  return posts.map(p => ({ slug: p.slug }));
}
