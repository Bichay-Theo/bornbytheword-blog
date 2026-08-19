import Link from 'next/link';
import { getPosts, getPages } from '@/lib/blogger';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';

export default async function Sidebar({ lang = 'ar' }: { lang?: string }) {
  const posts = await getPosts(lang);
  const pages = await getPages(lang);
  const dict = getDictionary(lang as Locale);
  
  // Extract unique labels
  const allLabels = posts.flatMap(p => p.labels);
  const uniqueLabels = Array.from(new Set(allLabels)).filter(label => label && label !== 'الكل');

  const prefix = lang === 'ar' ? '' : `/${lang}`;

  return (
    <div className="sidebar">
      {/* Languages Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <details>
          <summary className="sidebar-title" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🌐</span> {dict.sidebarLanguages}
          </summary>
          <ul className="sidebar-list" style={{ marginTop: '1rem' }}>
            <li>
              <Link href="/" className="sidebar-link" style={{ fontWeight: lang === 'ar' ? 'bold' : 'normal' }}>📖 العربية</Link>
            </li>
            <li>
              <Link href="/am" className="sidebar-link" style={{ fontWeight: lang === 'am' ? 'bold' : 'normal' }}>📖 አማርኛ</Link>
            </li>
            <li>
              <Link href="/sw" className="sidebar-link" style={{ fontWeight: lang === 'sw' ? 'bold' : 'normal' }}>📖 Kiswahili</Link>
            </li>
            <li>
              <Link href="/mas" className="sidebar-link" style={{ fontWeight: lang === 'mas' ? 'bold' : 'normal' }}>📖 Maa</Link>
            </li>
            <li>
              <Link href="/tmh" className="sidebar-link" style={{ fontWeight: lang === 'tmh' ? 'bold' : 'normal' }}>📖 Tamasheq</Link>
            </li>
            <li>
              <Link href="/kab" className="sidebar-link" style={{ fontWeight: lang === 'kab' ? 'bold' : 'normal' }}>📖 Taqbaylit</Link>
            </li>
            <li>
              <Link href="/shi" className="sidebar-link" style={{ fontWeight: lang === 'shi' ? 'bold' : 'normal' }}>📖 Tashelhit</Link>
            </li>
          </ul>
        </details>
      </div>

      {/* Books Section */}
      {pages.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 className="sidebar-title">{dict.sidebarBooks}</h3>
          <ul className="sidebar-list">
            {pages.map(page => (
              <li key={page.id}>
                <Link href={`${prefix}/p/${page.slug}`} className="sidebar-link" style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>
                  📖 {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Topics Section */}
      <h3 className="sidebar-title">{dict.sidebarTopics}</h3>
      <ul className="sidebar-list">
        <li>
          <Link href={prefix === '' ? '/' : prefix} className="sidebar-link">{dict.sidebarAll}</Link>
        </li>
        {uniqueLabels.map(label => {
          // Display localized label if we have a match in the dictionary, otherwise fallback to raw label
          let displayLabel = label;
          if (label === 'الكفارة البدلية') {
            displayLabel = dict.sidebarPenalSubstitution;
          }

          return (
            <li key={label}>
              <Link href={`${prefix === '' ? '/' : prefix}?topic=${encodeURIComponent(label)}`} className="sidebar-link">
                {displayLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
