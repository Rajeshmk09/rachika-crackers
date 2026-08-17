import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, totalPrice, isCartOpen, setIsCartOpen, totalItems } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/order');
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h2><ShoppingBag size={20} /> My Cart ({totalItems})</h2>
          <button onClick={() => setIsCartOpen(false)}><X size={22} /></button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>🛒 Your cart is empty!</p>
            <span>Add some crackers to celebrate!</span>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-img">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} />
                      : <span>🎆</span>}
                  </div>
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">₹{item.price}</p>
                    <div className="qty-controls">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}><Minus size={14} /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={14} /></button>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}><X size={16} /></button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <strong>₹{totalPrice.toFixed(2)}</strong>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                🚀 Proceed to Order
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
