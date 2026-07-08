import { getPosts } from '@/lib/blogger';
import PostList from '@/components/PostList';
import { Suspense } from 'react';

export default async function Home() {
  const allPosts = await getPosts();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>
          شاء فولدنا بكلمة الحق
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto' }}>
          منصة لاهوتية تعتني بنشر كلمة الحق من خلال دراسات كتابية، وتأملات روحية، وترجمات لكتب لاهوتية
        </p>
      </header>
      
      <Suspense fallback={<div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>جارٍ التحميل...</div>}>
        <PostList allPosts={allPosts} />
      </Suspense>
    </div>
  );
}
