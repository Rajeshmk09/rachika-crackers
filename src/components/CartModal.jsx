import React, { useState, useEffect } from 'react';
import { generateOrderPDF } from '../utils/generateOrderPDF';
import { ShoppingCart, Trash2, X, CheckCircle2, ShoppingBag, MapPin, Phone, User, Tag, AlertTriangle, FileText } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { toast } from 'react-hot-toast';
import fallbackImg from '../assets/fallbackimage.png';
import NameTooltip from './NameTooltip';

export default function CartModal() {
  const {
    cartItems,
    cartCount,
    cartTotalMrp,
    cartTotalPrice,
    cartTotalSavings,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartModalOpen,
    setCartModalOpen,
  } = useShop();

  const [orderForm, setOrderForm] = useState({ name: '', phone: '', address: '', isTamilNadu: true });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({ min_order_tn: 3000, min_order_other: 5000 });
  const [tipAnchor, setTipAnchor] = useState(null);

  // Load minimum order settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const cached = localStorage.getItem('sethupyropark_site_settings');
        if (cached) {
          const s = JSON.parse(cached);
          setSettings({
            min_order_tn: parseFloat(s.min_order_tn) || 3000,
            min_order_other: parseFloat(s.min_order_other) || 5000
          });
        }
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://iplfsscpeixfxzbouhlp.supabase.co';
        const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbGZzc2NwZWl4Znh6Ym91aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDQwNzksImV4cCI6MjEwMjUyMDA3OX0.nr2an5w0nX_L37C3g03HgzpFitueRNeOJ346TYvakZ8';
        const res = await fetch(`${SUPABASE_URL}/rest/v1/products?category=eq.__SITE_SETTINGS__`, {
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const s = JSON.parse(data[0].description || '{}');
            const newSettings = {
              min_order_tn: parseFloat(s.min_order_tn) || 3000,
              min_order_other: parseFloat(s.min_order_other) || 5000
            };
            setSettings(newSettings);
            try { localStorage.setItem('sethupyropark_site_settings', JSON.stringify(s)); } catch {}
          }
        }
      } catch (e) {}
    };
    if (cartModalOpen) {
      loadSettings();
    }
  }, [cartModalOpen]);

  // Handle body scroll locking
  useEffect(() => {
    if (cartModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [cartModalOpen]);

  if (!cartModalOpen) return null;

  const minOrderAmount = orderForm.isTamilNadu ? settings.min_order_tn : settings.min_order_other;
  const belowMinimum = minOrderAmount > 0 && cartTotalPrice < minOrderAmount;

  // Generate Receipt PDF (Tamil-safe via html2canvas)
  const generatePDF = async () => {
    await generateOrderPDF({ orderForm, cartItems, cartTotalPrice });
  };

  const handleEnquiry = (e) => {
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

    // Generate and Download PDF
    generatePDF();

    // Generate WhatsApp Message
    const itemLines = cartItems.map((item, idx) => {
      const price = parseFloat(item.product.price || 0);
      const unit = item.product.order_unit || item.product.quantity || item.product.unit || '';
      return `${idx + 1}. ${item.product.name}${unit ? ` (${unit})` : ''} — Qty: ${item.qty} x Rs.${price.toLocaleString('en-IN')} = Rs.${(price * item.qty).toLocaleString('en-IN')}`;
    }).join('\n');

    const whatsappMessage =
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
      window.open(`https://wa.me/918867390680?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    }, 800);

    // Save order in Supabase
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
    }).catch(() => {});

    setOrderSuccess(true);
    clearCart();
  };

  const handleClose = () => {
    setCartModalOpen(false);
    if (orderSuccess) {
      setOrderSuccess(false);
      setOrderForm({ name: '', phone: '', address: '', isTamilNadu: true });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000100,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.25s ease-out forwards',
      fontFamily: 'var(--josefin-font, sans-serif)',
    }}>
      {/* Styles */}
      <style>{`
        @keyframes fadeIn {
          from { background-color: rgba(0, 0, 0, 0); backdrop-filter: blur(0px); }
          to { background-color: rgba(0, 0, 0, 0.45); backdrop-filter: blur(5px); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .cart-modal-sidebar {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          max-width: 480px;
          box-shadow: -10px 0 35px rgba(0,0,0,0.15);
          position: relative;
        }
        .cart-modal-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }
        .form-region-btn {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          font-weight: 700;
          background: #ffffff;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.85rem;
        }
        .form-region-btn.active {
          border-color: #ff7011;
          color: #ff7011;
          background: #fff8f5;
        }
        .cart-input-field {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          outline: none;
          font-size: 0.9rem;
          transition: border-color 0.2s;
        }
        .cart-input-field:focus {
          border-color: #ff7011;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* Backdrop Area */}
      <div 
        onClick={handleClose}
        style={{
          position: 'absolute',
          inset: 0,
          cursor: 'pointer',
        }}
      />

      {/* Drawer Sidebar */}
      <div className="cart-modal-sidebar">
        
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0a539f',
          color: '#ffffff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={20} color="white" />
            <h5 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>
              Shopping Cart ({cartCount})
            </h5>
          </div>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
          >
            <X size={18} />
          </button>
        </div>

        {orderSuccess ? (
          /* Order Success Content */
          <div className="cart-modal-scroll" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
            <div style={{
              width: '80px', height: '80px',
              borderRadius: '50%',
              backgroundColor: '#f0fdf4',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px',
              border: '4px solid #bbf7d0',
            }}>
              <CheckCircle2 size={40} color="#22c55e" />
            </div>
            <h4 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>Enquiry Placed Successfully!</h4>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '30px' }}>
              We have generated your Enquiry Receipt PDF and initiated a WhatsApp chat to confirm your order details.
            </p>

            <button
              type="button"
              onClick={generatePDF}
              className="btn btn-block mb-3 d-flex align-items-center justify-content-center"
              style={{
                background: '#0a539f',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                gap: '8px',
              }}
            >
              <FileText size={18} />
              Re-Download PDF Receipt
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="btn btn-outline-secondary btn-block"
              style={{
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              Close & Continue Shopping
            </button>
          </div>
        ) : cartCount === 0 ? (
          /* Empty Cart Content */
          <div className="cart-modal-scroll" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
            <div style={{
              width: '90px', height: '90px',
              borderRadius: '50%',
              backgroundColor: '#fff7ed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <ShoppingCart size={36} color="#ff7011" />
            </div>
            <h5 style={{ fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Your Cart is Empty</h5>
            <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', maxWidth: '280px', marginBottom: '24px' }}>
              Explore our wide range of premium crackers and fireworks to add items to your cart!
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="btn rounded-pill px-4 py-2 font-weight-bold"
              style={{ backgroundColor: '#ff7011', color: 'white', border: 'none', fontSize: '0.9rem' }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* Normal Cart List & Form */
          <div className="cart-modal-scroll">
            
            {/* Items Section */}
            <h6 style={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px', marginBottom: '14px' }}>
              Items In Your Cart
            </h6>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {cartItems.map(({ product, qty }) => {
                const price = parseFloat(product.price || 0);
                const rawImg = product.image_url || product.image;
                let parsedImg = '';
                try {
                  const arr = JSON.parse(rawImg);
                  if (Array.isArray(arr) && arr[0]) parsedImg = arr[0];
                } catch (e) {
                  if (typeof rawImg === 'string') parsedImg = rawImg;
                }
                const displayImg = parsedImg || '';

                return (
                  <div key={product.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #f1f5f9',
                    backgroundColor: product.is_active === false ? '#f8fafc' : '#ffffff',
                  }}>
                    {/* Item Image */}
                    <div style={{
                      width: '50px', height: '50px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#f8fafc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      border: '1px solid #f1f5f9',
                    }}>
                      <img 
                        src={displayImg || fallbackImg} 
                        alt={product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                        onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg; }}
                      />
                    </div>

                    {/* Item Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700, fontSize: '0.85rem', color: '#1e293b',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTipAnchor({ rect: e.currentTarget.getBoundingClientRect(), text: product.name });
                        }}
                      >
                        {product.name}
                      </div>
                      <NameTooltip anchor={tipAnchor} onClose={() => setTipAnchor(null)} />
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                        {product.order_unit || product.quantity || product.unit || '1 Box'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#ff7011' }}>
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        {product.mrp && parseFloat(product.mrp) > price && (
                          <span style={{ textDecoration: 'line-through', fontSize: '0.78rem', color: '#94a3b8' }}>
                            ₹{parseFloat(product.mrp).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
                        Total: <span style={{ color: '#0a539f' }}>₹{(price * qty).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Actions: Stepper and Trash */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      
                      {/* Trash */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        style={{
                          background: 'none', border: 'none',
                          color: '#ef4444', opacity: 0.7,
                          padding: 2, cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>

                      {/* Stepper */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #ff701155',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        height: '26px',
                      }}>
                        <button
                          type="button"
                          onClick={() => updateCartQty(product.id, qty - 1)}
                          style={{
                            width: '24px', height: '100%',
                            border: 'none', background: 'transparent',
                            color: '#ff7011', fontWeight: 800,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: '1rem',
                          }}
                        >-</button>
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
                            width: '30px', height: '100%',
                            textAlign: 'center', border: 'none',
                            outline: 'none', fontSize: '0.8rem',
                            fontWeight: 800, color: '#ff7011',
                            padding: 0, margin: 0,
                          }}
                        />
                        <button
                          type="button"
                          disabled={product.is_active === false}
                          onClick={() => updateCartQty(product.id, qty + 1)}
                          style={{
                            width: '24px', height: '100%',
                            border: 'none', background: 'transparent',
                            color: product.is_active === false ? '#cbd5e1' : '#ff7011',
                            fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: product.is_active === false ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                          }}
                        >+</button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* User Form */}
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />
            <h6 style={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px', marginBottom: '14px' }}>
              Delivery Details
            </h6>

            <form onSubmit={handleEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Region Select */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'block' }}>
                  Delivery State
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className={`form-region-btn ${orderForm.isTamilNadu ? 'active' : ''}`}
                    onClick={() => setOrderForm(prev => ({ ...prev, isTamilNadu: true }))}
                  >
                    Tamil Nadu<br />
                    <span style={{ fontSize: '0.7rem', fontWeight: 'normal', opacity: 0.8 }}>Min: ₹{settings.min_order_tn.toLocaleString('en-IN')}</span>
                  </button>
                  <button
                    type="button"
                    className={`form-region-btn ${!orderForm.isTamilNadu ? 'active' : ''}`}
                    onClick={() => setOrderForm(prev => ({ ...prev, isTamilNadu: false }))}
                  >
                    Other States<br />
                    <span style={{ fontSize: '0.7rem', fontWeight: 'normal', opacity: 0.8 }}>Min: ₹{settings.min_order_other.toLocaleString('en-IN')}</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'block' }}>
                  Your Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }}>
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    className="cart-input-field"
                    style={{ paddingLeft: '32px' }}
                    placeholder="Enter your name"
                    value={orderForm.name}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'block' }}>
                  Mobile Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }}>
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    required
                    className="cart-input-field"
                    style={{ paddingLeft: '32px' }}
                    placeholder="Enter mobile number"
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'block' }}>
                  Full Delivery Address
                </label>
                <textarea
                  className="cart-input-field"
                  style={{ height: '70px', resize: 'none' }}
                  placeholder="Enter full shipping address"
                  value={orderForm.address}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              {error && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  fontSize: '0.78rem',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  border: '1px solid #fecaca',
                  display: 'flex',
                  alignItems: 'start',
                  gap: '6px',
                }}>
                  <AlertTriangle size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>{error}</div>
                </div>
              )}

              {/* Bottom Summary & Submit */}
              <div style={{
                paddingTop: '16px',
                borderTop: '1px solid #e2e8f0',
                marginTop: '16px',
              }}>
                {/* Calculations */}
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '14px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                    <span>Amount Payable:</span>
                    <span>₹{cartTotalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Min order message */}
                {belowMinimum && (
                  <div style={{
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fef3c7',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#d97706',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                    <span>
                      Minimum order for {orderForm.isTamilNadu ? 'TN' : 'Other States'} is ₹{minOrderAmount.toLocaleString('en-IN')}. Need ₹{(minOrderAmount - cartTotalPrice).toLocaleString('en-IN')} more.
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '30px',
                    border: 'none',
                    background: '#ff7011',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(255,112,17,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    marginBottom: '10px',
                  }}
                >
                  <ShoppingBag size={16} color="white" />
                  {`Place Enquiry · ₹${cartTotalPrice.toLocaleString('en-IN')}`}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
