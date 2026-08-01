'use client';

import React, { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="newsletter-container">
      <div className="newsletter-content">
        <h3>هل أعجبك ما تقرأ؟ 💌</h3>
        <p>اشترك في القائمة البريدية لتصلك أحدث المقالات والدراسات اللاهوتية مباشرة إلى بريدك الإلكتروني.</p>
        
        {status === 'success' ? (
          <div className="newsletter-success">
            شكراً لاشتراكك! تمت إضافتك بنجاح للقائمة البريدية.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input 
              type="email" 
              placeholder="أدخل بريدك الإلكتروني هنا..." 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
              required
              disabled={status === 'loading'}
            />
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'جاري الاشتراك...' : 'اشترك الآن'}
            </button>
          </form>
        )}
        
        {status === 'error' && (
          <p style={{ color: '#e53e3e', marginTop: '1rem', fontSize: '0.9rem' }}>
            حدث خطأ أثناء الاشتراك. تأكد من صحة البريد الإلكتروني أو حاول مجدداً لاحقاً.
          </p>
        )}
      </div>
    </div>
  );
}
