import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowLeft, CheckCircle2, ShieldCheck, Truck, User, Phone, MapPin, Tag, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import HeaderNav from '../components/HeaderNav';

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

  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.phone) {
      setError('Please provide your Name and Mobile Phone Number.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://iplfsscpeixfxzbouhlp.supabase.co';
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const orderPayload = {
        name: orderForm.name,
        phone: orderForm.phone,
        address: `${orderForm.address}, ${orderForm.city}`,
        items: JSON.stringify(cartItems.map(i => ({
          product_code: i.product.product_code,
          name: i.product.name,
          quantity: i.qty,
          price: parseFloat(i.product.price || 0),
          unit: i.product.order_unit || i.product.quantity || i.product.unit || ''
        }))),
        status: 'Pending',
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error('Failed to submit order. Please try again.');
      }

      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.message || 'Something went wrong while placing your order.');
    } finally {
      setSubmitting(false);
    }
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
            <div className="rounded-circle bg-success text-white d-inline-flex p-3 mb-3">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="acme font-weight-bold text-success mb-2">Order Placed Successfully!</h3>
            <p className="text-muted josefin mb-4 max-w-md mx-auto" style={{ maxWidth: '500px' }}>
              Thank you for choosing Sethu Pyro Park Rachika Crackers. Our team will verify your order and contact you shortly at <strong>+91 {orderForm.phone}</strong> for order confirmation and dispatch details.
            </p>
            <Link
              to="/products"
              className="btn btn-lg font-weight-bold acme rounded-pill text-white px-5 py-3 shadow-sm"
              style={{ backgroundColor: '#ff7011', border: 'none' }}
            >
              Back to Catalog
            </Link>
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
            <div className="col-lg-8 mb-4">
              <div className="bg-white rounded-lg shadow-sm border p-3 p-md-4 mb-3">
                <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
                  <span className="font-weight-bold acme text-dark h5 mb-0">Added Items ({cartItems.length})</span>
                  <button
                    onClick={clearCart}
                    className="btn btn-link text-danger p-0 small josefin font-weight-bold text-decoration-none"
                  >
                    Clear All Items
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-borderless align-middle mb-0">
                    <thead>
                      <tr className="border-bottom text-muted small josefin text-uppercase">
                        <th>Product</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-right">Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map(({ product, qty }) => {
                        const mrp = parseFloat(product.mrp || product.original_price || product.price || 0);
                        const price = parseFloat(product.price || 0);
                        const subtotal = price * qty;

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
                          <tr key={product.id} className="border-bottom">
                            <td style={{ minWidth: '220px' }}>
                              <div className="d-flex align-items-center">
                                <div className="rounded border bg-light p-1 mr-3 flex-shrink-0" style={{ width: '60px', height: '60px' }}>
                                  {imgUrl ? (
                                    <img src={imgUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                  ) : (
                                    <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted small">
                                      📦
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="font-weight-bold text-dark acme mb-1" style={{ fontSize: '1rem' }}>
                                    {product.name}
                                  </div>
                                  <div className="text-muted small josefin">
                                    {product.order_unit || product.quantity || product.unit || ''}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="text-center align-middle">
                              <div className="font-weight-bold text-dark josefin">₹{price}</div>
                              {mrp > price && (
                                <div className="text-muted small josefin" style={{ textDecoration: 'line-through' }}>₹{mrp}</div>
                              )}
                            </td>
                            <td className="text-center align-middle">
                              <div className="d-inline-flex align-items-center rounded-pill p-1 border" style={{ backgroundColor: '#fff5ee', borderColor: '#ff7011' }}>
                                <button
                                  type="button"
                                  onClick={() => updateCartQty(product.id, qty - 1)}
                                  className="btn btn-link text-danger p-0 d-flex align-items-center justify-content-center"
                                  style={{ width: '26px', height: '26px', fontWeight: 'bold', textDecoration: 'none' }}
                                >
                                  -
                                </button>
                                <span className="font-weight-bold josefin px-2" style={{ fontSize: '1rem' }}>{qty}</span>
                                <button
                                  type="button"
                                  onClick={() => updateCartQty(product.id, qty + 1)}
                                  className="btn btn-link text-success p-0 d-flex align-items-center justify-content-center"
                                  style={{ width: '26px', height: '26px', fontWeight: 'bold', textDecoration: 'none' }}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="text-right align-middle">
                              <span className="font-weight-bold text-warning josefin" style={{ fontSize: '1.1rem', color: '#ff7011' }}>
                                ₹{subtotal.toLocaleString('en-IN')}
                              </span>
                            </td>
                            <td className="text-right align-middle">
                              <button
                                type="button"
                                onClick={() => removeFromCart(product.id)}
                                className="btn btn-link text-danger p-1"
                                title="Remove item"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Summary & Checkout Form */}
            <div className="col-lg-4">
              <div
                style={{
                  position: 'sticky',
                  top: '80px',
                  zIndex: 100,
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

                {/* Price Breakdown */}
                <div style={{ padding: '20px 24px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 600 }}>Total Items</span>
                    <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{cartCount} Pcs</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 600 }}>Total MRP</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'line-through' }}>₹{cartTotalMrp.toLocaleString('en-IN')}</span>
                  </div>
                  {cartTotalSavings > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', background: '#f0fdf4', borderRadius: '8px', padding: '7px 10px' }}>
                      <span style={{ color: '#16a34a', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Tag size={14} color="#16a34a" /> You Save
                      </span>
                      <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.95rem' }}>- ₹{cartTotalSavings.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff5ee', borderRadius: '12px', padding: '14px 16px', margin: '12px 0 20px' }}>
                    <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>Total Amount</span>
                    <span style={{ fontWeight: 900, color: '#ff7011', fontSize: '1.45rem', letterSpacing: '-0.5px' }}>
                      ₹{cartTotalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: '#f1f5f9', margin: '0 24px' }} />

                {/* Checkout Form */}
                <form onSubmit={handlePlaceOrder} style={{ padding: '20px 24px' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px' }}>
                    Delivery Details
                  </p>

                  {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', color: '#dc2626', fontSize: '0.84rem', fontWeight: 600 }}>
                      ⚠️ {error}
                    </div>
                  )}

                  {/* Name */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px' }}>
                      Full Name <span style={{ color: '#ff7011' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}><User size={16} color="#94a3b8" /></span>
                      <input
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 36px',
                          borderRadius: '10px',
                          border: '1.5px solid #e2e8f0',
                          fontSize: '0.9rem',
                          outline: 'none',
                          background: '#f8fafc',
                          color: '#1e293b',
                          fontWeight: 500,
                          transition: 'border 0.2s',
                          boxSizing: 'border-box'
                        }}
                        onFocus={e => e.target.style.borderColor = '#ff7011'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        placeholder="e.g. Ramesh Kumar"
                        value={orderForm.name}
                        onChange={e => setOrderForm({ ...orderForm, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px' }}>
                      Mobile Number <span style={{ color: '#ff7011' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}><Phone size={16} color="#94a3b8" /></span>
                      <input
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 36px',
                          borderRadius: '10px',
                          border: '1.5px solid #e2e8f0',
                          fontSize: '0.9rem',
                          outline: 'none',
                          background: '#f8fafc',
                          color: '#1e293b',
                          fontWeight: 500,
                          transition: 'border 0.2s',
                          boxSizing: 'border-box'
                        }}
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

                  {/* Address */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px' }}>
                      City / Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}><MapPin size={16} color="#94a3b8" /></span>
                      <input
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 36px',
                          borderRadius: '10px',
                          border: '1.5px solid #e2e8f0',
                          fontSize: '0.9rem',
                          outline: 'none',
                          background: '#f8fafc',
                          color: '#1e293b',
                          fontWeight: 500,
                          transition: 'border 0.2s',
                          boxSizing: 'border-box'
                        }}
                        onFocus={e => e.target.style.borderColor = '#ff7011'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        placeholder="e.g. Chennai / Madurai"
                        value={orderForm.city}
                        onChange={e => setOrderForm({ ...orderForm, city: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '14px',
                      border: 'none',
                      background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #ff7011 0%, #ff9944 100%)',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '1rem',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 15px rgba(255,112,17,0.35)',
                      transition: 'all 0.2s ease',
                      letterSpacing: '0.2px'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <ShoppingBag size={18} color="white" />
                      {submitting ? 'Placing Order...' : `Place Order · ₹${cartTotalPrice.toLocaleString('en-IN')}`}
                    </span>
                  </button>
                </form>

                {/* Trust badges */}
                <div style={{ background: '#f8fafc', padding: '14px 24px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#16a34a', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                    <ShieldCheck size={15} color="#16a34a" />
                    100% Genuine Sivakasi Factory Prices
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#64748b', fontSize: '0.78rem', fontWeight: 600 }}>
                    <Truck size={14} color="#64748b" />
                    Fast Delivery Across Tamil Nadu
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
