import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MessageCircle, ArrowLeft, ShoppingBag } from 'lucide-react';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export default function Order() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="order-empty">
        <ShoppingBag size={64} />
        <h2>Your cart is empty!</h2>
        <button onClick={() => navigate('/')}>← Back to Shop</button>
      </div>
    );
  }

  const buildWhatsAppMessage = () => {
    const lines = [
      `🎆 *New Order – Rachika Crackers*`,
      ``,
      `👤 *Customer Details*`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Address: ${form.address}`,
      ``,
      `🛒 *Order Items*`,
      ...cartItems.map(i => `• ${i.name} × ${i.qty} = ₹${(i.price * i.qty).toFixed(2)}`),
      ``,
      `💰 *Total: ₹${totalPrice.toFixed(2)}*`,
      ``,
      `Please confirm my order! 🙏`
    ];
    return encodeURIComponent(lines.join('\n'));
  };

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error('Please fill all fields!');
      return;
    }
    setLoading(true);
    try {
      await supabase.from('orders').insert({
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        items: cartItems,
        total: totalPrice,
        status: 'pending'
      });
      const msg = buildWhatsAppMessage();
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
      clearCart();
      window.open(waUrl, '_blank');
      toast.success('Order placed! Opening WhatsApp... 🎉');
      navigate('/');
    } catch (err) {
      toast.error('Failed to place order');
    }
    setLoading(false);
  };

  return (
    <div className="order-page">
      <div className="order-container">
        {/* Left: Form */}
        <div className="order-form-card">
          <button className="back-link" onClick={() => navigate('/')}>
            <ArrowLeft size={18} /> Back to Shop
          </button>
          <h2>📋 Your Order Details</h2>

          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              placeholder="e.g. Rajesh Kumar"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Delivery Address</label>
            <textarea
              placeholder="Full address with pincode..."
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              rows={4}
            />
          </div>

          <button
            className="whatsapp-btn"
            onClick={handleOrder}
            disabled={loading}
          >
            <MessageCircle size={22} />
            {loading ? 'Placing Order...' : 'Order via WhatsApp'}
          </button>
        </div>

        {/* Right: Order Summary */}
        <div className="order-summary-card">
          <h2>🛒 Order Summary</h2>
          <div className="summary-items">
            {cartItems.map(item => (
              <div className="summary-item" key={item.id}>
                <div className="summary-item-left">
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} />
                    : <div className="summary-img-placeholder">🎆</div>}
                  <div>
                    <p className="summary-item-name">{item.name}</p>
                    <p className="summary-item-cat">{item.category}</p>
                  </div>
                </div>
                <div className="summary-item-right">
                  <span>× {item.qty}</span>
                  <strong>₹{(item.price * item.qty).toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span>Total Amount</span>
            <strong>₹{totalPrice.toFixed(2)}</strong>
          </div>
          <div className="summary-note">
            🎉 Thank you for shopping with Rachika Crackers!
          </div>
        </div>
      </div>
    </div>
  );
}
