'use client';

import React, { useState } from 'react';

interface NewsletterFormProps {
  title?: string;
  desc?: string;
  placeholder?: string;
  submitBtn?: string;
  loadingBtn?: string;
  successMsg?: string;
  errorMsg?: string;
}

export default function NewsletterForm({
  title = "هل أعجبك ما تقرأ؟ 💌",
  desc = "اشترك في القائمة البريدية لتصلك أحدث المقالات والدراسات اللاهوتية مباشرة إلى بريدك الإلكتروني.",
  placeholder = "أدخل بريدك الإلكتروني هنا...",
  submitBtn = "اشترك الآن",
  loadingBtn = "جاري الاشتراك...",
  successMsg = "شكراً لاشتراكك! تمت إضافتك بنجاح للقائمة البريدية.",
  errorMsg = "حدث خطأ أثناء الاشتراك. تأكد من صحة البريد الإلكتروني أو حاول مجدداً لاحقاً."
}: NewsletterFormProps) {
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
        <h3>{title}</h3>
        <p>{desc}</p>
        
        {status === 'success' ? (
          <div className="newsletter-success">
            {successMsg}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input 
              type="email" 
              placeholder={placeholder}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
              required
              disabled={status === 'loading'}
            />
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? loadingBtn : submitBtn}
            </button>
          </form>
        )}
        
        {status === 'error' && (
          <p style={{ color: '#e53e3e', marginTop: '1rem', fontSize: '0.9rem' }}>
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}
