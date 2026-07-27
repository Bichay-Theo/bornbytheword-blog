"use client";

import React from 'react';

export default function BackToTop() {
  return (
    <a 
      href="#" 
      onClick={(e) => { 
        e.preventDefault(); 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
      }} 
      style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '1.1rem', cursor: 'pointer' }}
    >
      الرجوع للأعلى ⬆️
    </a>
  );
}
