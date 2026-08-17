import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { Search, MapPin, Phone, ChevronLeft, ChevronRight, Shield, Package, Truck, Award } from 'lucide-react';

const CATEGORIES = ['All', 'Sparklers', 'Rockets', 'Ground Chakkar', 'Bombs', 'Flower Pots', 'Sky Shots', 'Gift Boxes'];

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER;

// Counter component with animation
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(target / 80);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(start);
        }, 25);
      }
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref} className="counter-num">{count}{suffix}</span>;
}

// Simple carousel
function HeroCarousel({ slides }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, [slides.length]);
  return (
    <div className="hero-carousel">
      {slides.map((s, i) => (
        <div key={i} className={`hero-slide ${i === idx ? 'active' : ''}`}>
          <div className="hero-slide-inner" style={{ background: s.bg }}>
            <div className="hero-text-block">
              <h1>{s.title}</h1>
              <p>{s.sub}</p>
              <a href="#products" className="hero-cta-btn">{s.btn}</a>
            </div>
            <div className="hero-emoji-block">{s.emoji}</div>
          </div>
        </div>
      ))}
      <button className="carousel-prev" onClick={() => setIdx(i => (i - 1 + slides.length) % slides.length)}><ChevronLeft /></button>
      <button className="carousel-next" onClick={() => setIdx(i => (i + 1) % slides.length)}><ChevronRight /></button>
      <div className="carousel-dots">
        {slides.map((_, i) => <span key={i} className={i === idx ? 'dot active' : 'dot'} onClick={() => setIdx(i)} />)}
      </div>
    </div>
  );
}

const HERO_SLIDES = [
  { title: 'Rachika Crackers', sub: 'Celebrate Every Moment with Colour & Light!', btn: 'Shop Now', bg: 'linear-gradient(135deg,#0a0a1a 60%,#1a0a2e)', emoji: '🎆🎇✨' },
  { title: 'Diwali Sale is LIVE!', sub: 'Best prices on Sivakasi crackers. Limited stock!', btn: 'Buy Now', bg: 'linear-gradient(135deg,#0a0a1a 60%,#2a0a0a)', emoji: '🧨🎉🎊' },
  { title: 'Gift Boxes & Combos', sub: 'Special gift packs for every celebration', btn: 'View Products', bg: 'linear-gradient(135deg,#0a0a1a 60%,#0a1a2a)', emoji: '🎁🎆🌟' },
];

const PRODUCT_CATS = [
  { name: 'Chakkars', desc: 'Chakkar Big, Special, Asoka...', emoji: '🌀', color: '#ff6b35' },
  { name: 'Flower Pots', desc: 'Colour pots small, Big, Special...', emoji: '🌸', color: '#ff4b8b' },
  { name: 'Sparklers', desc: 'Red, Green, Electric...', emoji: '✨', color: '#f59e0b' },
  { name: 'Single Sound', desc: 'Kuruvi, Lakshmi, Spider...', emoji: '💥', color: '#7c3aed' },
  { name: 'Gift Boxes', desc: 'Special, Deluxe, Grand...', emoji: '🎁', color: '#06b6d4' },
  { name: 'Rockets', desc: 'Sky shots, Colour rockets...', emoji: '🚀', color: '#10b981' },
];

const BRANDS = ['⭐ Vadivel', '🌟 Standard', '🔥 Anil', '💫 Ananda', '🐘 Elephant', '✨ Rachika', '🎆 Premium', '🎇 Classic'];

const WHY_US = [
  { icon: <Shield size={32} />, title: 'Superior Quality', desc: 'Fine quality products & innovation are the key behind our success' },
  { icon: <Award size={32} />, title: 'Best Price', desc: '90% discount on MRP. Best rates guaranteed for all our products' },
  { icon: <Truck size={32} />, title: 'Fast Delivery', desc: 'Quick dispatch through trusted transport partners across India' },
  { icon: <Package size={32} />, title: 'Safe Packing', desc: 'All crackers are safely packed as per explosive act guidelines' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => {
    let list = products;
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory);
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(list);
  }, [activeCategory, search, products]);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false });
    setProducts(data || []);
    setFiltered(data || []);
    setLoading(false);
  }

  return (
    <div className="site-wrapper">

      {/* ── MARQUEE ── */}
      <div className="marquee-bar">
        <div className="marquee-track">
          <span>
            🚨 Special Offer! Diwali sale is OPEN NOW! Up to 90% discount on all crackers! &nbsp;&nbsp;&nbsp;
            🧨 Order early to get best discounts. Happy Diwali! 🎆 &nbsp;&nbsp;&nbsp;
            📞 For bulk orders & instant offers call: +91 72003 62436 &nbsp;&nbsp;&nbsp;
            🚚 Free delivery for orders above ₹3000 in Tamil Nadu &nbsp;&nbsp;&nbsp;
            ✨ Best quality Sivakasi crackers at your doorstep! &nbsp;&nbsp;&nbsp;
          </span>
          <span aria-hidden>
            🚨 Special Offer! Diwali sale is OPEN NOW! Up to 90% discount on all crackers! &nbsp;&nbsp;&nbsp;
            🧨 Order early to get best discounts. Happy Diwali! 🎆 &nbsp;&nbsp;&nbsp;
            📞 For bulk orders & instant offers call: +91 72003 62436 &nbsp;&nbsp;&nbsp;
            🚚 Free delivery for orders above ₹3000 in Tamil Nadu &nbsp;&nbsp;&nbsp;
            ✨ Best quality Sivakasi crackers at your doorstep! &nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>

      {/* ── TOP HEADER ── */}
      <div className="top-header">
        <div className="top-header-inner">
          <div className="header-logo-wrap">
            <span className="header-logo-emoji">🎆</span>
            <div>
              <div className="header-logo-name">Rachika Crackers</div>
              <div className="header-logo-tag">Sivakasi's Finest</div>
            </div>
          </div>
          <div className="header-location">
            <MapPin size={22} className="header-icon" />
            <div>
              <div className="header-info-label">Location</div>
              <div className="header-info-val">Sivakasi, Tamil Nadu – 626 189</div>
            </div>
          </div>
          <div className="header-phone">
            <Phone size={22} className="header-icon" />
            <div>
              <div className="header-info-label">For Orders & Bulk</div>
              <div className="header-info-val">+91 72003 62436</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO CAROUSEL ── */}
      <HeroCarousel slides={HERO_SLIDES} />

      {/* ── FEATURE BOXES ── */}
      <div className="features-row">
        <div className="features-inner">
          <div className="feature-box">
            <div className="feature-icon">💰</div>
            <div><div className="feature-title">MIN ORDER VALUE</div><div className="feature-sub">₹3000 (TN, BLRE & PY)</div></div>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🛡️</div>
            <div><div className="feature-title">SAFE TO USE</div><div className="feature-sub">ISI Certified Crackers</div></div>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🌏</div>
            <div><div className="feature-title">OTHER STATES</div><div className="feature-sub">Minimum Order ₹6,000</div></div>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🏆</div>
            <div><div className="feature-title">QUALITY ASSURED</div><div className="feature-sub">Assured Quality Packing</div></div>
          </div>
        </div>
      </div>

      {/* ── ABOUT / COUNTERS ── */}
      <div className="about-section">
        <div className="about-inner">
          <div className="about-text-col">
            <h2 className="section-title gradient-text">Rachika Crackers</h2>
            <div className="section-subtitle">We're providing the best quality crackers in town.</div>
            <div className="section-divider" />
            <p className="about-desc">
              Discover an extensive selection of firecrackers to illuminate your celebrations with dazzling displays. 
              With over 200 varieties, we are one of the most sought brands from the Sivakasi region. 
              All products are known for their safety and delivered at economical pricing.
            </p>
          </div>
          <div className="counters-grid">
            <div className="counter-box">
              <div className="counter-icon">❤️</div>
              <Counter target={2014} />
              <div className="counter-label">SINCE</div>
            </div>
            <div className="counter-box">
              <div className="counter-icon">👥</div>
              <Counter target={500} suffix="+" />
              <div className="counter-label">HAPPY CLIENTS</div>
            </div>
            <div className="counter-box">
              <div className="counter-icon">✅</div>
              <Counter target={100} suffix="%" />
              <div className="counter-label">SATISFACTION</div>
            </div>
            <div className="counter-box">
              <div className="counter-icon">🎆</div>
              <Counter target={200} suffix="+" />
              <div className="counter-label">VARIETIES</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCT CATEGORIES ── */}
      <div className="categories-section">
        <div className="section-inner">
          <h2 className="section-title gradient-text text-center">Our Best & Trending Products</h2>
          <p className="section-para text-center">
            With over 200 varieties of crackers developed and marketed every year, 
            we are among the most sought brands in the Sivakasi region.
          </p>
          <div className="cat-cards-grid">
            {PRODUCT_CATS.map((cat, i) => (
              <div
                key={i}
                className="cat-card"
                style={{ '--cat-color': cat.color }}
                onClick={() => { setActiveCategory(cat.name.split(' ')[0] === 'Single' ? 'Bombs' : cat.name); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                <div className="cat-card-emoji">{cat.emoji}</div>
                <div className="cat-card-name">{cat.name}</div>
                <div className="cat-card-desc">{cat.desc}</div>
                <div className="cat-card-btn">Shop Now →</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PARALLAX CTA ── */}
      <div className="parallax-cta">
        <div className="parallax-content">
          <div className="parallax-fireworks">🎆 🎇 🎊 🎉 🧨 🎆</div>
          <h2>We are one of the leading sellers of Sivakasi Firecrackers</h2>
          <p>Available 24×7 Support. Order and let's celebrate!</p>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="cta-whatsapp-btn">
            💬 Contact on WhatsApp
          </a>
        </div>
      </div>

      {/* ── PRODUCTS SHOP ── */}
      <div id="products" className="shop-section">
        <div className="section-inner">
          <h2 className="section-title gradient-text text-center">🛒 Shop Now</h2>
          <p className="section-para text-center">Best quality crackers at guaranteed lowest prices</p>

          <div className="shop-controls">
            <div className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Search crackers..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="category-tabs">
              {CATEGORIES.map(cat => (
                <button key={cat} className={`cat-tab ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-grid">{[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontSize: '3rem' }}>🎆</p>
              <p>No products found. <br /><small>Admin can add products from the admin panel.</small></p>
            </div>
          ) : (
            <div className="products-grid">{filtered.map(p => <ProductCard key={p.id} product={p} />)}</div>
          )}
        </div>
      </div>

      {/* ── BRANDS ── */}
      <div className="brands-section">
        <div className="section-inner">
          <h2 className="section-title gradient-text text-center">Brands We Handle</h2>
          <p className="section-para text-center">We provide all top branded Diwali crackers & other occasional firecrackers</p>
          <div className="brands-track-wrap">
            <div className="brands-track">
              {[...BRANDS, ...BRANDS].map((b, i) => (
                <div key={i} className="brand-chip">{b}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── WHY CHOOSE US ── */}
      <div className="why-section">
        <div className="section-inner">
          <h2 className="section-title gradient-text text-center">Why Choose Us?</h2>
          <p className="section-para text-center">
            Whether you're marking a festival, a special occasion, or simply embracing the joy of life, 
            our curated collection ensures your moments shine the brightest.
          </p>
          <div className="why-grid">
            {WHY_US.map((w, i) => (
              <div className="why-card" key={i}>
                <div className="why-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRICELIST CTA ── */}
      <div className="pricelist-cta">
        <div className="pricelist-inner">
          <div>
            <h2>Our Pricelist</h2>
            <p>We offer the best quality products at best price. Make celebrations memorable with superior quality crackers!</p>
          </div>
          <button
            className="pricelist-btn"
            onClick={() => setActiveCategory('All') || document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Check Now →
          </button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <h3>Our Profile</h3>
            <p>"Rachika Crackers" – renowned wholesale supplier of an exclusive range of firecrackers from Sivakasi.</p>
            <h3 style={{ marginTop: '1.5rem' }}>Quick Links</h3>
            <div className="footer-links">
              <a href="#products">Products</a>
              <a href="#about">About Us</a>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">Contact</a>
            </div>
          </div>
          <div className="footer-col footer-logo-col">
            <div className="footer-logo">🎆</div>
            <div className="footer-logo-name">Rachika Crackers</div>
            <div className="footer-logo-tag">Sivakasi's Finest Firecrackers</div>
          </div>
          <div className="footer-col">
            <h3>Our Location</h3>
            <p>📍 Sivakasi, Tamil Nadu – 626 189</p>
            <h3 style={{ marginTop: '1rem' }}>For Orders</h3>
            <p>📞 +91 72003 62436</p>
            <p>💬 WhatsApp: +91 72003 62436</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            As per 2018 Supreme Court order, online sale of firecrackers are not permitted. 
            We request you to add products to cart and submit your enquiry. We will confirm via WhatsApp within 24hrs. 
            Happy Diwali! 🎆
          </p>
          <p className="footer-copy">© 2025 Rachika Crackers. All rights reserved.</p>
        </div>
      </footer>

      {/* ── FLOATING BUTTONS ── */}
      <a
        className="float-whatsapp"
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
      >
        💬
      </a>
      <a
        className="float-call"
        href="tel:+917200362436"
        title="Call Us"
      >
        📞
      </a>
    </div>
  );
}
