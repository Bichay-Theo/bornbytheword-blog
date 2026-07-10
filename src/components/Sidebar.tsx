import Link from 'next/link';
import { getPosts, getPages } from '@/lib/blogger';

export default async function Sidebar() {
  const posts = await getPosts();
  const pages = await getPages();
  
  // Extract unique labels
  const allLabels = posts.flatMap(p => p.labels);
  const uniqueLabels = Array.from(new Set(allLabels)).filter(label => label && label !== 'الكل');

  return (
    <div className="sidebar">

      {/* Books Section */}
      {pages.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 className="sidebar-title">الكتب الكاملة</h3>
          <ul className="sidebar-list">
            {pages.map(page => (
              <li key={page.id} style={{ marginBottom: '1rem' }}>
                <Link href={`/p/${page.slug}`} className="sidebar-link" style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>
                  📖 {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Topics Section */}
      <h3 className="sidebar-title">المواضيع (التصنيفات)</h3>
      <ul className="sidebar-list">
        <li>
          <Link href="/" className="sidebar-link">الكل</Link>
        </li>
        {uniqueLabels.map(label => (
          <li key={label}>
            <Link href={`/?topic=${encodeURIComponent(label)}`} className="sidebar-link">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
