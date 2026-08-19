import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateOrderPDF } from '../utils/generateOrderPDF';
import { ShoppingCart, Trash2, ArrowLeft, CheckCircle2, ShieldCheck, Truck, User, Phone, MapPin, Tag, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import HeaderNav from '../components/HeaderNav';
import { toast } from 'react-hot-toast';
import fallbackImg from '../assets/fallbackimage.png';

import HomeImg1 from '../assets/home_img_11.png';
import HomeImg2 from '../assets/home_img_12.webp';

export default function Cart() {
  const {
    cartItems,
    cartCount,
    cartTotalMrp,
    cartTotalPrice,
    cartTotalSavings,
    updateCartQty,
    removeFromCart,
    clearCart,
  } = useShop();

  const [orderForm, setOrderForm] = useState({ name: '', phone: '', address: '', isTamilNadu: true });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({ min_order_tn: 0, min_order_other: 0 });

  // Load minimum order amount from Supabase (with localStorage fallback)
  useEffect(() => {
    const loadSettings = async () => {
      // Try localStorage cache first for instant load
      try {
        const cached = localStorage.getItem('sethupyropark_site_settings');
        if (cached) {
          const s = JSON.parse(cached);
          setSettings({
            min_order_tn: parseFloat(s.min_order_tn) || 0,
            min_order_other: parseFloat(s.min_order_other) || 0
          });
        }
      } catch {}

      // Fetch fresh from Supabase
      try {
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://iplfsscpeixfxzbouhlp.supabase.co';
        const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbGZzc2NwZWl4Znh6Ym91aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDQwNzksImV4cCI6MjEwMjUyMDA3OX0.nr2an5w0nX_L37C3g03HgzpFitueRNeOJ346TYvakZ8';
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/products?category=eq.__SITE_SETTINGS__&limit=1`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const s = JSON.parse(data[0].description || '{}');
            const newSettings = {
              min_order_tn: parseFloat(s.min_order_tn) || 0,
              min_order_other: parseFloat(s.min_order_other) || 0
            };
            setSettings(newSettings);
            try { localStorage.setItem('sethupyropark_site_settings', JSON.stringify(s)); } catch {}
          }
        }
      } catch {}
    };
    loadSettings();

    // Listen for live updates from admin panel
    const onUpdate = (e) => {
      setSettings({
        min_order_tn: parseFloat(e.detail?.min_order_tn) || 0,
        min_order_other: parseFloat(e.detail?.min_order_other) || 0
      });
    };
    window.addEventListener('site_settings_updated', onUpdate);
    return () => window.removeEventListener('site_settings_updated', onUpdate);
  }, []);

  const minOrderAmount = orderForm.isTamilNadu ? settings.min_order_tn : settings.min_order_other;
  const belowMinimum = minOrderAmount > 0 && cartTotalPrice < minOrderAmount;

  const handleEnquiry = async (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.phone) {
      setError('Please provide your Name and Mobile Number.');
      toast.error('Please provide your Name and Mobile Number.');
      return;
    }
    const hasInactive = cartItems.some(i => i.product.is_active === false);
    if (hasInactive) {
      setError('Your cart contains out-of-stock items. Please remove them.');
      toast.error('Your cart contains out-of-stock items. Please remove them.');
      return;
    }
    if (belowMinimum) {
      setError(`Minimum order amount for ${orderForm.isTamilNadu ? 'Tamil Nadu' : 'other states'} is ₹${minOrderAmount.toLocaleString('en-IN')}. Please add more items to your cart.`);
      toast.error(`Minimum order amount required is ₹${minOrderAmount.toLocaleString('en-IN')}. Current: ₹${cartTotalPrice.toLocaleString('en-IN')}`);
      return;
    }
    setError('');

    // ── Generate PDF (Tamil-safe via html2canvas) ──────────────────────────
    await generateOrderPDF({ orderForm, cartItems, cartTotalPrice });

    // ── WhatsApp text ─────────────────────────────────────
    const itemLines = cartItems.map((item, idx) => {
      const price = parseFloat(item.product.price || 0);
      const unit = item.product.order_unit || item.product.quantity || item.product.unit || '';
      return `${idx + 1}. ${item.product.name}${unit ? ` (${unit})` : ''} — Qty: ${item.qty} x Rs.${price.toLocaleString('en-IN')} = Rs.${(price * item.qty).toLocaleString('en-IN')}`;
    }).join('\n');

    const message =
`*ORDER ENQUIRY — Sethu Pyro Park*

Name: ${orderForm.name}
Phone: ${orderForm.phone}
Region: ${orderForm.isTamilNadu ? 'Tamil Nadu' : 'Other State'}${orderForm.address ? `\nAddress: ${orderForm.address}` : ''}

*Items:*
${itemLines}

*Amount Payable: Rs.${cartTotalPrice.toLocaleString('en-IN')}*

_(PDF order sheet has been downloaded separately)_
Kindly confirm my order. Thank you!`;

    setTimeout(() => {
      window.open(`https://wa.me/918867390680?text=${encodeURIComponent(message)}`, '_blank');
    }, 800);

    // Save order to Supabase in background after WhatsApp opens
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://iplfsscpeixfxzbouhlp.supabase.co';
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbGZzc2NwZWl4Znh6Ym91aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDQwNzksImV4cCI6MjEwMjUyMDA3OX0.nr2an5w0nX_L37C3g03HgzpFitueRNeOJ346TYvakZ8';
    fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        customer_name: orderForm.name,
        phone: orderForm.phone,
        address: `[${orderForm.isTamilNadu ? 'Tamil Nadu' : 'Other State'}] ${orderForm.address}`,
        items: JSON.stringify(cartItems.map(i => ({
          product_code: i.product.product_code,
          name: i.product.name,
          quantity: i.qty,
          price: parseFloat(i.product.price || 0),
          unit: i.product.order_unit || i.product.quantity || i.product.unit || '',
        }))),
        total: cartTotalPrice,
        status: 'Payment Pending',
      }),
    }).catch(() => {});  // fail silently — WhatsApp already opened

    setOrderSuccess(true);
    clearCart();
  };

  return (
    <div className="cart-page bg-light min-vh-100">


      <div className="container py-4 py-md-5">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-3 border-bottom">
          <div>
            <h2 className="acme font-weight-bold text-dark mb-1 d-flex align-items-center">
              <ShoppingCart className="mr-2 text-warning" size={28} color="#ff7011" />
              Shopping Cart &amp; Checkout
            </h2>
            <p className="text-muted josefin mb-0">
              {cartCount > 0
                ? `You have ${cartCount} item${cartCount > 1 ? 's' : ''} in your cart`
                : 'Your cart is currently empty'}
            </p>
          </div>

          <div className="mt-3 mt-md-0">
            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                border: '1.5px solid #cbd5e1',
                borderRadius: '50px',
                padding: '8px 20px',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <ArrowLeft size={16} color="#1e293b" /> Continue Shopping
            </Link>
          </div>
        </div>

        {orderSuccess ? (
          <div className="bg-white rounded-lg shadow-sm border p-5 text-center my-4">
            <div className="rounded-circle bg-success text-white d-inline-flex p-3 mb-4">
              <CheckCircle2 size={48} />
            </div>
            <div className="mt-2">
              <Link
                to="/products"
                className="btn btn-lg font-weight-bold acme rounded-pill text-white px-5 py-3 shadow-sm"
                style={{ backgroundColor: '#ff7011', border: 'none' }}
              >
                Back to Catalog
              </Link>
            </div>
          </div>
        ) : cartCount === 0 ? (
          <div className="text-center py-5 my-4 bg-white rounded-lg shadow-sm border p-5">
            <div className="rounded-circle bg-light d-inline-flex p-4 mb-3">
              <ShoppingCart size={48} color="#94a3b8" />
            </div>
            <h4 className="acme font-weight-bold text-dark mb-2">Your Cart is Empty</h4>
            <p className="text-muted josefin mb-4 max-w-md mx-auto" style={{ maxWidth: '400px' }}>
              You haven't added any crackers to your cart yet. Explore our wide range of Sivakasi crackers and add your items!
            </p>
            <Link
              to="/products"
              className="btn btn-lg font-weight-bold acme rounded-pill text-white px-5 py-3 shadow-sm"
              style={{ backgroundColor: '#ff7011', border: 'none' }}
            >
              Start Shopping Now
            </Link>
          </div>
        ) : (
          <div className="row">
            {/* Cart Items List */}
            <div className="col-12 mb-4">
              <div className="bg-white rounded-lg shadow-sm border p-3 p-md-4 mb-3">
                {/* Cart header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1.5px solid #f8fafc' }}>
                  <span className="font-weight-bold acme text-dark h5 mb-0">Added Items ({cartItems.length})</span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="btn btn-link text-danger p-0 small josefin font-weight-bold text-decoration-none"
                  >
                    Clear All Items
                  </button>
                </div>

                {cartItems.some(i => i.product.is_active === false) && (
                  <div style={{
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    color: '#b91c1c',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>⚠️</span>
                    <span>Your cart contains out-of-stock items. Please remove them before placing an enquiry.</span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cartItems.map(({ product, qty }) => {
                    const mrp = parseFloat(product.mrp || product.original_price || product.price || 0);
                    const price = parseFloat(product.price || 0);
                    const subtotal = price * qty;
                    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

                    const imgUrl = (() => {
                      const raw = product.image_url || product.image;
                      if (!raw) return '';
                      try {
                        const arr = JSON.parse(raw);
                        if (Array.isArray(arr)) return arr[0];
                      } catch (e) {}
                      return raw;
                    })();

                    return (
                      <div key={product.id} style={{
                        background: '#fff',
                        borderRadius: '16px',
                        border: '1px solid #e8edf2',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                        overflow: 'hidden',
                      }}>
                        {/* Top row: image + info + delete */}
                        <div style={{ display: 'flex', gap: '12px', padding: '14px 14px 10px' }}>
                          {/* Image */}
                          <div style={{
                            width: '72px', height: '72px', borderRadius: '12px',
                            background: '#f8fafc', border: '1px solid #e2e8f0',
                            flexShrink: 0, overflow: 'hidden', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                          }}>
                            <img 
                              src={imgUrl || fallbackImg} 
                              alt={product.name} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                              onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg; }}
                            />
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="acme" style={{ fontSize: '0.97rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.3, marginBottom: '3px' }}>
                              {product.name}
                            </div>
                            {product.is_active === false && (
                              <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '4px', textTransform: 'uppercase' }}>
                                ✗ Out of Stock (Please remove this item)
                              </div>
                            )}
                            <div className="josefin" style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
                              {product.order_unit || product.quantity || product.unit || ''}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span className="josefin" style={{ fontWeight: 800, color: '#ff7011', fontSize: '1rem' }}>₹{price}</span>
                              {mrp > price && (
                                <span className="josefin" style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>₹{mrp}</span>
                              )}
                              {discount > 0 && (
                                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '1px 5px' }}>
                                  {discount}% OFF
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            style={{ background: '#fff0f0', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, alignSelf: 'flex-start' }}
                            title="Remove"
                          >
                            <Trash2 size={14} color="#ef4444" />
                          </button>
                        </div>

                        {/* Bottom row: qty stepper + subtotal */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 14px', borderTop: '1px solid #f1f5f9', background: '#fafbfc' }}>
                          {/* Qty stepper */}
                          <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1.5px solid #ff7011', borderRadius: '10px', overflow: 'hidden' }}>
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
                              onClick={() => updateCartQty(product.id, qty - 1)}
                              style={{ width: '36px', height: '36px', border: 'none', background: 'transparent', fontWeight: 700, fontSize: '1.15rem', color: '#ff7011', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >−</button>
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
                                width: '36px',
                                height: '36px',
                                textAlign: 'center',
                                fontWeight: 800,
                                fontSize: '0.95rem',
                                color: '#ff7011',
                                borderLeft: '1px solid #ff701133',
                                borderRight: '1px solid #ff701133',
                                borderTop: 'none',
                                borderBottom: 'none',
                                background: 'transparent',
                                outline: 'none',
                                padding: 0,
                                margin: 0,
                              }}
                            />
                            <button
                              type="button"
                              disabled={product.is_active === false}
                              onClick={() => updateCartQty(product.id, qty + 1)}
                              style={{
                                width: '36px', height: '36px', border: 'none',
                                background: 'transparent', fontWeight: 700, fontSize: '1.15rem',
                                color: product.is_active === false ? '#cbd5e1' : '#ff7011',
                                cursor: product.is_active === false ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}
                            >+</button>
                          </div>

                          {/* Subtotal */}
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, marginBottom: '1px' }}>SUBTOTAL</div>
                            <div className="josefin" style={{ fontWeight: 900, fontSize: '1.15rem', color: '#ff7011' }}>
                              ₹{subtotal.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary & Checkout Form */}
            <div className="col-12">
              <div
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                  border: '1.5px solid #f1f5f9',
                  background: '#fff',
                }}
              >
                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg, #ff7011 0%, #ff9944 100%)', padding: '20px 24px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShoppingCart size={20} color="white" />
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', letterSpacing: '0.3px' }}>Order Summary</span>
                  </div>
                </div>

                {/* Price + Form — full width horizontal layout */}
                <div style={{ padding: '24px 28px' }}>
                  {/* Price row */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Items</span>
                      <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>{cartCount} Pcs</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>MRP</span>
                      <span style={{ color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'line-through' }}>₹{cartTotalMrp.toLocaleString('en-IN')}</span>
                    </div>
                    {cartTotalSavings > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                        <Tag size={14} color="#16a34a" />
                        <span style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 700 }}>You Save</span>
                        <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.95rem' }}>₹{cartTotalSavings.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px', background: '#fff5ee', borderRadius: '14px', padding: '12px 22px', border: '1.5px solid #fed7aa' }}>
                      <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>Total</span>
                      <span style={{ fontWeight: 900, color: '#ff7011', fontSize: '1.6rem', letterSpacing: '-1px' }}>
                        ₹{cartTotalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Delivery form — horizontal fields */}
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>
                    Delivery Details
                  </p>

                  {/* Minimum order warning */}
                  {belowMinimum && (
                    <div style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: 12, padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.88rem' }}>Minimum Order Amount: ₹{minOrderAmount.toLocaleString('en-IN')}</div>
                        <div style={{ color: '#b45309', fontSize: '0.82rem', marginTop: 2 }}>
                          Your cart total is ₹{cartTotalPrice.toLocaleString('en-IN')}. Add ₹{(minOrderAmount - cartTotalPrice).toLocaleString('en-IN')} more to place an enquiry.
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', color: '#dc2626', fontSize: '0.84rem', fontWeight: 600 }}>
                      ⚠️ {error}
                    </div>
                  )}

                  <form onSubmit={handleEnquiry}>
                    {/* Delivery Region Selection */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px' }}>
                        Delivery Region / State <span style={{ color: '#ff7011' }}>*</span>
                      </label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          type="button"
                          onClick={() => setOrderForm({ ...orderForm, isTamilNadu: true })}
                          style={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: orderForm.isTamilNadu ? '2px solid #ff7011' : '1.5px solid #cbd5e1',
                            background: orderForm.isTamilNadu ? '#fff5ee' : '#ffffff',
                            color: orderForm.isTamilNadu ? '#ff7011' : '#475569',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span style={{ fontSize: '1.2rem' }}>🏛️</span> Tamil Nadu
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderForm({ ...orderForm, isTamilNadu: false })}
                          style={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: !orderForm.isTamilNadu ? '2px solid #3b82f6' : '1.5px solid #cbd5e1',
                            background: !orderForm.isTamilNadu ? '#eff6ff' : '#ffffff',
                            color: !orderForm.isTamilNadu ? '#3b82f6' : '#475569',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span style={{ fontSize: '1.2rem' }}>🇮🇳</span> Other States
                        </button>
                      </div>
                    </div>

                    {/* Row 1: Name + Phone */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                      <div style={{ flex: '1 1 200px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                          Full Name <span style={{ color: '#ff7011' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}><User size={16} color="#94a3b8" /></span>
                          <input
                            style={{ width: '100%', padding: '11px 12px 11px 36px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: '#f8fafc', color: '#1e293b', fontWeight: 500, boxSizing: 'border-box' }}
                            onFocus={e => e.target.style.borderColor = '#ff7011'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            placeholder="e.g. Ramesh Kumar"
                            value={orderForm.name}
                            onChange={e => setOrderForm({ ...orderForm, name: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div style={{ flex: '1 1 180px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                          Mobile Number <span style={{ color: '#ff7011' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}><Phone size={16} color="#94a3b8" /></span>
                          <input
                            style={{ width: '100%', padding: '11px 12px 11px 36px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: '#f8fafc', color: '#1e293b', fontWeight: 500, boxSizing: 'border-box' }}
                            onFocus={e => e.target.style.borderColor = '#ff7011'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            type="tel"
                            placeholder="e.g. 9876543210"
                            value={orderForm.phone}
                            onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Full Address */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                        Full Address
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '11px', top: '13px', display: 'flex' }}><MapPin size={16} color="#94a3b8" /></span>
                        <textarea
                          rows={2}
                          style={{ width: '100%', padding: '11px 12px 11px 36px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: '#f8fafc', color: '#1e293b', fontWeight: 500, boxSizing: 'border-box', resize: 'none', fontFamily: 'inherit' }}
                          onFocus={e => e.target.style.borderColor = '#ff7011'}
                          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                          placeholder="e.g. 12, Gandhi Street, Madurai, Tamil Nadu - 625001"
                          value={orderForm.address}
                          onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Row 3: Enquiry button — full width */}
                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '13px 32px',
                        borderRadius: '12px',
                        border: 'none',
                        background: '#ff7011',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(255,112,17,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      }}
                    >
                      <ShoppingBag size={18} color="white" />
                      {`Enquiry · ₹${cartTotalPrice.toLocaleString('en-IN')}`}
                    </button>

                  </form>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
