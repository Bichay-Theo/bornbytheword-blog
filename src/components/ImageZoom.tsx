'use client';
import { useEffect } from 'react';
import mediumZoom from 'medium-zoom';
import 'medium-zoom/dist/style.css';

export default function ImageZoom() {
  useEffect(() => {
    // Attach medium-zoom to all images inside .blog-post-content
    const zoom = mediumZoom('.blog-post-content img', {
      margin: 24,
      background: 'var(--bg)',
    });

    return () => {
      zoom.detach();
    };
  }, []);

  return null;
}
