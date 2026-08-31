'use client';
import { useEffect, useState } from 'react';

export default function FontSizeToggler() {
  const [size, setSize] = useState<number>(18);

  useEffect(() => {
    // Check initial font size from local storage
    const savedSize = localStorage.getItem('fontSize');
    if (savedSize) {
      const parsed = parseInt(savedSize, 10);
      setSize(parsed);
      document.documentElement.style.fontSize = `${parsed}px`;
    }
  }, []);

  const changeSize = (delta: number) => {
    setSize((prev) => {
      const newSize = Math.max(14, Math.min(28, prev + delta)); // Min 14px, Max 28px
      document.documentElement.style.fontSize = `${newSize}px`;
      localStorage.setItem('fontSize', newSize.toString());
      return newSize;
    });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', margin: '0 0.5rem' }}>
      <button
        onClick={() => changeSize(2)}
        aria-label="Increase font size"
        title="تكبير الخط"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--foreground)',
          fontSize: '1.2rem',
          padding: '0.2rem',
          fontWeight: 'bold',
        }}
      >
        A+
      </button>
      <button
        onClick={() => changeSize(-2)}
        aria-label="Decrease font size"
        title="تصغير الخط"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--foreground)',
          fontSize: '0.9rem',
          padding: '0.2rem',
          fontWeight: 'bold',
        }}
      >
        A-
      </button>
    </div>
  );
}
