import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Truck, ShieldCheck, Share2, MessageCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import HeaderNav from '../components/HeaderNav';
import ProductCard from '../components/ProductCard';
import MobileProductCard from '../components/MobileProductCard';
import TopMarquee from '../components/TopMarquee';

import HomeImg1 from '../assets/websitelogo.png';
import HomeImg2 from '../assets/home_img_2.jpeg';

import fallbackImg from '../assets/fallbackimage.png';

const getCategoryFallbackImage = () => {
  return fallbackImg;
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, toggleWishlist, isInWishlist, cart, addToCart, updateCartQty } = useShop();

  const [product, setProduct] = useState(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    const found = products.find(p => String(p.id) === String(id));
    if (found) {
      setProduct(found);
      setLoading(false);
    } else {
      // Fetch directly from API if not in context products list
      const fetchSingleProduct = async () => {
        setLoading(true);
        try {
          const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://iplfsscpeixfxzbouhlp.supabase.co';
          const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbGZzc2NwZWl4Znh6Ym91aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDQwNzksImV4cCI6MjEwMjUyMDA3OX0.nr2an5w0nX_L37C3g03HgzpFitueRNeOJ346TYvakZ8';
          const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data[0]) {
              setProduct(data[0]);
            }
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchSingleProduct();
    }
  }, [id, products]);

  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <HeaderNav />
        <div className="container py-5 text-center">
          <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem', color: '#ff7011' }}>
            <span className="sr-only">Loading product...</span>
          </div>
          <p className="josefin text-muted mt-3">Loading Product Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-light min-vh-100">
        <HeaderNav />
        <div className="container py-5 text-center">
          <h3 className="acme text-dark mb-3">Product Not Found</h3>
          <p className="josefin text-muted mb-4">The product you are looking for does not exist or has been removed.</p>
          <Link to="/products" className="btn btn-warning text-white font-weight-bold acme rounded-pill px-4 py-2" style={{ backgroundColor: '#ff7011', border: 'none' }}>
            Back to Products Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const currentCartQty = cart[product.id]?.qty || 0;

  const mrpVal = parseFloat(product.mrp || product.original_price || product.price || 0);
  const priceVal = parseFloat(product.price || 0);
  const discount = (mrpVal > 0 && mrpVal >= priceVal)
    ? Math.round(((mrpVal - priceVal) / mrpVal) * 100)
    : (product.discount_percentage || 0);

  const fallbackImg = getCategoryFallbackImage(product.category);

  // Parse 3 slide gallery images (Main + 3 Slides = 4 slots total)
  const allImages = (() => {
    const raw = product.image_url || product.image;
    if (!raw) return [fallbackImg];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.filter(Boolean).length > 0) {
        return parsed.filter(Boolean);
      }
    } catch (e) {}
    if (typeof raw === 'string' && raw.trim() !== '') {
      return [raw];
    }
    return [fallbackImg];
  })();

  const displayImg = allImages[activeImgIdx] || allImages[0] || fallbackImg;

  // Similar Products recommendation (same category first, fallback to other products)
  const similarProducts = (() => {
    if (!product || !products || products.length === 0) return [];
    
    const sameCat = products.filter(p => 
      String(p.id) !== String(product.id) &&
      (p.category || '').toLowerCase() === (product.category || '').toLowerCase()
    );

    if (sameCat.length >= 4) {
      return sameCat.slice(0, 4);
    }

    const otherProds = products.filter(p => 
      String(p.id) !== String(product.id) &&
      !sameCat.some(sc => String(sc.id) === String(p.id))
    );

    return [...sameCat, ...otherProds].slice(0, 4);
  })();

  const handleBuyNow = () => {
    if (currentCartQty === 0) {
      addToCart(product, 1);
    }
    navigate('/cart');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppInquiry = () => {
    const message = `Hello Sethu Pyro Park, I am interested in buying ${product.name} (${product.product_code}) priced at ₹${priceVal}. Please share availability.`;
    window.open(`https://wa.me/918867390680?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="product-details-page bg-light min-vh-100">


      {/* Breadcrumb Bar */}
      <div className="bg-white border-bottom py-2">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent p-0 m-0 small josefin">
              <li className="breadcrumb-item"><Link to="/" className="text-muted">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/products" className="text-muted">Products</Link></li>
              <li className="breadcrumb-item"><span className="text-muted">{product.category}</span></li>
              <li className="breadcrumb-item active text-dark font-weight-bold" aria-current="page">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="container py-4 py-md-5">
        <div className="bg-white rounded-lg shadow-sm border p-4 p-md-5">
          <div className="row">
            {/* Left Column: Image Showcase & Bottom 3 Slide Thumbnails */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="mb-3 w-100" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="d-flex align-items-center justify-content-center btn btn-light rounded-pill px-3 py-1 font-weight-bold josefin text-dark border btn-effect1"
                  style={{ 
                    fontSize: '0.85rem', 
                    color: '#ff7011', 
                    borderColor: '#ff7011',
                    backgroundColor: '#ffffff',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    boxShadow: 'none'
                  }}
                >
                  <ArrowLeft size={14} color="#ff7011" />
                  Back
                </button>
              </div>
              <div className="position-relative bg-light rounded-lg p-4 text-center border mb-3" style={{ borderRadius: '16px', backgroundColor: '#f8fafc' }}>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className="btn btn-light rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center"
                  title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '42px',
                    height: '42px',
                    border: 'none',
                    zIndex: 10,
                    cursor: 'pointer',
                    backgroundColor: isWishlisted ? '#fff0f0' : '#ffffff'
                  }}
                >
                  <Heart size={22} fill={isWishlisted ? "#ff4d4f" : "none"} color={isWishlisted ? "#ff4d4f" : "#64748b"} />
                </button>

                <div style={{ height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {displayImg ? (
                    <img src={displayImg} alt={product.name} className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div className="text-muted display-4">🎆</div>
                  )}
                </div>
              </div>

              {/* Bottom 3 Slide Image Thumbnails */}
              {allImages.length > 0 && (
                <div className="d-flex align-items-center justify-content-start gap-2 mt-3 mx-auto mx-lg-0" style={{ gap: '10px', flexWrap: 'nowrap', width: 'fit-content' }}>
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImgIdx(idx)}
                      className="btn p-0 border-0"
                      style={{
                        width: isMobile ? '60px' : '80px',
                        height: isMobile ? '60px' : '80px',
                        flexShrink: 0,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: activeImgIdx === idx ? '3px solid #ff7011' : '1px solid #e2e8f0',
                        opacity: activeImgIdx === idx ? 1 : 0.65,
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        boxShadow: activeImgIdx === idx ? '0 4px 12px rgba(255, 112, 17, 0.25)' : 'none'
                      }}
                    >
                      <img src={img} alt={`Slide ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Meta, Pricing, Packaging Unit & Actions */}
            <div className="col-lg-6 d-flex flex-column pl-lg-4">
              {/* Product Code & Category */}
              <div className="d-flex align-items-center gap-2 mb-2" style={{ gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-secondary josefin" style={{ fontSize: isMobile ? '0.68rem' : '0.8rem', padding: isMobile ? '4px 8px' : '6px 12px', backgroundColor: '#e2e8f0', color: '#475569' }}>
                  Code: {product.product_code}
                </span>
                <span className="badge badge-primary josefin" style={{ fontSize: isMobile ? '0.68rem' : '0.8rem', padding: isMobile ? '4px 8px' : '6px 12px', backgroundColor: '#fff3ee', color: '#ff7011', border: '1px solid #ff701133' }}>
                  Category: {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="acme font-weight-bold text-dark mb-2" style={{ fontSize: isMobile ? '1.35rem' : '2rem', lineHeight: '1.25' }}>
                {product.name}
              </h1>

              {/* Stock Badge */}
              <div className="mb-3">
                {product.is_active !== false ? (
                  <span className="badge rounded-pill josefin" style={{ backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #05966933', fontSize: isMobile ? '0.72rem' : '0.85rem', padding: isMobile ? '4px 10px' : '6px 14px' }}>
                    ✓ In Stock
                  </span>
                ) : (
                  <span className="badge rounded-pill josefin" style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #ef444433', fontSize: isMobile ? '0.72rem' : '0.85rem', padding: isMobile ? '4px 10px' : '6px 14px' }}>
                    ✗ Out of Stock
                  </span>
                )}
              </div>

              {/* Pricing Display */}
              <div className="bg-light rounded-lg border mb-3" style={{ backgroundColor: '#fafafa', borderRadius: '12px', padding: isMobile ? '10px 12px' : '16px' }}>
                <div className="d-flex align-items-baseline" style={{ gap: isMobile ? '6px' : '12px', flexWrap: 'wrap' }}>
                  <span className="acme font-weight-bold text-dark" style={{ fontSize: isMobile ? '1.6rem' : '2.5rem', color: '#0f172a' }}>
                    ₹{priceVal}
                  </span>
                  {mrpVal > priceVal && (
                    <>
                      <span className="text-muted josefin" style={{ fontSize: isMobile ? '0.9rem' : '1.25rem', textDecoration: 'line-through' }}>
                        ₹{mrpVal}
                      </span>
                      <span className="badge badge-danger font-weight-bold josefin" style={{ fontSize: isMobile ? '0.7rem' : '0.9rem', padding: isMobile ? '4px 8px' : '6px 12px' }}>
                        SAVE {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                {mrpVal > priceVal && (
                  <div className="text-success josefin font-weight-bold mt-1" style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                    🎉 You save ₹{(mrpVal - priceVal).toLocaleString('en-IN')} on this item!
                  </div>
                )}
              </div>

              {/* Packaging Unit Details */}
              <div className="mb-3">
                <label className="text-muted font-weight-bold josefin text-uppercase mb-1" style={{ letterSpacing: '0.5px', fontSize: isMobile ? '0.68rem' : '0.75rem' }}>
                  Packaging &amp; Order Unit:
                </label>
                <div className="rounded-lg border bg-white d-inline-flex align-items-center w-100" style={{ borderRadius: '10px', padding: isMobile ? '8px 12px' : '12px 16px' }}>
                  <span className="font-weight-bold text-dark josefin" style={{ fontSize: isMobile ? '0.9rem' : '1.05rem' }}>
                    {product.order_unit || product.quantity || product.unit || '1 Box'}
                  </span>
                </div>
              </div>

              {/* Action Button: Add to Cart */}
              <div className="mb-2">
                {product.is_active === false ? (
                  <button
                    type="button"
                    disabled
                    className="btn btn-secondary btn-block font-weight-bold acme rounded-pill text-white shadow-sm"
                    style={{ backgroundColor: '#94a3b8', border: 'none', fontSize: isMobile ? '1rem' : '1.15rem', padding: isMobile ? '10px' : '14px', cursor: 'not-allowed', opacity: 0.9 }}
                  >
                    Out of Stock
                  </button>
                ) : (
                  <div className="d-flex align-items-center justify-content-between rounded-pill p-2 border w-100" style={{ backgroundColor: '#ffffff', border: '2px solid #ff7011', minHeight: '52px' }}>
                    <style>{`
                      input::-webkit-outer-spin-button,
                      input::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                      }
                      input[type=number] {
                        -moz-appearance: textfield;
                      }
                    `}</style>
                    <button
                      type="button"
                      onClick={() => updateCartQty(product.id, currentCartQty - 1)}
                      disabled={currentCartQty === 0}
                      className="btn btn-link p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '38px', height: '38px', fontSize: '1.4rem', fontWeight: 'bold', textDecoration: 'none', color: currentCartQty === 0 ? '#cbd5e1' : '#ff7011', cursor: currentCartQty === 0 ? 'not-allowed' : 'pointer' }}
                    >
                      -
                    </button>
                    <div className="d-flex align-items-center justify-content-center">
                      <input
                        type="number"
                        value={currentCartQty === 0 ? '' : currentCartQty}
                        placeholder="0"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          updateCartQty(product.id, isNaN(val) || val < 0 ? 0 : val);
                        }}
                        min="0"
                        style={{
                          width: '50px',
                          textAlign: 'center',
                          fontWeight: '800',
                          fontSize: '1.25rem',
                          color: '#ff7011',
                          border: 'none',
                          background: 'transparent',
                          outline: 'none',
                          padding: 0,
                          margin: 0,
                        }}
                      />
                      <span className="font-weight-bold josefin pl-1" style={{ fontSize: '1.25rem', color: '#ff7011' }}>in Cart</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => currentCartQty === 0 ? addToCart(product, 1) : updateCartQty(product.id, currentCartQty + 1)}
                      className="btn btn-link p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '38px', height: '38px', fontSize: '1.4rem', fontWeight: 'bold', textDecoration: 'none', color: '#ff7011', cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Crackers Recommendations */}
        {similarProducts.length > 0 && (
          <div className="mt-5 pt-4 border-top">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
              <div style={{ textAlign: isMobile ? 'center' : 'left', width: '100%' }}>
                <h3 className="acme font-weight-bold text-dark mb-1" style={{ color: '#0f172a', fontSize: isMobile ? '1.3rem' : '1.75rem' }}>
                  Similar Crackers You Might Like
                </h3>
                <p className="text-muted josefin mb-0" style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>
                  Discover top-selling {product.category} and popular Sivakasi wholesale crackers
                </p>
              </div>
              <Link to="/products" className="btn btn-outline-warning rounded-pill px-4 py-2 josefin font-weight-bold text-dark mt-3 mt-md-0" style={{ borderColor: '#ff7011', color: '#ff7011' }}>
                View All Products
              </Link>
            </div>

            <div className="row">
              {similarProducts.map((simProd) => (
                <div key={simProd.id} className="col-6 col-sm-6 col-lg-3 mb-4">
                  {isMobile ? <MobileProductCard product={simProd} /> : <ProductCard product={simProd} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
