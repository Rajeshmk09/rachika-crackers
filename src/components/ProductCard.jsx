import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

import FallbackImg15 from '../assets/home_img_15.webp';
import FallbackImg16 from '../assets/home_img_16.webp';
import FallbackImg17 from '../assets/home_img_17.webp';
import FallbackImg18 from '../assets/home_img_18.webp';
import FallbackImg19 from '../assets/home_img_19.webp';

const getCategoryFallbackImage = (catName = '') => {
  const cat = String(catName).toLowerCase();
  if (cat.includes('pot')) return FallbackImg16;
  if (cat.includes('sparkler') || cat.includes('star')) return FallbackImg17;
  if (cat.includes('sound') || cat.includes('bomb') || cat.includes('lakshmi')) return FallbackImg18;
  if (cat.includes('fountain') || cat.includes('peacock') || cat.includes('flower')) return FallbackImg19;
  return FallbackImg15;
};

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, cart, updateCartQty, addToCart } = useShop();

  const isWishlisted = isInWishlist(product.id);
  const currentCartQty = cart[product.id]?.qty || 0;

  const mrpVal = parseFloat(product.mrp || product.original_price || product.price || 0);
  const priceVal = parseFloat(product.price || 0);
  const discount = (mrpVal > 0 && mrpVal >= priceVal)
    ? Math.round(((mrpVal - priceVal) / mrpVal) * 100)
    : (product.discount_percentage || 0);

  const increment = (e) => {
    e.stopPropagation();
    if (currentCartQty === 0) {
      addToCart(product, 1);
    } else {
      updateCartQty(product.id, currentCartQty + 1);
    }
  };

  const decrement = (e) => {
    e.stopPropagation();
    if (currentCartQty > 0) {
      updateCartQty(product.id, currentCartQty - 1);
    }
  };

  const handleCardClick = () => {
    if (product && product.id) {
      navigate(`/product/${product.id}`);
    }
  };

  const fallbackImg = getCategoryFallbackImage(product.category);

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

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const displayImg = allImages[activeImgIdx] || allImages[0] || fallbackImg;

  return (
    <div
      onClick={handleCardClick}
      className="card product-card-premium h-100 shadow-sm border-0 cursor-pointer"
      style={{ borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
    >
      <div className="position-relative p-3 text-center" style={{ backgroundColor: '#f5f5f7', borderRadius: '16px', margin: '8px 8px 0 8px' }}>
        {/* Wishlist Button */}
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="btn btn-light rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center"
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          style={{ 
            position: 'absolute', 
            top: '15px', 
            right: '15px', 
            width: '36px', 
            height: '36px', 
            border: 'none',
            zIndex: 10,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: isWishlisted ? '#fff0f0' : '#ffffff'
          }}
        >
          <Heart size={18} fill={isWishlisted ? "#ff4d4f" : "none"} color={isWishlisted ? "#ff4d4f" : "#64748b"} />
        </button>

        {/* Product Image */}
        <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img
            src={displayImg}
            alt={product.name}
            className="img-fluid"
            style={{ maxHeight: '100%', objectFit: 'contain' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImg;
            }}
          />
        </div>

        {/* Thumbnails row (if multiple images) */}
        {allImages.length > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-1 mt-2" style={{ gap: '6px' }}>
            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImgIdx(idx);
                }}
                className="btn p-0 border-0"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: activeImgIdx === idx ? '2px solid #ff6b35' : '1px solid #d1d5db',
                  opacity: activeImgIdx === idx ? 1 : 0.6,
                  transition: 'all 0.15s ease',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={img}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImg;
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column p-3">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="text-muted small josefin font-weight-bold" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {product.category}
          </span>
          {discount > 0 && (
            <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>
              -{discount}% OFF
            </span>
          )}
        </div>

        <h5 className="card-title acme mb-1" style={{ fontSize: '1.1rem', color: '#1a1a1a', fontWeight: 'bold' }}>
          {product.name}
        </h5>
        
        <div className="text-muted small josefin mb-3">
          {product.order_unit || product.quantity || product.unit || ''}
        </div>
        
        <div className="mt-auto">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="d-flex align-items-baseline">
                <span className="font-weight-bold text-dark josefin" style={{ fontSize: '1.35rem' }}>
                  ₹{priceVal}
                </span>
                {mrpVal > priceVal && (
                  <span className="text-muted small ml-2 josefin" style={{ textDecoration: 'line-through', fontSize: '0.85rem' }}>
                    ₹{mrpVal}
                  </span>
                )}
              </div>
            </div>

            <div style={{ width: '130px' }} onClick={(e) => e.stopPropagation()}>
              {currentCartQty === 0 ? (
                <button
                  type="button"
                  onClick={increment}
                  className="btn btn-block font-weight-bold acme rounded-pill text-white py-2 btn-effect1"
                  style={{ backgroundColor: '#ff7011', border: 'none', fontSize: '0.9rem', boxShadow: 'none' }}
                >
                  Add to Cart
                </button>
              ) : (
                <div className="d-flex align-items-center justify-content-between rounded-pill p-1" style={{ backgroundColor: '#ff7011', height: '38px' }}>
                  <button
                    type="button"
                    onClick={decrement}
                    className="btn btn-link text-white p-0 d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none', boxShadow: 'none' }}
                  >
                    -
                  </button>
                  <span className="font-weight-bold josefin text-white px-2" style={{ fontSize: '1.1rem' }}>{currentCartQty}</span>
                  <button
                    type="button"
                    onClick={increment}
                    className="btn btn-link text-white p-0 d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none', boxShadow: 'none' }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
