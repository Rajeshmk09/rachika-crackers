import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <Sparkles size={28} className="logo-icon" />
          <span>Rachika Crackers</span>
        </Link>

        <div className="navbar-actions">
          <Link to="/admin" className="admin-btn">Admin</Link>
          <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={22} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}
