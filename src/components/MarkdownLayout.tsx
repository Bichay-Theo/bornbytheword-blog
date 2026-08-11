import React from 'react';
import Link from 'next/link';

function processHtmlAndExtractTOC(html: string) {
  const toc: { id: string, text: string, level: number }[] = [];
  
  let idCounter = 0;
  let processedHtml = html.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, content) => {
    idCounter++;
    const id = `heading-${idCounter}`;
    const text = content.replace(/<[^>]+>/g, '').trim();
    if (text) {
      toc.push({ id, text, level: tag.toLowerCase() === 'h2' ? 2 : 3 });
    }
    return `<${tag} id="${id}"${attrs}>${content} <a href="#toc" class="back-to-toc" title="العودة للفهرس">↩</a></${tag}>`;
  });

  // Fix image paths for GitHub Pages subpath
  processedHtml = processedHtml.replace(/<img\s+([^>]*?)src="(\/[^"]+)"/gi, '<img $1src="/bornbytheword-blog$2"');
  
  // Fix internal links for GitHub Pages subpath (e.g. href="/penal-substitution")
  processedHtml = processedHtml.replace(/href="(\/[^"]+)"/gi, 'href="/bornbytheword-blog$1"');

  const firstH2Match = processedHtml.match(/<h2[^>]*id="heading-/i);
  let htmlBeforeFirstH2 = processedHtml;
  let htmlAfterFirstH2 = '';
  
  if (firstH2Match && firstH2Match.index !== undefined) {
    htmlBeforeFirstH2 = processedHtml.substring(0, firstH2Match.index);
    htmlAfterFirstH2 = processedHtml.substring(firstH2Match.index);
  }

  return { processedHtml, htmlBeforeFirstH2, htmlAfterFirstH2, toc };
}

interface MarkdownLayoutProps {
  title?: string;
  date?: string;
  content: string;
  tocTitle?: string;
  showToc?: boolean;
}

import ImageZoom from './ImageZoom';
import BackToTop from './BackToTop';
import SocialShare from './SocialShare';
import RelatedPosts from './RelatedPosts';
import NewsletterForm from './NewsletterForm';

interface RelatedPost {
  slug: string;
  title: string;
  published?: string;
}

export default function MarkdownLayout({ title, date, content, tocTitle = "محتويات المقال", showToc = true, relatedPosts }: MarkdownLayoutProps & { relatedPosts?: RelatedPost[] }) {
  const { processedHtml, htmlBeforeFirstH2, htmlAfterFirstH2, toc } = processHtmlAndExtractTOC(content);

  return (
    <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
      <ImageZoom />
      <main style={{ flex: 1, minWidth: 0 }}>
        <nav style={{ marginBottom: '2rem' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            &rarr; العودة للرئيسية
          </Link>
        </nav>
        
        <article className="blog-post-content">
          {title && (
            <header style={{ marginBottom: '3rem', borderBottom: '2px solid var(--secondary)', paddingBottom: '2rem' }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                {title}
              </h1>
              {date && (
                <time style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                  {date}
                </time>
              )}
            </header>
          )}

          {htmlBeforeFirstH2 && (
            <div 
              className="post-html"
              dangerouslySetInnerHTML={{ __html: htmlBeforeFirstH2 }} 
            />
          )}

          {showToc && toc.length > 0 && (
            <aside id="toc" style={{ width: 'fit-content', minWidth: '250px', maxWidth: '100%', marginBottom: '2.5rem', background: 'var(--card-bg)', padding: '1.2rem', borderRadius: '8px', border: '1px solid var(--secondary)' }} className="toc-inline">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--primary)', borderBottom: '1px solid var(--secondary)', paddingBottom: '0.5rem' }}>
                {tocTitle}
              </h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {toc.map(item => {
                  const isChapter = item.level === 2 && item.text.replace(/[\u0617-\u061A\u064B-\u0652]/g, '').includes('فصل');
                  return (
                    <li key={item.id} style={{ marginBottom: '0.4rem', paddingRight: item.level === 3 ? '1rem' : '0' }}>
                      <a 
                        href={`#${item.id}`} 
                        className="toc-link" 
                        style={{ 
                          color: isChapter ? 'var(--primary)' : 'inherit', 
                          fontWeight: isChapter ? 'bold' : 'normal',
                          display: 'block',
                          fontSize: item.level === 3 ? '0.9rem' : '0.95rem'
                        }}
                      >
                        {item.text}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </aside>
          )}

          {htmlAfterFirstH2 && (
            <div 
              className="post-html"
              dangerouslySetInnerHTML={{ __html: htmlAfterFirstH2 }} 
            />
          )}
          
          <div style={{ clear: 'both' }}></div>

          <div style={{ margin: '4rem 0 2rem 0' }}>
            <SocialShare title={title} />
          </div>

          <div style={{ margin: '3rem 0' }}>
            <NewsletterForm />
          </div>

          {relatedPosts && relatedPosts.length > 0 && (
            <div style={{ margin: '3rem 0' }}>
              <RelatedPosts posts={relatedPosts} />
            </div>
          )}

          <div style={{ textAlign: 'center', margin: '3rem 0', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
            <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '1.1rem' }}>
              العودة للرئيسية 🏠
            </Link>
            <BackToTop />
          </div>
        </article>
      </main>
    </div>
  );
}
