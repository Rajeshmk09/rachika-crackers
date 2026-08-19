import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, PhoneCall, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { toast } from 'react-hot-toast';

import HomeImg1 from '../assets/websitelogo.png';
import HomeImg2 from '../assets/home_img_2.jpeg';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://iplfsscpeixfxzbouhlp.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbGZzc2NwZWl4Znh6Ym91aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDQwNzksImV4cCI6MjEwMjUyMDA3OX0.nr2an5w0nX_L37C3g03HgzpFitueRNeOJ346TYvakZ8';

export default function MainHeader() {
  const { wishlistCount, cartCount, cartTotalPrice, pricelistUrl, setCartModalOpen } = useShop();
  const location = useLocation();

  const [marqueeMessage, setMarqueeMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [minOrderTn, setMinOrderTn] = useState(3000);

  useEffect(() => {
    const fetchMinSetting = async () => {
      try {
        const cached = localStorage.getItem('sethupyropark_min_order_settings');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.min_order_tn) {
            setMinOrderTn(parseFloat(parsed.min_order_tn) || 3000);
          }
        }
      } catch (e) {}

      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const val = parseFloat(data[0].min_order_tn) || 3000;
            setMinOrderTn(val);
            const newSet = {
              min_order_tn: val,
              min_order_other: parseFloat(data[0].min_order_other) || 5000
            };
            localStorage.setItem('sethupyropark_min_order_settings', JSON.stringify(newSet));
          }
        }
      } catch (err) {
        console.warn('DB min settings fetch error:', err);
      }
    };
    fetchMinSetting();
  }, []);

  const closeSidebar = () => setSidebarOpen(false);

  // Close sidebar on route change
  useEffect(() => { closeSidebar(); }, [location.pathname]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

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
    closeSidebar();
  };

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail !== undefined) setMarqueeMessage(String(e.detail || ''));
    };
    window.addEventListener('marquee_updated', handleUpdate);

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
        res = await fetch(`${SUPABASE_URL}/rest/v1/products?category=eq.__SITE_ANNOUNCEMENT__`, {
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0 && data[0].description) setMarqueeMessage(data[0].description);
        }
      } catch (err) {
        console.warn('DB announcement fetch error:', err);
      }
    };
    fetchDBAnnouncement();

    return () => window.removeEventListener('marquee_updated', handleUpdate);
  }, []);

  const handleCartClick = (e) => {
    e.preventDefault();

    if (cartTotalPrice === 0) {
      toast.error("Your cart is empty! Please add crackers to your cart first.");
      return;
    }

    if (cartTotalPrice < minOrderTn) {
      toast.error(`Minimum order amount is ₹${minOrderTn.toLocaleString('en-IN')}. (Current: ₹${cartTotalPrice.toLocaleString('en-IN')})`);
      return;
    }

    setCartModalOpen(true);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/products', label: 'Products' },
    { to: '/safetytips', label: 'Safety Tips' },
    { to: '/contact', label: 'Contact' },
  ];

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* ── Marquee + Desktop Header ───────────────────────────────────────── */}
      <header className="main-site-header">
        {marqueeMessage && marqueeMessage.trim() !== '' && (
          <div className="sectionbg">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 px-0">
                  <div className="py-2 px-2" style={{ backgroundColor: '#0a539f', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    <marquee behavior="scroll" direction="left" scrollamount="6" style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', display: 'block' }}>
                      {marqueeMessage}
                    </marquee>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop only: Logo + Location + Phone */}
        <div className="container py-2 d-none d-lg-block">
          <div className="row align-items-center">
            <div className="col-lg-4 text-lg-left">
              <Link to="/">
                <img src={HomeImg1} className="img-fluid logo" alt="SETHU PYRO PARK RACHIKA CRACKERS" title="SETHU PYRO PARK RACHIKA CRACKERS" />
              </Link>
            </div>
            <div className="col-lg-4">
              <div className="d-flex align-items-center">
                <div className="icon pr-2">
                  <img src={HomeImg2} className="img-fluid" alt="SETHU PYRO PARK" />
                </div>
                <div className="icon-info">
                  <div className="acme heading6 clr">Location</div>
                  <div className="josefin smallfnt">1/235/1 SIVAGANAPURAM, Sivagnanapuram,<br />Virudhunagar - 626 002</div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-right">
              <a href="tel:+918867390680" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '10px 18px', border: '1.5px solid #cbd5e1', borderRadius: '12px', backgroundColor: '#ffffff', textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', letterSpacing: '0.4px', textTransform: 'uppercase' }}>FOR QUERIES &amp; BULK ORDER</span>
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

      {/* ── Sticky Navbar ──────────────────────────────────────────────────── */}
      <nav className="navbar navbar-expand-lg navbar-light navbg navfont" style={{ position: 'sticky', top: 0, zIndex: 99999, boxShadow: '0 4px 14px rgba(0,0,0,0.18)', backgroundColor: '#0a539f' }}>
        <div className="container">

          {/* Mobile: small logo left */}
          <Link to="/" className="navbar-brand d-lg-none p-0" style={{ marginRight: 'auto' }}>
            <img src={HomeImg1} alt="SETHU PYRO PARK" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
          </Link>

          {/* Mobile: Cart Icon and info next to hamburger */}
          <Link 
            to="/cart" 
            onClick={handleCartClick}
            className="d-lg-none d-inline-flex align-items-center" 
            style={{ 
              textDecoration: 'none', 
              color: '#ffffff', 
              marginRight: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 12px',
              borderRadius: '30px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              transition: 'background-color 0.2s ease',
              fontFamily: 'var(--josefin-font, sans-serif)'
            }}
          >
            <ShoppingCart size={15} color="white" />
            <span style={{ fontSize: '0.78rem', fontWeight: '800', marginLeft: '6px', color: '#ffffff' }}>
              {cartCount} {cartTotalPrice > 0 ? `(₹${cartTotalPrice.toLocaleString('en-IN')})` : '(₹0)'}
            </span>
          </Link>

          {/* Mobile: hamburger right — opens sidebar */}
          <button
            className="d-lg-none"
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: '2px solid rgba(255,255,255,0.6)', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Desktop nav links */}
          <div className="d-none d-lg-block w-100">
            <ul className="navbar-nav mr-auto text-center align-items-center">
              {navLinks.map(({ to, label }) => (
                <li key={to} className={`nav-item px-2 ${isActive(to) ? 'active' : ''}`}>
                  <Link className="nav-link" to={to}>{label}</Link>
                </li>
              ))}
              <li className={`nav-item px-2 ${isActive('/wishlist') ? 'active' : ''}`}>
                <Link className="nav-link d-inline-flex align-items-center" to="/wishlist" style={{ color: wishlistCount > 0 ? '#ff4d4f' : 'inherit' }}>
                  <Heart size={16} fill={wishlistCount > 0 ? '#ff4d4f' : 'none'} color={wishlistCount > 0 ? '#ff4d4f' : 'currentColor'} className="mr-1" />
                  Wishlist
                  {wishlistCount > 0 && <span className="badge badge-pill badge-danger ml-1" style={{ fontSize: '0.75rem', padding: '3px 7px' }}>{wishlistCount}</span>}
                </Link>
              </li>
              <li className={`nav-item px-2 ${isActive('/cart') ? 'active' : ''}`}>
                <Link className="nav-link d-inline-flex align-items-center" to="/cart" style={{ color: cartCount > 0 ? '#ff7011' : 'inherit', fontWeight: cartCount > 0 ? '700' : 'normal' }}>
                  <ShoppingCart size={16} className="mr-1" color={cartCount > 0 ? '#ff7011' : 'currentColor'} />
                  Cart
                  {cartCount > 0 && <span className="badge badge-pill badge-warning ml-1 text-white" style={{ backgroundColor: '#ff7011', fontSize: '0.75rem', padding: '3px 7px' }}>{cartCount} {cartTotalPrice > 0 ? `(₹${cartTotalPrice.toLocaleString('en-IN')})` : ''}</span>}
                </Link>
              </li>
              <li className="nav-item px-2">
                <a className="pricelist_pdf blink" href={pricelistUrl || '/products'} onClick={handleDownloadPricelist} target="_blank" rel="noopener noreferrer">Download Pricelist</a>
              </li>
            </ul>
          </div>

        </div>
      </nav>

      {/* ── Mobile Sidebar Overlay ─────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 199998 }}
        />
      )}

      {/* ── Mobile Sidebar Drawer ──────────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '280px',
        backgroundColor: '#0a539f',
        zIndex: 199999,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Sidebar header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <Link to="/" onClick={closeSidebar}>
            <img src={HomeImg1} alt="SETHU PYRO PARK" style={{ height: '50px', objectFit: 'contain' }} />
          </Link>
          <button onClick={closeSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} aria-label="Close menu">
            <X size={26} color="white" />
          </button>
        </div>

        {/* Sidebar nav links */}
        <ul style={{ listStyle: 'none', padding: '12px 0', margin: 0, flex: 1 }}>
          {navLinks.map(({ to, label }) => (
            <li key={to} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <Link
                to={to}
                onClick={closeSidebar}
                style={{
                  display: 'block',
                  padding: '14px 24px',
                  color: isActive(to) ? '#ffd700' : '#ffffff',
                  fontWeight: isActive(to) ? '700' : '500',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  letterSpacing: '0.3px',
                  backgroundColor: isActive(to) ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                {label}
              </Link>
            </li>
          ))}

          {/* Wishlist */}
          <li style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <Link to="/wishlist" onClick={closeSidebar} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', color: wishlistCount > 0 ? '#ff4d4f' : '#ffffff', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' }}>
              <Heart size={17} fill={wishlistCount > 0 ? '#ff4d4f' : 'none'} color={wishlistCount > 0 ? '#ff4d4f' : 'white'} />
              Wishlist
              {wishlistCount > 0 && <span style={{ background: '#ff4d4f', color: '#fff', borderRadius: '20px', padding: '1px 8px', fontSize: '0.75rem' }}>{wishlistCount}</span>}
            </Link>
          </li>

          {/* Cart */}
          <li style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <Link to="/cart" onClick={closeSidebar} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', color: cartCount > 0 ? '#ff7011' : '#ffffff', textDecoration: 'none', fontSize: '1rem', fontWeight: cartCount > 0 ? '700' : '500' }}>
              <ShoppingCart size={17} color={cartCount > 0 ? '#ff7011' : 'white'} />
              Cart
              {cartCount > 0 && <span style={{ background: '#ff7011', color: '#fff', borderRadius: '20px', padding: '1px 8px', fontSize: '0.75rem' }}>{cartCount}</span>}
            </Link>
          </li>

          {/* Download Pricelist */}
          <li style={{ padding: '16px 24px' }}>
            <a
              className="pricelist_pdf blink"
              href={pricelistUrl || '/products'}
              onClick={handleDownloadPricelist}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', textAlign: 'center' }}
            >
              Download Pricelist
            </a>
          </li>
        </ul>

        {/* Sidebar footer: call */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <a href="tel:+918867390680" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600' }}>
            <PhoneCall size={18} color="#ffd700" />
            +91 8867390680
          </a>
        </div>
      </div>
    </>
  );
}
