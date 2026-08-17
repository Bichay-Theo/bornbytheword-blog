import { getPostBySlug, getPosts } from '@/lib/blogger';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import MarkdownLayout from '@/components/MarkdownLayout';
import Sidebar from '@/components/Sidebar';

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

  // Try to find posts with DIFFERENT labels (to avoid duplicating the series links which the user adds manually)
  const currentPostLabels = post.labels || [];
  let relatedPostsRaw = posts.filter(p => p.slug !== slug && !p.labels.some(l => currentPostLabels.includes(l)));
  
  // If we don't have enough posts with different labels, fill the rest with any recent posts
  if (relatedPostsRaw.length < 4) {
    const otherPosts = posts.filter(p => p.slug !== slug && !relatedPostsRaw.includes(p));
    relatedPostsRaw = [...relatedPostsRaw, ...otherPosts];
  }

  const relatedPosts = relatedPostsRaw.slice(0, 4).map(p => ({
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
    <div className="layout-container">
      <aside className="layout-sidebar">
        <Sidebar lang="ar" />
      </aside>
      <main className="layout-main">
        <MarkdownLayout 
          title={post.title} 
          date={dateStr} 
          content={post.content} 
          tocTitle="محتويات المقال" 
          relatedPosts={relatedPosts}
          slug={post.slug}
        />
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
