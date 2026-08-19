import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

import FallbackImg15 from '../assets/home_img_15.webp';
import FallbackImg16 from '../assets/home_img_16.webp';
import FallbackImg17 from '../assets/home_img_17.webp';
import FallbackImg18 from '../assets/home_img_18.webp';
import FallbackImg19 from '../assets/home_img_19.webp';

const getFallback = (cat = '') => {
  const c = String(cat).toLowerCase();
  if (c.includes('pot')) return FallbackImg16;
  if (c.includes('sparkler') || c.includes('star')) return FallbackImg17;
  if (c.includes('sound') || c.includes('bomb') || c.includes('lakshmi')) return FallbackImg18;
  if (c.includes('fountain') || c.includes('peacock') || c.includes('flower')) return FallbackImg19;
  return FallbackImg15;
};

export default function MobileProductCard({ product }) {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, cart, updateCartQty, addToCart } = useShop();

  const isWishlisted = isInWishlist(product.id);
  const qty = cart[product.id]?.qty || 0;

  const mrp   = parseFloat(product.mrp || product.original_price || product.price || 0);
  const price = parseFloat(product.price || 0);
  const disc  = mrp > 0 && mrp >= price
    ? Math.round(((mrp - price) / mrp) * 100)
    : (product.discount_percentage || 0);

  const fallback = getFallback(product.category);

  const imgSrc = (() => {
    const raw = product.image_url || product.image;
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed[0]) return parsed[0];
    } catch (_) {}
    return typeof raw === 'string' && raw.trim() ? raw : fallback;
  })();

  const inc = (e) => {
    e.stopPropagation();
    qty === 0 ? addToCart(product, 1) : updateCartQty(product.id, qty + 1);
  };
  const dec = (e) => {
    e.stopPropagation();
    if (qty > 0) updateCartQty(product.id, qty - 1);
  };

  return (
    <div
      onClick={() => product?.id && navigate(`/product/${product.id}`)}
      style={{
        borderRadius: '14px',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.09)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Image area */}
      <div style={{ position: 'relative', backgroundColor: '#f5f5f7', padding: '8px' }}>

        {/* Discount badge */}
        {disc > 0 && product.is_active !== false && (
          <span style={{
            position: 'absolute', top: '6px', left: '6px',
            background: '#e53935', color: '#fff',
            fontSize: '0.65rem', fontWeight: '700',
            padding: '2px 6px', borderRadius: '4px', zIndex: 2,
          }}>
            -{disc}%
          </span>
        )}

        {/* Out of Stock badge */}
        {product.is_active === false && (
          <span style={{
            position: 'absolute', top: '6px', left: '6px',
            background: '#ef4444', color: '#fff',
            fontSize: '0.6rem', fontWeight: '700',
            padding: '2px 6px', borderRadius: '4px', zIndex: 10,
            textTransform: 'uppercase',
          }}>
            Out of Stock
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          style={{
            position: 'absolute', top: '6px', right: '6px',
            width: '28px', height: '28px', borderRadius: '50%',
            background: isWishlisted ? '#fff0f0' : '#fff',
            border: 'none', cursor: 'pointer', zIndex: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          }}
        >
          <Heart size={14} fill={isWishlisted ? '#ff4d4f' : 'none'} color={isWishlisted ? '#ff4d4f' : '#64748b'} />
        </button>

        {/* Product image */}
        <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={imgSrc}
            alt={product.name}
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: product.is_active === false ? 'grayscale(0.8) opacity(0.6)' : 'none' }}
            onError={(e) => { e.target.onerror = null; e.target.src = fallback; }}
          />
        </div>
      </div>

      {/* Info area */}
      <div style={{ padding: '8px 8px 10px', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Category */}
        <div style={{
          fontSize: '0.62rem', fontWeight: '700', color: '#94a3b8',
          textTransform: 'uppercase', letterSpacing: '0.4px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginBottom: '3px',
        }}>
          {product.category}
        </div>

        {/* Name */}
        <div style={{
          fontSize: '0.82rem', fontWeight: '700', color: '#1a1a1a',
          lineHeight: '1.2',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
          marginBottom: '3px',
        }}>
          {product.name}
        </div>

        {/* Unit */}
        <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '6px' }}>
          {product.order_unit || product.quantity || product.unit || ''}
        </div>

        {/* Price row */}
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '1rem', fontWeight: '800', color: '#1a1a1a' }}>₹{price}</span>
          {mrp > price && (
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '5px' }}>₹{mrp}</span>
          )}
        </div>

        {/* Add to Cart */}
        <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 'auto' }}>
          {product.is_active === false ? (
            <button
              type="button"
              disabled
              style={{
                width: '100%', padding: '7px 0',
                backgroundColor: '#94a3b8', color: '#fff',
                border: 'none', borderRadius: '20px',
                fontSize: '0.78rem', fontWeight: '700',
                cursor: 'not-allowed', letterSpacing: '0.3px',
                opacity: 0.9,
              }}
            >
              Out of Stock
            </button>
          ) : qty === 0 ? (
            <button
              type="button"
              onClick={inc}
              style={{
                width: '100%', padding: '7px 0',
                backgroundColor: '#ff7011', color: '#fff',
                border: 'none', borderRadius: '20px',
                fontSize: '0.78rem', fontWeight: '700',
                cursor: 'pointer', letterSpacing: '0.3px',
              }}
            >
              Add to Cart
            </button>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: '#ff7011', borderRadius: '20px',
              padding: '4px 8px', height: '32px',
            }}>
              <button type="button" onClick={dec} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', lineHeight: 1 }}>-</button>
              <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.9rem' }}>{qty}</span>
              <button type="button" onClick={inc} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', lineHeight: 1 }}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
