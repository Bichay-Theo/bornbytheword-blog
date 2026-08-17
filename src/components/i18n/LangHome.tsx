import { getPosts } from '@/lib/blogger';
import PostList from '@/components/PostList';
import { Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';

export default async function LangHome({ lang }: { lang: Locale }) {
  const allPosts = await getPosts(lang);
  const dict = getDictionary(lang);

  return (
    <div className="layout-container">
      <aside className="layout-sidebar">
        <Sidebar lang={lang} />
      </aside>
      <main className="layout-main">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <header style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '1rem' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>
              {dict.siteName}
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto' }}>
              {dict.siteDescription}
            </p>
          </header>
          
          <Suspense fallback={<div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{dict.loading}</div>}>
            <PostList allPosts={allPosts} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
