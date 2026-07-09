import { getPageBySlug, getPages } from '@/lib/blogger';
import { notFound } from 'next/navigation';
import Link from 'next/link';

function processHtmlAndExtractTOC(html: string) {
  const toc: { id: string, text: string, level: number }[] = [];
  
  let idCounter = 0;
  const processedHtml = html.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, content) => {
    idCounter++;
    const id = `heading-${idCounter}`;
    const text = content.replace(/<[^>]+>/g, '').trim();
    if (text) {
      toc.push({ id, text, level: tag.toLowerCase() === 'h2' ? 2 : 3 });
    }
    return `<${tag} id="${id}"${attrs}>${content}</${tag}>`;
  });

  return { processedHtml, toc };
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const { processedHtml, toc } = processHtmlAndExtractTOC(page.content);

  return (
    <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
      <main style={{ flex: 1, minWidth: 0 }}>
        <nav style={{ marginBottom: '2rem' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            &rarr; العودة للرئيسية
          </Link>
        </nav>
        
        <article className="blog-post-content">

          
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
              محتويات الكتاب
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
  const pages = await getPages();
  if (pages.length === 0) {
    return [{ slug: 'placeholder' }];
  }
  return pages.map((page) => ({
    slug: page.slug,
  }));
}
