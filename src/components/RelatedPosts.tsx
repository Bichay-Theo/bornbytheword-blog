import React from 'react';
import Link from 'next/link';

interface RelatedPost {
  slug: string;
  title: string;
  published?: string;
}

export default function RelatedPosts({ posts }: { posts: RelatedPost[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="related-posts-container">
      <h3 className="related-posts-title">اقرأ أيضاً:</h3>
      <div className="related-posts-grid">
        {posts.map((post) => {
          const dateStr = post.published ? new Date(post.published).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : '';
          
          return (
            <Link href={`/${post.slug}`} key={post.slug} className="related-post-card">
              <div className="related-post-content">
                <h4>{post.title}</h4>
                {dateStr && <time>{dateStr}</time>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
