'use client';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';
import ThemeToggle from './ThemeToggle';

function SearchInput({ dict }: { dict: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // Keep internal state in sync if URL changes
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Set query params
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    
    // Route appropriately
    if (pathname !== '/') {
      router.push(`/?${params.toString()}`);
    } else {
      router.replace(`/?${params.toString()}`);
    }
  };

  return (
    <input 
      type="text" 
      placeholder="بحث / Search..." 
      value={query}
      onChange={handleSearch}
      className="search-input"
    />
  );
}

function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    // Strip current lang prefix if any
    let newPath = pathname;
    if (pathname.startsWith('/am')) newPath = pathname.replace(/^\/am/, '');
    else if (pathname.startsWith('/sw')) newPath = pathname.replace(/^\/sw/, '');
    else if (pathname.startsWith('/shi')) newPath = pathname.replace(/^\/shi/, '');
    else if (pathname.startsWith('/kab')) newPath = pathname.replace(/^\/kab/, '');
    else if (pathname.startsWith('/tmh')) newPath = pathname.replace(/^\/tmh/, '');
    else if (pathname.startsWith('/mas')) newPath = pathname.replace(/^\/mas/, '');
    
    if (newPath === '') newPath = '/';

    // Add new lang prefix if not ar
    if (newLang !== 'ar') {
      newPath = `/${newLang}${newPath === '/' ? '' : newPath}`;
    }
    
    router.push(newPath);
  };

  return (
    <select 
      value={currentLang} 
      onChange={handleSwitch}
      style={{
        padding: '0.4rem 0.8rem',
        borderRadius: '5px',
        border: '1px solid var(--secondary)',
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
        fontFamily: 'inherit',
        cursor: 'pointer',
        marginRight: '1rem',
        marginLeft: '1rem',
      }}
    >
      <option value="ar">🌐 العربية</option>
      <option value="am">🌐 አማርኛ</option>
      <option value="sw">🌐 Kiswahili</option>
      <option value="shi">🌐 Tashelhit</option>
      <option value="kab">🌐 Taqbaylit</option>
      <option value="tmh">🌐 Tamasheq</option>
      <option value="mas">🌐 Maa</option>
    </select>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  let lang: Locale = 'ar';
  if (pathname.startsWith('/am')) lang = 'am';
  if (pathname.startsWith('/sw')) lang = 'sw';
  if (pathname.startsWith('/shi')) lang = 'shi';
  if (pathname.startsWith('/kab')) lang = 'kab';
  if (pathname.startsWith('/tmh')) lang = 'tmh';
  if (pathname.startsWith('/mas')) lang = 'mas';
  
  const dict = getDictionary(lang);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <nav className="navbar" dir={dir}>
      <div className="navbar-container">
        <Link href={lang === 'ar' ? '/' : `/${lang}`} className="navbar-logo">
          {dict.siteName}
        </Link>
        <div className="navbar-search" style={{ display: 'flex', alignItems: 'center' }}>
          <ThemeToggle />
          <LanguageSwitcher currentLang={lang} />
          <Suspense fallback={<input type="text" placeholder="..." className="search-input" disabled />}>
            <SearchInput dict={dict} />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
