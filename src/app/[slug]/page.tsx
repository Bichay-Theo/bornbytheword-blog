import { getPostBySlug, getPosts } from '@/lib/blogger';
import { notFound } from 'next/navigation';
import MarkdownLayout from '@/components/MarkdownLayout';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const dateStr = new Date(post.published).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <MarkdownLayout 
      title={post.title} 
      date={dateStr} 
      content={post.content} 
      tocTitle="محتويات المقال" 
    />
  );
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
