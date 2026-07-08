'use client';

import { useEffect } from 'react';

export default function HashScroll() {
  useEffect(() => {
    const handleHashClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Walk up to find anchor tag
      const anchor = target.closest('a');
      if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
        const id = anchor.hash.slice(1);
        // decode URI component in case it's encoded
        let element = null;
        try {
          element = document.getElementById(id) || document.getElementById(decodeURIComponent(id));
        } catch(err) {}
        
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', anchor.hash);
        }
      }
    };
    
    document.addEventListener('click', handleHashClick);
    
    // Check hash on initial load
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.slice(1);
        try {
          const element = document.getElementById(id) || document.getElementById(decodeURIComponent(id));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } catch(err) {}
      }, 500); // Give time for Next.js to render HTML
    }
    
    return () => document.removeEventListener('click', handleHashClick);
  }, []);
  
  return null;
}
