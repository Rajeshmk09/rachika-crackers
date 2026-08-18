import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw, ChevronUp, ChevronDown, CheckSquare, Square, Tag, ArrowUpDown, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import HeaderNav from '../components/HeaderNav';
import ProductCard from '../components/ProductCard';
import TopMarquee from '../components/TopMarquee';

import ProductsImg1 from '../assets/websitelogo.png';
import ProductsImg2 from '../assets/products_img_2.jpeg';

export default function Products() {
  const { products, loading: shopLoading } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  // Multi-select Category filter state (Array of category names)
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const initialCat = searchParams.get('cat');
    return initialCat && initialCat !== 'All' ? [initialCat] : [];
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Price Filter (Min / Max range slider + checkboxes)
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]); // ['under200', '200to500', etc.]

  // Discount Filter
  const [minDiscount, setMinDiscount] = useState(0); // 0, 10, 30, 50

  // Sorting
  const [sortBy, setSortBy] = useState('default');

  // Collapsible sections state
  const [catExpanded, setCatExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [discountExpanded, setDiscountExpanded] = useState(true);

  // Highest price calculation for range slider max boundary
  const highestCatalogPrice = useMemo(() => {
    if (!products || products.length === 0) return 5000;
    const max = Math.max(...products.map(p => parseFloat(p.price || 0)));
    return max > 0 ? Math.ceil(max) : 5000;
  }, [products]);

  useEffect(() => {
    if (highestCatalogPrice > 0 && maxPrice === 10000) {
      setMaxPrice(highestCatalogPrice);
    }
  }, [highestCatalogPrice]);

  // Keep selectedCategories synced if URL parameter changes
  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat && cat !== 'All') {
      setSelectedCategories(prev => (prev.includes(cat) ? prev : [cat]));
    }
  }, [searchParams]);

  // Extract unique categories & item counts
  const categoriesList = useMemo(() => {
    if (!products || products.length === 0) return [];
    const countsMap = new Map();
    products.forEach(p => {
      const cat = p.category || 'Uncategorized';
      countsMap.set(cat, (countsMap.get(cat) || 0) + 1);
    });
    return Array.from(countsMap.entries()).map(([name, count]) => ({ name, count }));
  }, [products]);

  // Category toggle handler (Multi-select checkbox)
  const toggleCategory = (catName) => {
    if (catName === 'All') {
      setSelectedCategories([]);
      searchParams.delete('cat');
      setSearchParams(searchParams);
      return;
    }

    setSelectedCategories(prev => {
      const next = prev.includes(catName)
        ? prev.filter(c => c !== catName)
        : [...prev, catName];

      if (next.length === 1) {
        setSearchParams({ cat: next[0] });
      } else {
        searchParams.delete('cat');
        setSearchParams(searchParams);
      }
      return next;
    });
  };

  // Price range checkbox toggle handler
  const togglePriceRange = (rangeKey) => {
    setSelectedPriceRanges(prev =>
      prev.includes(rangeKey) ? prev.filter(r => r !== rangeKey) : [...prev, rangeKey]
    );
  };

  // Filter & sort algorithm
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter(p => {
      const price = parseFloat(p.price || 0);

      // Category checkbox filter (Multi-select OR logic)
      if (selectedCategories.length > 0) {
        const pCat = (p.category || '').toLowerCase();
        const matchesCat = selectedCategories.some(c => c.toLowerCase() === pCat);
        if (!matchesCat) return false;
      }

      // Search filter (name or product_code or category)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (p.name || '').toLowerCase().includes(q);
        const matchCode = (p.product_code || '').toLowerCase().includes(q);
        const matchCat = (p.category || '').toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchCat) return false;
      }

      // Price slider min & max filter
      if (price < minPrice || price > maxPrice) {
        return false;
      }

      // Price range checkboxes (if any checked)
      if (selectedPriceRanges.length > 0) {
        const inUnder200 = selectedPriceRanges.includes('under200') && price < 200;
        const in200to500 = selectedPriceRanges.includes('200to500') && price >= 200 && price <= 500;
        const in500to1000 = selectedPriceRanges.includes('500to1000') && price >= 500 && price <= 1000;
        const inAbove1000 = selectedPriceRanges.includes('above1000') && price > 1000;

        if (!inUnder200 && !in200to500 && !in500to1000 && !inAbove1000) {
          return false;
        }
      }

      // Discount filter
      const mrp = parseFloat(p.mrp || p.original_price || p.price || 0);
      const discount = (mrp > 0 && mrp >= price) ? Math.round(((mrp - price) / mrp) * 100) : (p.discount_percentage || 0);
      if (minDiscount > 0 && discount < minDiscount) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const pA = parseFloat(a.price || 0);
      const pB = parseFloat(b.price || 0);

      const mrpA = parseFloat(a.mrp || a.original_price || a.price || 0);
      const mrpB = parseFloat(b.mrp || b.original_price || b.price || 0);

      const discA = mrpA > 0 ? ((mrpA - pA) / mrpA) * 100 : 0;
      const discB = mrpB > 0 ? ((mrpB - pB) / mrpB) * 100 : 0;

      if (sortBy === 'priceLow') return pA - pB;
      if (sortBy === 'priceHigh') return pB - pA;
      if (sortBy === 'discountHigh') return discB - discA;
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

  const activeFiltersCount = (selectedCategories.length > 0 ? 1 : 0) +
    (searchQuery !== '' ? 1 : 0) +
    (minPrice > 0 || maxPrice < highestCatalogPrice ? 1 : 0) +
    (selectedPriceRanges.length > 0 ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0);

  return (
    <div className="products-page bg-light min-vh-100">


      {/* Breadcrumb Bar */}
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

      {/* Main Content Layout */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 32px' }}>
        <div className="row">
          {/* Left Sidebar Filter Panel - Matching Reference UI */}
          <div className="col-lg-3 mb-4 mb-lg-0">
            <div className="bg-white shadow-sm border p-4 sticky-top" style={{ borderRadius: '16px', top: '70px', zIndex: 100 }}>
              {/* Filter Header */}
              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-4">
                <h4 className="font-weight-bold text-dark mb-0 d-flex align-items-center" style={{ fontSize: '1.25rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  <SlidersHorizontal size={20} className="mr-2 text-warning" color="#ff7011" />
                  Filters
                </h4>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetAllFilters}
                    className="btn btn-link p-0 text-danger small josefin d-flex align-items-center text-decoration-none font-weight-bold"
                  >
                    <RotateCcw size={12} className="mr-1" /> Clear ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Search Crackers */}
              <div className="mb-4">
                <label className="small font-weight-bold text-dark mb-2 josefin">Search Crackers</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control josefin"
                    placeholder="Search by name or code.."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ borderRadius: '10px', paddingLeft: '36px', height: '42px', fontSize: '0.9rem', borderColor: '#e2e8f0' }}
                  />
                  <Search size={16} className="position-absolute text-muted" style={{ left: '12px', top: '13px' }} />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="btn btn-link p-0 position-absolute text-muted"
                      style={{ right: '10px', top: '10px' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <hr className="my-4" style={{ borderColor: '#f1f5f9' }} />

              {/* Collapsible Categories Section with Checkboxes */}
              <div className="mb-4">
                <div
                  className="d-flex align-items-center justify-content-between cursor-pointer py-1"
                  onClick={() => setCatExpanded(!catExpanded)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="font-weight-bold text-dark" style={{ fontSize: '1.1rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Categories
                    </span>
                    <span className="badge badge-pill badge-light text-muted px-2 py-1" style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9' }}>
                      {categoriesList.length}
                    </span>
                  </div>
                  {catExpanded ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
                </div>

                {catExpanded && (
                  <div className="mt-3 pr-1" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {/* All Categories Checkbox option */}
                    <label
                      className="d-flex align-items-center justify-content-between py-2 px-2 rounded cursor-pointer mb-1"
                      style={{
                        backgroundColor: selectedCategories.length === 0 ? '#fff3ee' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                        <input
                          type="checkbox"
                          checked={selectedCategories.length === 0}
                          onChange={() => toggleCategory('All')}
                          style={{ width: '16px', height: '16px', accentColor: '#ff7011', cursor: 'pointer' }}
                        />
                        <span className={`josefin ${selectedCategories.length === 0 ? 'font-weight-bold text-warning' : 'text-dark'}`} style={{ fontSize: '0.9rem', color: selectedCategories.length === 0 ? '#ff7011' : '#334155' }}>
                          All Categories
                        </span>
                      </div>
                      <span className="badge badge-pill badge-light text-muted" style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9' }}>
                        {products.length}
                      </span>
                    </label>

                    {/* Category Checkbox Items */}
                    {categoriesList.map(({ name, count }) => {
                      const isChecked = selectedCategories.includes(name);
                      return (
                        <label
                          key={name}
                          className="d-flex align-items-center justify-content-between py-2 px-2 rounded cursor-pointer mb-1"
                          style={{
                            backgroundColor: isChecked ? '#fff3ee' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleCategory(name)}
                              style={{ width: '16px', height: '16px', accentColor: '#ff7011', cursor: 'pointer' }}
                            />
                            <span
                              className={`josefin text-truncate ${isChecked ? 'font-weight-bold' : ''}`}
                              style={{ fontSize: '0.9rem', color: isChecked ? '#ff7011' : '#334155', maxWidth: '140px' }}
                            >
                              {name}
                            </span>
                          </div>
                          <span
                            className={`badge badge-pill ${isChecked ? 'badge-warning text-white' : 'badge-light text-muted'}`}
                            style={{ fontSize: '0.75rem', backgroundColor: isChecked ? '#ff7011' : '#f1f5f9' }}
                          >
                            {count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <hr className="my-4" style={{ borderColor: '#f1f5f9' }} />

              {/* Collapsible Price Filter Section */}
              <div className="mb-4">
                <div
                  className="d-flex align-items-center justify-content-between cursor-pointer py-1"
                  onClick={() => setPriceExpanded(!priceExpanded)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="font-weight-bold text-dark" style={{ fontSize: '1.1rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Price Filter
                  </span>
                  {priceExpanded ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
                </div>

                {priceExpanded && (
                  <div className="mt-3">
                    {/* Price Range Slider */}
                    <div className="p-3 bg-light rounded" style={{ backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                      <div className="d-flex align-items-center justify-content-between small font-weight-bold josefin mb-2 text-dark">
                        <span>₹{minPrice}</span>
                        <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        className="custom-range"
                        min="0"
                        max={highestCatalogPrice}
                        step="50"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        style={{ accentColor: '#ff7011', cursor: 'pointer' }}
                      />
                      <div className="text-center small josefin text-muted mt-1">
                        Max Price: <strong>₹{maxPrice.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Product Grid Display */}
          <div className="col-lg-9">
            {/* Top Header Bar matching Reference UI */}
            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-3 pb-2 gap-3" style={{ gap: '16px' }}>
              <div>
                <h2 className="font-weight-bold text-dark mb-0" style={{ fontSize: '1.75rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {selectedCategories.length === 0
                    ? 'All Products'
                    : selectedCategories.length === 1
                    ? selectedCategories[0]
                    : `Selected (${selectedCategories.length} Categories)`}
                </h2>
              </div>

              <div className="d-flex align-items-center flex-wrap" style={{ gap: '16px' }}>
                <span className="text-muted josefin small font-weight-bold mb-0">
                  Showing {filteredProducts.length} of {products.length} Products
                </span>

                {/* Custom Styled Sort Dropdown */}
                <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                  <span className="text-muted josefin small font-weight-bold mb-0">Sort by:</span>
                  <div className="position-relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="josefin"
                      style={{
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        padding: '8px 36px 8px 14px',
                        fontSize: '0.88rem',
                        fontWeight: '600',
                        color: '#1e293b',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        outline: 'none'
                      }}
                    >
                      <option value="default">Default</option>
                      <option value="priceLow">Price: Low to High</option>
                      <option value="priceHigh">Price: High to Low</option>
                      <option value="discountHigh">Discount: High to Low</option>
                      <option value="nameAsc">Name: A to Z</option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="position-absolute text-muted"
                      style={{ right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Categories Filter Pills Row */}
            {selectedCategories.length > 0 && (
              <div className="d-flex flex-wrap align-items-center gap-2 mb-4" style={{ gap: '8px' }}>
                {selectedCategories.map(cat => (
                  <span
                    key={cat}
                    className="josefin font-weight-bold d-inline-flex align-items-center"
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      backgroundColor: '#fff3ee',
                      color: '#ff7011',
                      border: '1px solid #ff701133',
                      fontSize: '0.85rem'
                    }}
                  >
                    {cat}
                    <X
                      size={14}
                      className="ml-1 cursor-pointer"
                      onClick={() => toggleCategory(cat)}
                      style={{ cursor: 'pointer', opacity: 0.8 }}
                    />
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedCategories([])}
                  className="btn btn-link p-0 text-danger small josefin font-weight-bold text-decoration-none ml-2"
                  style={{ fontSize: '0.85rem' }}
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Products Grid */}
            {shopLoading ? (
              <div className="row">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="col-12 col-sm-6 col-md-4 mb-4">
                    <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                      <div className="p-3 text-center" style={{ backgroundColor: '#f5f5f7', borderRadius: '16px', margin: '8px 8px 0 8px' }}>
                        <div className="skeleton-pulse" style={{ height: '220px', borderRadius: '12px', backgroundColor: '#e2e8f0' }} />
                      </div>
                      <div className="card-body d-flex flex-column p-3">
                        <div className="skeleton-pulse mb-2" style={{ width: '40%', height: '14px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
                        <div className="skeleton-pulse mb-2" style={{ width: '85%', height: '20px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
                        <div className="skeleton-pulse mb-3" style={{ width: '30%', height: '12px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
                        <div className="mt-auto d-flex align-items-center justify-content-between">
                          <div className="skeleton-pulse" style={{ width: '45%', height: '26px', borderRadius: '6px', backgroundColor: '#e2e8f0' }} />
                          <div className="skeleton-pulse" style={{ width: '110px', height: '38px', borderRadius: '20px', backgroundColor: '#e2e8f0' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg border p-5 text-center my-3" style={{ borderRadius: '16px' }}>
                <div className="rounded-circle bg-light d-inline-flex p-4 mb-3">
                  <Search size={40} color="#94a3b8" />
                </div>
                <h4 className="acme text-dark mb-2">No Products Match Your Criteria</h4>
                <p className="text-muted josefin mb-4 max-w-md mx-auto" style={{ maxWidth: '400px' }}>
                  Try resetting your price range slider or clearing selected category checkboxes.
                </p>
                <button
                  onClick={handleResetAllFilters}
                  className="btn btn-warning text-white font-weight-bold acme rounded-pill px-4 py-2"
                  style={{ backgroundColor: '#ff7011', border: 'none' }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="row">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="col-12 col-sm-6 col-md-4 mb-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
