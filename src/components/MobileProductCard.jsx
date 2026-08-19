import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

import fallbackImg from '../assets/fallbackimage.png';

const getFallback = () => {
  return fallbackImg;
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
      style={{
        borderRadius: '14px',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.09)',
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
        <div 
          onClick={() => product?.id && navigate(`/product/${product.id}`)}
          style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
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
        <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
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
          ) : (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                backgroundColor: '#ffffff', border: '1.5px solid #ff7011', borderRadius: '20px',
                padding: '0 4px', height: '32px', width: '100%'
              }}>
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
                  onClick={dec}
                  disabled={qty === 0}
                  style={{
                    background: 'none', border: 'none', color: qty === 0 ? '#cbd5e1' : '#ff7011',
                    fontSize: '1.1rem', fontWeight: '700',
                    cursor: qty === 0 ? 'not-allowed' : 'pointer', lineHeight: 1,
                    width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  value={qty === 0 ? '' : qty}
                  placeholder="0"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    updateCartQty(product.id, isNaN(val) || val < 0 ? 0 : val);
                  }}
                  min="0"
                  style={{
                    width: '32px',
                    textAlign: 'center',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    color: '#ff7011',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    padding: 0,
                    margin: 0,
                  }}
                />
                <button
                  type="button"
                  onClick={inc}
                  style={{
                    background: 'none', border: 'none', color: '#ff7011',
                    fontSize: '1.1rem', fontWeight: '700',
                    cursor: 'pointer', lineHeight: 1,
                    width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  +
                </button>
              </div>
              {qty > 0 && (
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  color: '#ff7011',
                  marginTop: '4px',
                  fontFamily: 'var(--josefin-font, sans-serif)',
                  textAlign: 'center'
                }}>
                  Total: ₹{(qty * price).toLocaleString('en-IN')}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
