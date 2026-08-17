import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/#products' },
  { label: 'Admin Panel', to: '/admin' },
];

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();
  const isHome = location.pathname === '/';

  // On home page we show a sticky minimal navbar on scroll, on other pages always show
  return (
    <nav className={`main-nav ${isHome ? 'home-nav' : ''}`}>
      <div className="main-nav-inner">
        <Link to="/" className="nav-brand">🎆 Rachika Crackers</Link>
        <div className="nav-links">
          {NAV_LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link-item ${location.pathname === l.to ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
          <ShoppingCart size={20} />
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          {totalItems > 0 && <span className="cart-count-text">Cart ({totalItems})</span>}
        </button>
      </div>
    </nav>
  );
}
