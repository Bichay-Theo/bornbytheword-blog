import os, shutil

os.makedirs('src/components/i18n', exist_ok=True)

home_comp = '''import { getPosts } from '@/lib/blogger';
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
'''
with open('src/components/i18n/LangHome.tsx', 'w', encoding='utf-8') as f: f.write(home_comp)

post_comp = '''import { getPostBySlug, getPosts } from '@/lib/blogger';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import MarkdownLayout from '@/components/MarkdownLayout';
import Sidebar from '@/components/Sidebar';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';

export async function generateLangMetadata(slug: string, lang: string): Promise<Metadata> {
  const post = await getPostBySlug(slug, lang);
  if (!post) return { title: 'Not Found' };
  let desc = post.content.replace(/<[^>]+>/g, '').replace(/\\s+/g, ' ').trim().substring(0, 160);
  if (desc.length === 160) desc += '...';
  return { title: `${post.title} | ${lang.toUpperCase()}`, description: desc };
}

export default async function LangPost({ slug, lang }: { slug: string, lang: Locale }) {
  const posts = await getPosts(lang);
  const post = posts.find(p => p.slug === slug) || null;
  const dict = getDictionary(lang);

  if (!post) notFound();

  const currentPostLabels = post.labels || [];
  let relatedPostsRaw = posts.filter(p => p.slug !== slug && !p.labels.some((l: string) => currentPostLabels.includes(l)));
  
  if (relatedPostsRaw.length < 4) {
    const otherPosts = posts.filter(p => p.slug !== slug && !relatedPostsRaw.includes(p));
    relatedPostsRaw = [...relatedPostsRaw, ...otherPosts];
  }

  const relatedPosts = relatedPostsRaw.slice(0, 4).map(p => ({
    slug: p.slug, title: p.title, published: p.published,
  }));

  const dateStr = new Date(post.published).toLocaleDateString(lang === 'am' ? 'am-ET' : 'sw-KE', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="layout-container">
      <aside className="layout-sidebar">
        <Sidebar lang={lang} />
      </aside>
      <main className="layout-main">
        <MarkdownLayout 
          title={post.title} 
          date={dateStr} 
          content={post.content} 
          tocTitle={dict.toc} 
          relatedPosts={relatedPosts}
          lang={lang}
        />
      </main>
    </div>
  );
}
'''
with open('src/components/i18n/LangPost.tsx', 'w', encoding='utf-8') as f: f.write(post_comp)

page_comp = '''import { getPageBySlug, getPages } from '@/lib/blogger';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import MarkdownLayout from '@/components/MarkdownLayout';
import Sidebar from '@/components/Sidebar';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';

export async function generateLangPageMetadata(slug: string, lang: string): Promise<Metadata> {
  const page = await getPageBySlug(slug, lang);
  if (!page) return { title: 'Not Found' };
  let desc = page.content.replace(/<[^>]+>/g, '').replace(/\\s+/g, ' ').trim().substring(0, 160);
  if (desc.length === 160) desc += '...';
  return { title: `${page.title}`, description: desc };
}

export default async function LangPage({ slug, lang }: { slug: string, lang: Locale }) {
  const page = await getPageBySlug(slug, lang);
  const dict = getDictionary(lang);

  if (!page) notFound();

  return (
    <div className="layout-container">
      <aside className="layout-sidebar">
        <Sidebar lang={lang} />
      </aside>
      <main className="layout-main">
        <MarkdownLayout 
          content={page.content} 
          tocTitle={dict.toc}
          showToc={false}
          lang={lang}
        />
      </main>
    </div>
  );
}
'''
with open('src/components/i18n/LangPage.tsx', 'w', encoding='utf-8') as f: f.write(page_comp)

layout_comp = '''import { Locale, localeDirections } from '@/i18n/config';

export default function LangLayout({ children, lang }: { children: React.ReactNode, lang: Locale }) {
  const dir = localeDirections[lang] || 'ltr';
  return (
    <div lang={lang} dir={dir} style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
}
'''
with open('src/components/i18n/LangLayout.tsx', 'w', encoding='utf-8') as f: f.write(layout_comp)

# Delete the ambiguous [lang] folder
if os.path.exists('src/app/[lang]'):
    shutil.rmtree('src/app/[lang]')

# Create explicit 'am', 'sw', 'shi', 'kab', and 'tmh' routes
for lang in ['am', 'sw', 'shi', 'kab', 'tmh']:
    os.makedirs(f'src/app/{lang}/[slug]', exist_ok=True)
    os.makedirs(f'src/app/{lang}/p/[slug]', exist_ok=True)
    
    # layout.tsx
    with open(f'src/app/{lang}/layout.tsx', 'w', encoding='utf-8') as f:
        f.write(f'''import LangLayout from '@/components/i18n/LangLayout';
export default function Layout({{ children }}: {{ children: React.ReactNode }}) {{
  return <LangLayout lang="{lang}">{{children}}</LangLayout>;
}}
''')
    
    # page.tsx
    with open(f'src/app/{lang}/page.tsx', 'w', encoding='utf-8') as f:
        f.write(f'''import LangHome from '@/components/i18n/LangHome';
export default function Page() {{ return <LangHome lang="{lang}" />; }}
''')
    
    # [slug]/page.tsx
    with open(f'src/app/{lang}/[slug]/page.tsx', 'w', encoding='utf-8') as f:
        f.write(f'''import LangPost, {{ generateLangMetadata }} from '@/components/i18n/LangPost';
import {{ getPosts }} from '@/lib/blogger';

export async function generateMetadata({{ params }}: {{ params: Promise<{{ slug: string }}> }}) {{
  const {{ slug }} = await params;
  return generateLangMetadata(slug, "{lang}");
}}

export default async function Page({{ params }}: {{ params: Promise<{{ slug: string }}> }}) {{
  const {{ slug }} = await params;
  return <LangPost slug={{slug}} lang="{lang}" />;
}}

export async function generateStaticParams() {{
  const posts = await getPosts("{lang}");
  if (posts.length === 0) return [{{ slug: 'placeholder' }}];
  return posts.map(p => ({{ slug: p.slug }}));
}}
''')

    # p/[slug]/page.tsx
    with open(f'src/app/{lang}/p/[slug]/page.tsx', 'w', encoding='utf-8') as f:
        f.write(f'''import LangPage, {{ generateLangPageMetadata }} from '@/components/i18n/LangPage';
import {{ getPages }} from '@/lib/blogger';

export async function generateMetadata({{ params }}: {{ params: Promise<{{ slug: string }}> }}) {{
  const {{ slug }} = await params;
  return generateLangPageMetadata(slug, "{lang}");
}}

export default async function Page({{ params }}: {{ params: Promise<{{ slug: string }}> }}) {{
  const {{ slug }} = await params;
  return <LangPage slug={{slug}} lang="{lang}" />;
}}

export async function generateStaticParams() {{
  const pages = await getPages("{lang}");
  if (pages.length === 0) return [{{ slug: 'placeholder' }}];
  return pages.map(p => ({{ slug: p.slug }}));
}}
''')

print('Refactored i18n routing successfully.')
