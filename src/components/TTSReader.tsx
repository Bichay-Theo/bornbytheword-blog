'use client';
import { useState, useEffect, useRef } from 'react';

export default function TTSReader({ title }: { title?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(true);
  
  // Use a ref to keep track of the current chunk index
  const chunkIndexRef = useRef(0);
  const chunksRef = useRef<string[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      // Pre-load voices
      window.speechSynthesis.getVoices();
      
      const handleVoicesChanged = () => {
        // Voices loaded
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
    if (!synthRef.current) return null;
    const voices = synthRef.current.getVoices();
    return voices.find(v => v.lang.startsWith('ar') && (v.name.includes('Premium') || v.name.includes('Online')))
        || voices.find(v => v.lang.startsWith('ar'))
        || null;
  };

  const prepareChunks = () => {
    const chunks: string[] = [];
    if (title) {
      // Remove english/numbers from title if needed, but usually title is fine
      chunks.push(title.replace(/[a-zA-Z]/g, '').replace(/[^\u0600-\u06FF0-9\s.,?!]/g, ' '));
    }
    
    const article = document.querySelector('.blog-post-content');
    if (article) {
      // Select paragraphs, headings, list items, and blockquotes
      const elements = article.querySelectorAll('.post-html p, .post-html h2, .post-html h3, .post-html li, .post-html blockquote');
      
      let inTOC = false;

      elements.forEach(el => {
        const textContent = el.textContent || '';
        
        // Skip manual TOC headings
        if (el.tagName.toLowerCase() === 'h2' || el.tagName.toLowerCase() === 'h3') {
          if (textContent.includes('الفهرس') || textContent.includes('محتويات') || textContent.includes('المحتويات')) {
            inTOC = true;
            return;
          } else {
            inTOC = false; // We passed the TOC
          }
        }

        // If we are in a TOC and this is a list item, skip it
        if (inTOC && el.tagName.toLowerCase() === 'li') return;

        const clone = el.cloneNode(true) as HTMLElement;
        const sups = clone.querySelectorAll('sup');
        sups.forEach(sup => sup.remove());

        let text = clone.textContent || '';
        // Remove English characters entirely
        text = text.replace(/[a-zA-Z]/g, '');
        // Keep Arabic, numbers, punctuation
        const cleanText = text.replace(/[^\u0600-\u06FF0-9\s.,?!]/g, ' ').trim();
        
        if (cleanText) {
          // Split by periods to keep chunks small enough for Edge's natural voices
          const sentences = cleanText.split(/([.?!؟]+)/);
          let currentChunk = '';
          sentences.forEach(s => {
            if (currentChunk.length + s.length > 150) {
              chunks.push(currentChunk.trim());
              currentChunk = s;
            } else {
              currentChunk += s;
            }
          });
          if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
          }
        }
      });
    }
    return chunks.filter(c => c.length > 0);
  };

  const playNextChunk = () => {
    if (!synthRef.current) return;
    
    if (chunkIndexRef.current >= chunksRef.current.length) {
      // Finished all chunks
      setIsPlaying(false);
      setIsPaused(false);
      return;
    }

    const text = chunksRef.current[chunkIndexRef.current];
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance; // Prevent garbage collection bug!
    
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9; // Slightly slower for better Arabic pronunciation
    
    const arVoice = getArabicVoice();
    if (arVoice) {
      utterance.voice = arVoice;
    }

    utterance.onend = () => {
      chunkIndexRef.current += 1;
      setTimeout(() => {
        if (isPlaying) { 
          playNextChunk();
        }
      }, 100);
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error on chunk', chunkIndexRef.current, e);
      chunkIndexRef.current += 1;
      setTimeout(() => {
        if (isPlaying) playNextChunk();
      }, 100);
    };

    synthRef.current.speak(utterance);
  };

  const togglePlay = () => {
    if (!supported || !synthRef.current) return;

    if (isPlaying) {
      if (isPaused) {
        synthRef.current.resume();
        setIsPaused(false);
      } else {
        synthRef.current.pause();
        setIsPaused(true);
      }
    } else {
      chunksRef.current = prepareChunks();
      if (chunksRef.current.length === 0) return;

      synthRef.current.cancel(); // Clear any pending
      chunkIndexRef.current = 0;
      setIsPlaying(true);
      setIsPaused(false);
      
      // Use setTimeout to ensure cancel() finishes before speak()
      setTimeout(() => {
        playNextChunk();
      }, 50);
    }
  };

  const stopPlay = () => {
    if (!supported || !synthRef.current) return;
    synthRef.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    chunkIndexRef.current = 0;
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
