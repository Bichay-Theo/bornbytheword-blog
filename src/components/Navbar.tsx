'use client';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function SearchInput() {
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
      placeholder="ابحث في المقالات..." 
      value={query}
      onChange={handleSearch}
      className="search-input"
    />
  );
}

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          شاء فولدنا بكلمة الحق
        </Link>
        <div className="navbar-search">
          <Suspense fallback={<input type="text" placeholder="جارٍ التحميل..." className="search-input" disabled />}>
            <SearchInput />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
