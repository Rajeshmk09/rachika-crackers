import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, PhoneCall } from 'lucide-react';
import { useShop } from '../context/ShopContext';

import HomeImg1 from '../assets/websitelogo.png';
import HomeImg2 from '../assets/home_img_2.jpeg';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://iplfsscpeixfxzbouhlp.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbGZzc2NwZWl4Znh6Ym91aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDQwNzksImV4cCI6MjEwMjUyMDA3OX0.nr2an5w0nX_L37C3g03HgzpFitueRNeOJ346TYvakZ8';

export default function MainHeader() {
  const { wishlistCount, cartCount, cartTotalPrice, pricelistUrl } = useShop();
  const location = useLocation();

  const [marqueeMessage, setMarqueeMessage] = useState('');

  const handleDownloadPricelist = (e) => {
    if (pricelistUrl && pricelistUrl.startsWith('data:')) {
      e.preventDefault();
      try {
        const parts = pricelistUrl.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        const blob = new Blob([uInt8Array], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Sethu_Pyro_Park_Pricelist.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      } catch (err) {
        console.error('Error generating PDF download:', err);
        window.open(pricelistUrl, '_blank');
      }
    }
  };

  useEffect(() => {
    // 1. Listen for custom event updates from Admin Panel
    const handleUpdate = (e) => {
      if (e.detail !== undefined) {
        setMarqueeMessage(String(e.detail || ''));
      }
    };
    window.addEventListener('marquee_updated', handleUpdate);

    // 2. Fetch announcement message directly from Supabase DB API
    const fetchDBAnnouncement = async () => {
      try {
        let res = await fetch(`${SUPABASE_URL}/rest/v1/announcements?order=updated_at.desc`, {
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0 && (data[0].message || data[0].description)) {
            setMarqueeMessage(data[0].message || data[0].description);
            return;
          }
        }

        // Fallback to products table
        res = await fetch(`${SUPABASE_URL}/rest/v1/products?category=eq.__SITE_ANNOUNCEMENT__`, {
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0 && data[0].description) {
            setMarqueeMessage(data[0].description);
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

  // Do not render public header on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* 1. Top Scrolling Marquee Banner & Logo Bar */}
      <header className="main-site-header">
        {marqueeMessage && marqueeMessage.trim() !== '' && (
          <div className="sectionbg">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 px-0">
                  <div className="py-2 px-2" style={{ backgroundColor: '#0a539f', color: '#ffffff', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    <marquee behavior="scroll" direction="left" scrollamount="6" style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', display: 'block' }}>
                      {marqueeMessage}
                    </marquee>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logo + Location + Contact Info Bar */}
        <div className="container py-2">
          <div className="row align-items-center">
            <div className="col-lg-4 col-md-12 col-12 text-center text-lg-left">
              <Link to="/"> 
                <img src={HomeImg1} className="img-fluid logo" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
              </Link>
            </div>
            <div className="col-lg-4 d-none d-lg-block">
              <div className="d-flex align-items-center">
                <div className="icon pr-2">
                  <img src={HomeImg2} className="img-fluid" alt="SETHU PYRO PARK" />
                </div>
                <div className="icon-info">
                  <div className="acme heading6 clr">Location</div>
                  <div className="josefin smallfnt">9/296/1, Sri Anjaneya Nagar, Anupankulam,<br />Sivakasi - 626 189 </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 d-none d-lg-block text-right">
              <a
                href="tel:+918867390680"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 18px',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                    FOR QUERIES &amp; BULK ORDER
                  </span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ff6b35', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <PhoneCall size={17} color="#ff6b35" />
                    +91 8867390680
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Blue Main Navigation Bar (Position Sticky at Body Level) */}
      <nav
        className="navbar navbar-expand-lg navbar-light navbg navfont"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 99999,
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
          backgroundColor: '#0a539f'
        }}
      >
        <div className="container">
          <button type="button" className="navbar-toggler mx-auto" data-toggle="collapse" data-target="#myNavbar">
            <span className="bi bi-list text-white"> Menu </span>
          </button>
          <div id="myNavbar" className="collapse navbar-collapse navfont">
            <ul className="navbar-nav mr-auto text-center align-items-center">
              <li className={`nav-item px-2 ${isActive('/') ? 'active' : ''}`}>
                <Link className="nav-link" to="/"> Home </Link>
              </li>
              <li className={`nav-item px-2 ${isActive('/about') ? 'active' : ''}`}>
                <Link className="nav-link" to="/about"> About </Link>
              </li>
              <li className={`nav-item px-2 ${isActive('/products') ? 'active' : ''}`}>
                <Link className="nav-link" to="/products"> Products </Link>
              </li>

              {/* Wishlist Link with Live Badge */}
              <li className={`nav-item px-2 ${isActive('/wishlist') ? 'active' : ''}`}>
                <Link
                  className="nav-link d-inline-flex align-items-center"
                  to="/wishlist"
                  style={{ color: wishlistCount > 0 ? '#ff4d4f' : 'inherit' }}
                >
                  <Heart size={16} fill={wishlistCount > 0 ? "#ff4d4f" : "none"} color={wishlistCount > 0 ? "#ff4d4f" : "currentColor"} className="mr-1" />
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="badge badge-pill badge-danger ml-1" style={{ fontSize: '0.75rem', padding: '3px 7px' }}>
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </li>

              {/* Cart Link with Live Badge & Total */}
              <li className={`nav-item px-2 ${isActive('/cart') ? 'active' : ''}`}>
                <Link
                  className="nav-link d-inline-flex align-items-center"
                  to="/cart"
                  style={{ color: cartCount > 0 ? '#ff7011' : 'inherit', fontWeight: cartCount > 0 ? '700' : 'normal' }}
                >
                  <ShoppingCart size={16} className="mr-1" color={cartCount > 0 ? "#ff7011" : "currentColor"} />
                  Cart
                  {cartCount > 0 && (
                    <span className="badge badge-pill badge-warning ml-1 text-white" style={{ backgroundColor: '#ff7011', fontSize: '0.75rem', padding: '3px 7px' }}>
                      {cartCount} {cartTotalPrice > 0 ? `(₹${cartTotalPrice.toLocaleString('en-IN')})` : ''}
                    </span>
                  )}
                </Link>
              </li>

              <li className={`nav-item px-2 ${isActive('/safetytips') ? 'active' : ''}`}>
                <Link className="nav-link" to="/safetytips">Safety Tips</Link>
              </li>
              <li className={`nav-item px-2 ${isActive('/contact') ? 'active' : ''}`}>
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
              <li className="nav-item px-2 text-center">
                <a className="pricelist_pdf blink" href={pricelistUrl || "/products"} onClick={handleDownloadPricelist} target="_blank" rel="noopener noreferrer">
                  Download Pricelist
                </a>
              </li>
            </ul>
          </div> 	
        </div>	
      </nav>
    </>
  );
}
