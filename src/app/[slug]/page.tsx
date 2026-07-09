import { getPostBySlug, getPosts } from '@/lib/blogger';
import { notFound } from 'next/navigation';
import Link from 'next/link';

function processHtmlAndExtractTOC(html: string) {
  const toc: { id: string, text: string, level: number }[] = [];
  
  // Replace h2/h3 tags and inject IDs
  let idCounter = 0;
  const processedHtml = html.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, content) => {
    idCounter++;
    const id = `heading-${idCounter}`;
    // Strip tags from content for the TOC text
    const text = content.replace(/<[^>]+>/g, '').trim();
    if (text) {
      toc.push({ id, text, level: tag.toLowerCase() === 'h2' ? 2 : 3 });
    }
    return `<${tag} id="${id}"${attrs}>${content}</${tag}>`;
  });

  return { processedHtml, toc };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { processedHtml, toc } = processHtmlAndExtractTOC(post.content);

  return (
    <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
      <main style={{ flex: 1, minWidth: 0 }}>
        <nav style={{ marginBottom: '2rem' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            &rarr; العودة للرئيسية
          </Link>
        </nav>
        
        <article className="blog-post-content">
          <header style={{ marginBottom: '3rem', borderBottom: '2px solid var(--secondary)', paddingBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
              {post.title}
            </h1>
            <time style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              {new Date(post.published).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </header>
          
          <div 
            className="post-html"
            dangerouslySetInnerHTML={{ __html: processedHtml }} 
          />
        </article>
      </main>

      {toc.length > 0 && (
        <aside id="toc" style={{ flex: '0 0 300px', position: 'sticky', top: '100px' }} className="toc-sidebar">
          <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--secondary)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)', borderBottom: '1px solid var(--secondary)', paddingBottom: '0.5rem' }}>
              محتويات المقال
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {toc.map(item => (
                <li key={item.id} style={{ marginBottom: '0.5rem', paddingRight: item.level === 3 ? '1rem' : '0' }}>
                  <a href={`#${item.id}`} className="toc-link">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
