import { getPostBySlug, getPosts } from '@/lib/blogger';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import MarkdownLayout from '@/components/MarkdownLayout';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return { title: 'مقال غير موجود' };
  }

  // Extract a brief description from the content (strip HTML tags)
  let description = post.content
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim()
    .substring(0, 160);

  if (description.length === 160) {
    description += '...';
  }

  return {
    title: `${post.title} | المدونة`,
    description: description || 'مقال لاهوتي من مدونة شاء فولدنا بكلمة الحق',
    openGraph: {
      title: post.title,
      description: description,
      type: 'article',
      publishedTime: post.published,
      modifiedTime: post.updated,
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find(p => p.slug === slug) || null;

  if (!post) {
    notFound();
  }

  // Get 3 related posts (for now, just the most recent ones excluding the current one)
  const relatedPosts = posts.filter(p => p.slug !== slug).slice(0, 3).map(p => ({
    slug: p.slug,
    title: p.title,
    published: p.published,
  }));

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
      relatedPosts={relatedPosts}
    />
  );
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
