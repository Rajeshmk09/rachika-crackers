import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

const CATEGORIES = ['All', 'Sparklers', 'Rockets', 'Ground Chakkar', 'Bombs', 'Flower Pots', 'Sky Shots', 'Gift Boxes'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let list = products;
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory);
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(list);
  }, [activeCategory, search, products]);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    setProducts(data || []);
    setFiltered(data || []);
    setLoading(false);
  }

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-emoji-row">🎆 🎇 ✨ 🧨 🎉</div>
          <h1 className="hero-title">Rachika Crackers</h1>
          <p className="hero-sub">Celebrate Every Moment with Colour & Light!</p>
          <div className="hero-badges">
            <span>🚚 Free Delivery</span>
            <span>🏆 Best Quality</span>
            <span>💰 Best Price</span>
          </div>
        </div>
        <div className="fireworks-bg">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`spark spark-${i}`} />
          ))}
        </div>
      </section>

      {/* Search */}
      <div className="search-wrap">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search crackers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="products-section">
        {loading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>🎆 No products found</p>
            <span>Try a different category or search</span>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
