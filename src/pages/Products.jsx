import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw, ChevronUp, ChevronDown, X, ArrowUpDown } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import HeaderNav from '../components/HeaderNav';
import ProductCard from '../components/ProductCard';
import MobileProductCard from '../components/MobileProductCard';
import TopMarquee from '../components/TopMarquee';

import ProductsImg1 from '../assets/websitelogo.png';
import ProductsImg2 from '../assets/products_img_2.jpeg';

const SORT_OPTIONS = [
  { value: 'default',      label: 'Default' },
  { value: 'priceLow',     label: 'Price ↑' },
  { value: 'priceHigh',    label: 'Price ↓' },
  { value: 'discountHigh', label: 'Discount ↓' },
  { value: 'nameAsc',      label: 'A → Z' },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = SORT_OPTIONS.find(o => o.value === value) || SORT_OPTIONS[0];

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '7px 12px', borderRadius: '10px',
          background: '#fff', border: '1px solid #cbd5e1',
          fontSize: '0.82rem', fontWeight: '600', color: '#1e293b',
          cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '110px',
          justifyContent: 'space-between',
        }}
      >
        {selected.label}
        <ChevronDown size={14} color="#64748b" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 6px)',
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 1000,
            overflow: 'hidden', minWidth: '130px',
          }}>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 16px', border: 'none', background: opt.value === value ? '#fff7f0' : '#fff',
                  fontSize: '0.82rem', fontWeight: opt.value === value ? '700' : '500',
                  color: opt.value === value ? '#ff7011' : '#1e293b',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Products() {
  const { products, loading: shopLoading } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Active filter states (applied to product grid) ─────────────────────────
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const initialCat = searchParams.get('cat');
    return initialCat && initialCat !== 'All' ? [initialCat] : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [minDiscount, setMinDiscount] = useState(0);
  const [sortBy, setSortBy] = useState('default');

  // ── Mobile state ────────────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // ── Mobile bottom-sheet filter state ────────────────────────────────────────
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  // Draft states — only applied when "Apply" is tapped
  const [draftCategories, setDraftCategories] = useState([]);
  const [draftMinPrice, setDraftMinPrice] = useState(0);
  const [draftMaxPrice, setDraftMaxPrice] = useState(10000);
  const [draftMinDiscount, setDraftMinDiscount] = useState(0);

  // Open sheet: copy current applied state into drafts
  const openFilterSheet = () => {
    setDraftCategories([...selectedCategories]);
    setDraftMinPrice(minPrice);
    setDraftMaxPrice(maxPrice);
    setDraftMinDiscount(minDiscount);
    setFilterSheetOpen(true);
  };

  // Apply: push drafts into real state and close
  const applyFilters = () => {
    setSelectedCategories(draftCategories);
    setMinPrice(draftMinPrice);
    setMaxPrice(draftMaxPrice);
    setMinDiscount(draftMinDiscount);
    if (draftCategories.length === 1) {
      setSearchParams({ cat: draftCategories[0] });
    } else {
      searchParams.delete('cat');
      setSearchParams(searchParams);
    }
    setFilterSheetOpen(false);
  };

  const resetDrafts = () => {
    setDraftCategories([]);
    setDraftMinPrice(0);
    setDraftMaxPrice(highestCatalogPrice);
    setDraftMinDiscount(0);
  };

  // Lock scroll when sheet open
  useEffect(() => {
    document.body.style.overflow = filterSheetOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [filterSheetOpen]);

  // ── Sidebar UI state ────────────────────────────────────────────────────────
  const [catExpanded, setCatExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [discountExpanded, setDiscountExpanded] = useState(true);

  // ── Price range ─────────────────────────────────────────────────────────────
  const highestCatalogPrice = useMemo(() => {
    if (!products || products.length === 0) return 5000;
    const max = Math.max(...products.map(p => parseFloat(p.price || 0)));
    return max > 0 ? Math.ceil(max) : 5000;
  }, [products]);

  useEffect(() => {
    if (highestCatalogPrice > 0 && maxPrice === 10000) {
      setMaxPrice(highestCatalogPrice);
      setDraftMaxPrice(highestCatalogPrice);
    }
  }, [highestCatalogPrice]);

  // ── Sync URL → state ────────────────────────────────────────────────────────
  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat && cat !== 'All') {
      setSelectedCategories(prev => (prev.includes(cat) ? prev : [cat]));
    }
  }, [searchParams]);

  // ── Categories list ─────────────────────────────────────────────────────────
  const categoriesList = useMemo(() => {
    if (!products || products.length === 0) return [];
    const map = new Map();
    products.forEach(p => {
      const cat = p.category || 'Uncategorized';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [products]);

  // ── Category toggle (desktop sidebar) ──────────────────────────────────────
  const toggleCategory = (catName) => {
    if (catName === 'All') {
      setSelectedCategories([]);
      searchParams.delete('cat');
      setSearchParams(searchParams);
      return;
    }
    setSelectedCategories(prev => {
      const next = prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName];
      if (next.length === 1) setSearchParams({ cat: next[0] });
      else { searchParams.delete('cat'); setSearchParams(searchParams); }
      return next;
    });
  };

  // ── Draft category toggle (mobile sheet) ───────────────────────────────────
  const toggleDraftCategory = (catName) => {
    if (catName === 'All') { setDraftCategories([]); return; }
    setDraftCategories(prev =>
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  // ── Filter & sort ───────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => {
      const price = parseFloat(p.price || 0);

      if (selectedCategories.length > 0) {
        const pCat = (p.category || '').toLowerCase();
        if (!selectedCategories.some(c => c.toLowerCase() === pCat)) return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        if (
          !(p.name || '').toLowerCase().includes(q) &&
          !(p.product_code || '').toLowerCase().includes(q) &&
          !(p.category || '').toLowerCase().includes(q)
        ) return false;
      }

      if (price < minPrice || price > maxPrice) return false;

      if (selectedPriceRanges.length > 0) {
        const ok =
          (selectedPriceRanges.includes('under200') && price < 200) ||
          (selectedPriceRanges.includes('200to500') && price >= 200 && price <= 500) ||
          (selectedPriceRanges.includes('500to1000') && price >= 500 && price <= 1000) ||
          (selectedPriceRanges.includes('above1000') && price > 1000);
        if (!ok) return false;
      }

      const mrp = parseFloat(p.mrp || p.original_price || p.price || 0);
      const discount = (mrp > 0 && mrp >= price) ? Math.round(((mrp - price) / mrp) * 100) : (p.discount_percentage || 0);
      if (minDiscount > 0 && discount < minDiscount) return false;

      return true;
    }).sort((a, b) => {
      const pA = parseFloat(a.price || 0), pB = parseFloat(b.price || 0);
      const mrpA = parseFloat(a.mrp || a.original_price || a.price || 0);
      const mrpB = parseFloat(b.mrp || b.original_price || b.price || 0);
      const dA = mrpA > 0 ? ((mrpA - pA) / mrpA) * 100 : 0;
      const dB = mrpB > 0 ? ((mrpB - pB) / mrpB) * 100 : 0;
      if (sortBy === 'priceLow') return pA - pB;
      if (sortBy === 'priceHigh') return pB - pA;
      if (sortBy === 'discountHigh') return dB - dA;
      if (sortBy === 'nameAsc') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });
  }, [products, selectedCategories, searchQuery, minPrice, maxPrice, selectedPriceRanges, minDiscount, sortBy]);

  const handleResetAllFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(highestCatalogPrice);
    setSelectedPriceRanges([]);
    setMinDiscount(0);
    setSortBy('default');
    setSearchParams({});
  };

  const activeFiltersCount =
    (selectedCategories.length > 0 ? 1 : 0) +
    (searchQuery !== '' ? 1 : 0) +
    (minPrice > 0 || maxPrice < highestCatalogPrice ? 1 : 0) +
    (selectedPriceRanges.length > 0 ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0);

  // ── Reusable filter panel content ───────────────────────────────────────────
  // Used in both desktop sidebar and mobile sheet (with draft/real state switch)
  const FilterContent = ({ draft = false }) => {
    const cats = draft ? draftCategories : selectedCategories;
    const toggleCat = draft ? toggleDraftCategory : toggleCategory;
    const curMax = draft ? draftMaxPrice : maxPrice;
    const setMax = draft ? setDraftMaxPrice : setMaxPrice;
    const curMin = draft ? draftMinPrice : minPrice;
    const curDiscount = draft ? draftMinDiscount : minDiscount;
    const setDiscount = draft ? setDraftMinDiscount : setMinDiscount;

    return (
      <>
        {/* Categories */}
        <div className="mb-4">
          <div
            className="d-flex align-items-center justify-content-between py-1"
            onClick={() => setCatExpanded(!catExpanded)}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex align-items-center" style={{ gap: '8px' }}>
              <span className="font-weight-bold text-dark" style={{ fontSize: '1.05rem' }}>Categories</span>
              <span className="badge badge-pill badge-light text-muted px-2" style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9' }}>{categoriesList.length}</span>
            </div>
            {catExpanded ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
          </div>

          {catExpanded && (
            <div className="mt-2 pr-1" style={{ maxHeight: '220px', overflowY: 'auto' }}>
              <label className="d-flex align-items-center justify-content-between py-2 px-2 rounded mb-1"
                style={{ backgroundColor: cats.length === 0 ? '#fff3ee' : 'transparent', cursor: 'pointer' }}>
                <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                  <input type="checkbox" checked={cats.length === 0} onChange={() => toggleCat('All')}
                    style={{ width: '16px', height: '16px', accentColor: '#ff7011', cursor: 'pointer' }} />
                  <span className="josefin" style={{ fontSize: '0.9rem', color: cats.length === 0 ? '#ff7011' : '#334155', fontWeight: cats.length === 0 ? '700' : '400' }}>All Categories</span>
                </div>
                <span className="badge badge-pill badge-light text-muted" style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9' }}>{products.length}</span>
              </label>

              {categoriesList.map(({ name, count }) => {
                const checked = cats.includes(name);
                return (
                  <label key={name} className="d-flex align-items-center justify-content-between py-2 px-2 rounded mb-1"
                    style={{ backgroundColor: checked ? '#fff3ee' : 'transparent', cursor: 'pointer' }}>
                    <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                      <input type="checkbox" checked={checked} onChange={() => toggleCat(name)}
                        style={{ width: '16px', height: '16px', accentColor: '#ff7011', cursor: 'pointer' }} />
                      <span className="josefin text-truncate" style={{ fontSize: '0.9rem', color: checked ? '#ff7011' : '#334155', fontWeight: checked ? '700' : '400', maxWidth: '150px' }}>{name}</span>
                    </div>
                    <span className="badge badge-pill" style={{ fontSize: '0.75rem', backgroundColor: checked ? '#ff7011' : '#f1f5f9', color: checked ? '#fff' : '#64748b' }}>{count}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <hr style={{ borderColor: '#f1f5f9', margin: '16px 0' }} />

        {/* Price Filter */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between py-1"
            onClick={() => setPriceExpanded(!priceExpanded)} style={{ cursor: 'pointer' }}>
            <span className="font-weight-bold text-dark" style={{ fontSize: '1.05rem' }}>Price Filter</span>
            {priceExpanded ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
          </div>
          {priceExpanded && (
            <div className="mt-3">
              <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                <div className="d-flex justify-content-between small font-weight-bold josefin mb-2 text-dark">
                  <span>₹{curMin}</span>
                  <span>₹{curMax.toLocaleString('en-IN')}</span>
                </div>
                <input type="range" className="custom-range" min="0" max={highestCatalogPrice} step="50"
                  value={curMax} onChange={(e) => setMax(Number(e.target.value))}
                  style={{ accentColor: '#ff7011', cursor: 'pointer' }} />
                <div className="text-center small josefin text-muted mt-1">
                  Max Price: <strong>₹{curMax.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        <hr style={{ borderColor: '#f1f5f9', margin: '16px 0' }} />

        {/* Discount Filter */}
        <div className="mb-2">
          <div className="d-flex align-items-center justify-content-between py-1"
            onClick={() => setDiscountExpanded(!discountExpanded)} style={{ cursor: 'pointer' }}>
            <span className="font-weight-bold text-dark" style={{ fontSize: '1.05rem' }}>Min. Discount</span>
            {discountExpanded ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
          </div>
          {discountExpanded && (
            <div className="mt-2 d-flex flex-wrap" style={{ gap: '8px' }}>
              {[0, 10, 30, 50, 70].map(val => (
                <button key={val} type="button"
                  onClick={() => setDiscount(val)}
                  style={{
                    padding: '5px 14px', borderRadius: '20px', border: '1px solid',
                    borderColor: curDiscount === val ? '#ff7011' : '#e2e8f0',
                    background: curDiscount === val ? '#ff7011' : '#fff',
                    color: curDiscount === val ? '#fff' : '#334155',
                    fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  {val === 0 ? 'Any' : `${val}%+`}
                </button>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="products-page bg-light min-vh-100">

      {/* Breadcrumb */}
      <div className="bg-white border-bottom py-2">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent p-0 m-0 small josefin">
              <li className="breadcrumb-item"><Link to="/" className="text-muted">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/products" className="text-muted">Products</Link></li>
              {selectedCategories.length === 1 && (
                <li className="breadcrumb-item active text-dark font-weight-bold" aria-current="page">{selectedCategories[0]}</li>
              )}
            </ol>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 16px' }}>
        <div className="row">

          {/* ── Desktop Left Sidebar (hidden on mobile) ── */}
          <div className="d-none d-lg-block col-lg-3 mb-4 mb-lg-0">
            <div className="bg-white shadow-sm border p-4 sticky-top" style={{ borderRadius: '16px', top: '70px', zIndex: 100 }}>
              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-4">
                <h4 className="font-weight-bold text-dark mb-0 d-flex align-items-center" style={{ fontSize: '1.25rem' }}>
                  <SlidersHorizontal size={20} className="mr-2" color="#ff7011" />
                  Filters
                </h4>
                {activeFiltersCount > 0 && (
                  <button onClick={handleResetAllFilters}
                    className="btn btn-link p-0 text-danger small josefin d-flex align-items-center text-decoration-none font-weight-bold">
                    <RotateCcw size={12} className="mr-1" /> Clear ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Search — desktop only in sidebar */}
              <div className="mb-4">
                <label className="small font-weight-bold text-dark mb-2 josefin">Search Crackers</label>
                <div className="position-relative">
                  <input type="text" className="form-control josefin" placeholder="Search by name or code.."
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ borderRadius: '10px', paddingLeft: '36px', height: '42px', fontSize: '0.9rem', borderColor: '#e2e8f0' }} />
                  <Search size={16} className="position-absolute text-muted" style={{ left: '12px', top: '13px' }} />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')}
                      className="btn btn-link p-0 position-absolute text-muted" style={{ right: '10px', top: '10px' }}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <hr className="my-4" style={{ borderColor: '#f1f5f9' }} />
              <FilterContent draft={false} />
            </div>
          </div>

          {/* ── Right Product Grid ── */}
          <div className="col-12 col-lg-9">

            {/* Top bar */}
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2" style={{ gap: '12px', flexWrap: 'wrap', ...(isMobile ? { position: 'sticky', top: '60px', zIndex: 900, background: '#f1f5f9', padding: '10px 4px', margin: '0 -4px 12px' } : {}) }}>
              <div className="d-flex align-items-center" style={{ gap: '10px', flex: 1, minWidth: 0 }}>

                {/* Mobile Filter button */}
                {isMobile && (
                  <button type="button" onClick={openFilterSheet}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '10px',
                      backgroundColor: activeFiltersCount > 0 ? '#ff7011' : '#fff',
                      border: `1px solid ${activeFiltersCount > 0 ? '#ff7011' : '#e2e8f0'}`,
                      color: activeFiltersCount > 0 ? '#fff' : '#334155',
                      fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer',
                      whiteSpace: 'nowrap', flexShrink: 0
                    }}>
                    <SlidersHorizontal size={15} />
                    Filter {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
                  </button>
                )}

                {/* Desktop title */}
                {!isMobile && (
                  <h2 className="font-weight-bold text-dark mb-0" style={{ fontSize: '1.75rem' }}>
                    {selectedCategories.length === 0 ? 'All Products'
                      : selectedCategories.length === 1 ? selectedCategories[0]
                      : `Selected (${selectedCategories.length} Categories)`}
                  </h2>
                )}
              </div>

              <div className="d-flex align-items-center" style={{ gap: '10px', flexShrink: 0 }}>
                <span className="text-muted josefin small font-weight-bold">{filteredProducts.length} Products</span>
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>
            </div>

            {/* Active category pills */}
            {selectedCategories.length > 0 && (
              <div className="d-flex flex-wrap align-items-center mb-3" style={{ gap: '8px' }}>
                {selectedCategories.map(cat => (
                  <span key={cat} className="josefin font-weight-bold d-inline-flex align-items-center"
                    style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: '#fff3ee', color: '#ff7011', border: '1px solid #ff701133', fontSize: '0.82rem' }}>
                    {cat}
                    <X size={13} className="ml-1" onClick={() => toggleCategory(cat)} style={{ cursor: 'pointer', opacity: 0.7 }} />
                  </span>
                ))}
                <button type="button" onClick={() => setSelectedCategories([])}
                  className="btn btn-link p-0 text-danger small josefin font-weight-bold text-decoration-none">
                  Clear All
                </button>
              </div>
            )}

            {/* Products Grid */}
            {shopLoading ? (
              <div className="row">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="col-6 col-sm-6 col-md-4 mb-3">
                    <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                      <div className="p-3 text-center" style={{ backgroundColor: '#f5f5f7', margin: '8px 8px 0 8px', borderRadius: '12px' }}>
                        <div className="skeleton-pulse" style={{ height: '180px', borderRadius: '10px', backgroundColor: '#e2e8f0' }} />
                      </div>
                      <div className="card-body p-3">
                        <div className="skeleton-pulse mb-2" style={{ width: '50%', height: '12px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
                        <div className="skeleton-pulse mb-3" style={{ width: '80%', height: '18px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
                        <div className="skeleton-pulse" style={{ width: '100%', height: '32px', borderRadius: '16px', backgroundColor: '#e2e8f0' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded border p-5 text-center my-3" style={{ borderRadius: '16px' }}>
                <div className="rounded-circle bg-light d-inline-flex p-4 mb-3">
                  <Search size={40} color="#94a3b8" />
                </div>
                <h4 className="acme text-dark mb-2">No Products Found</h4>
                <p className="text-muted josefin mb-4" style={{ maxWidth: '360px', margin: '0 auto 16px' }}>
                  Try resetting filters or searching a different term.
                </p>
                <button onClick={handleResetAllFilters}
                  className="btn text-white font-weight-bold acme rounded-pill px-4 py-2"
                  style={{ backgroundColor: '#ff7011', border: 'none' }}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="row">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="col-6 col-sm-6 col-md-4 mb-3">
                    {isMobile ? <MobileProductCard product={product} /> : <ProductCard product={product} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Bottom Sheet ─────────────────────────────────────── */}
      {/* Overlay */}
      {filterSheetOpen && (
        <div onClick={() => setFilterSheetOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 299998 }} />
      )}

      {/* Drawer — slides up from bottom */}
      <div style={{
        position: 'fixed',
        left: 0, right: 0, bottom: 0,
        height: '85vh',
        backgroundColor: '#fff',
        borderRadius: '20px 20px 0 0',
        zIndex: 299999,
        transform: filterSheetOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Sheet header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={18} color="#ff7011" />
            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a1a' }}>Filters</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button type="button" onClick={resetDrafts}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}>
              Reset
            </button>
            <button type="button" onClick={() => setFilterSheetOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#64748b' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Scrollable filter content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 100px' }}>
          <FilterContent draft={true} />
        </div>

        {/* Apply button — fixed at bottom of sheet */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 20px', backgroundColor: '#fff', borderTop: '1px solid #f1f5f9' }}>
          <button type="button" onClick={applyFilters}
            style={{
              width: '100%', padding: '14px', borderRadius: '14px',
              backgroundColor: '#ff7011', color: '#fff',
              border: 'none', fontSize: '1rem', fontWeight: '700',
              cursor: 'pointer', letterSpacing: '0.3px'
            }}>
            Apply Filters
            {(draftCategories.length > 0 || draftMinDiscount > 0 || draftMaxPrice < highestCatalogPrice) && (
              <span style={{ marginLeft: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', padding: '1px 8px', fontSize: '0.82rem' }}>
                {draftCategories.length > 0 ? draftCategories.length : ''}{draftMinDiscount > 0 ? ` ${draftMinDiscount}%+` : ''}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
