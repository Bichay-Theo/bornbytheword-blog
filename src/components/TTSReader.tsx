'use client';
import { useState, useEffect } from 'react';

export default function TTSReader({ title }: { title?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(true);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Force voices to load on some browsers
      window.speechSynthesis.getVoices();
      
      const handleVoicesChanged = () => {
        setVoicesLoaded(true);
      };
      
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      };
    } else {
      setSupported(false);
    }
  }, []);

  const getArabicVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    // Try to find a high quality Arabic voice
    return voices.find(v => v.lang.startsWith('ar') && (v.name.includes('Premium') || v.name.includes('Online')))
        || voices.find(v => v.lang.startsWith('ar'))
        || null;
  };

  const getCleanText = () => {
    // Get the title
    let textToRead = title ? title + ". " : "";
    
    const article = document.querySelector('.blog-post-content');
    if (article) {
      const paragraphs = article.querySelectorAll('.post-html p, .post-html h2, .post-html h3');
      paragraphs.forEach(p => {
        // Clone node to safely modify it
        const clone = p.cloneNode(true) as HTMLElement;
        
        // Remove footnotes so it doesn't read numbers like "1 2"
        const sups = clone.querySelectorAll('sup');
        sups.forEach(sup => sup.remove());

        let text = clone.textContent || '';
        
        // Remove English characters entirely
        text = text.replace(/[a-zA-Z]/g, '');
        
        // Keep Arabic, Arabic numerals, standard numbers (in case of dates), and punctuation
        const cleanText = text.replace(/[^\u0621-\u064A\u0660-\u06690-9\s.,?!]/g, ' ');
        textToRead += cleanText + ". ";
      });
    }
    return textToRead;
  };

  const togglePlay = () => {
    if (!supported) return;

    const synth = window.speechSynthesis;

    if (isPlaying) {
      if (isPaused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
    } else {
      const text = getCleanText();
      if (!text.trim()) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      
      const arVoice = getArabicVoice();
      if (arVoice) {
        utterance.voice = arVoice;
      }

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      
      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        setIsPlaying(false);
        setIsPaused(false);
      };

      synth.cancel(); // Clear any pending
      synth.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const stopPlay = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!supported) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--card-bg)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--secondary)', width: 'fit-content' }}>
      <button 
        onClick={togglePlay}
        style={{
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '1.2rem',
          transition: 'transform 0.1s'
        }}
        title={isPlaying && !isPaused ? "إيقاف مؤقت" : "استماع للمقال"}
      >
        {isPlaying && !isPaused ? '⏸' : '▶'}
      </button>
      
      {isPlaying && (
        <button 
          onClick={stopPlay}
          style={{
            background: 'var(--secondary)',
            color: 'var(--foreground)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
          title="إيقاف"
        >
          ⏹
        </button>
      )}
      
      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        {isPlaying && !isPaused ? "جاري القراءة..." : "استمع للمقال"}
      </span>
    </div>
  );
}
