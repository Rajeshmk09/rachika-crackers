import React, { useState, useEffect } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://iplfsscpeixfxzbouhlp.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbGZzc2NwZWl4Znh6Ym91aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDQwNzksImV4cCI6MjEwMjUyMDA3OX0.nr2an5w0nX_L37C3g03HgzpFitueRNeOJ346TYvakZ8';

export default function TopMarquee() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail !== undefined) setMessage(String(e.detail || ''));
    };
    window.addEventListener('marquee_updated', handleUpdate);

    const fetchDBAnnouncement = async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/products?category=eq.__SITE_ANNOUNCEMENT__`, {
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0 && data[0].description) {
            setMessage(data[0].description);
          }
        }
      } catch (err) {
        console.warn('DB announcement fetch error:', err);
      }
    };
    fetchDBAnnouncement();

    return () => {
      window.removeEventListener('marquee_updated', handleUpdate);
    };
  }, []);

  if (!message || message.trim() === '') {
    return null;
  }

  return (
    <div className="sectionbg">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 px-0">
            <div className="py-2 px-2" style={{ backgroundColor: '#0a539f', color: '#ffffff', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <marquee behavior="scroll" direction="left" scrollamount="6" style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', display: 'block' }}>
                {message}
              </marquee>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
