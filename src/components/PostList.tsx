'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BlogPost } from '@/lib/blogger';

import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export default function PostList({ allPosts, lang = 'ar' }: { allPosts: BlogPost[], lang?: Locale }) {
  const searchParams = useSearchParams();
  const q = searchParams.get('q')?.toLowerCase() || '';
  const topic = searchParams.get('topic') || '';
  const dict = getDictionary(lang);

  const posts = allPosts.filter(post => {
    let match = true;
    if (q) {
      match = match && (post.title.toLowerCase().includes(q) || post.content.toLowerCase().includes(q));
    }
    if (topic) {
      match = match && post.labels.includes(topic);
    }
    return match;
  });

  if (posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
        {lang === 'ar' ? 'لا توجد نتائج مطابقة لبحثك.' : 'No results found.'}
      </div>
    );
  }

  const prefix = lang === 'ar' ? '' : `/${lang}`;

  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <article key={post.id} className="post-card">
          <h2 className="post-title">
            <Link href={`${prefix}/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
          <div className="post-date">
            {new Date(post.published).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="post-excerpt">
            {post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300)}...
          </div>
          <Link href={`${prefix}/${post.slug}`} className="read-more-btn">
            {dict.readMore}
          </Link>
        </article>
      ))}
    </div>
  );
}
