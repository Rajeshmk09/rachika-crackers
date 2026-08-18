import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function HeaderNav() {
  const { wishlistCount, cartCount, cartTotalPrice, pricelistUrl } = useShop();
  const location = useLocation();

  const handleDownloadPricelist = (e) => {
    if (pricelistUrl && pricelistUrl.startsWith('data:')) {
      e.preventDefault();
      try {
        const parts = pricelistUrl.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        const blob = new Blob([uInt8Array], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Sethu_Pyro_Park_Pricelist.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      } catch (err) {
        console.error('Error generating PDF download:', err);
        window.open(pricelistUrl, '_blank');
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbg navfont sticky-top" style={{ zIndex: 1020, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <div className="container">
        <button type="button" className="navbar-toggler mx-auto" data-toggle="collapse" data-target="#myNavbar">
          <span className="bi bi-list text-white"> Menu </span>
        </button>
        <div id="myNavbar" className="collapse navbar-collapse navfont">
          <ul className="navbar-nav mr-auto text-center align-items-center">
            <li className={`nav-item px-2 ${isActive('/') ? 'active' : ''}`}>
              <Link className="nav-link" to="/"> Home </Link>
            </li>
            <li className={`nav-item px-2 ${isActive('/about') ? 'active' : ''}`}>
              <Link className="nav-link" to="/about"> About </Link>
            </li>
            <li className={`nav-item px-2 ${isActive('/products') ? 'active' : ''}`}>
              <Link className="nav-link" to="/products"> Products </Link>
            </li>

            {/* Wishlist Link with Live Badge */}
            <li className={`nav-item px-2 ${isActive('/wishlist') ? 'active' : ''}`}>
              <Link
                className="nav-link d-inline-flex align-items-center"
                to="/wishlist"
                style={{ color: wishlistCount > 0 ? '#ff4d4f' : 'inherit' }}
              >
                <Heart size={16} fill={wishlistCount > 0 ? "#ff4d4f" : "none"} color={wishlistCount > 0 ? "#ff4d4f" : "currentColor"} className="mr-1" />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="badge badge-pill badge-danger ml-1" style={{ fontSize: '0.75rem', padding: '3px 7px' }}>
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </li>

            {/* Cart Link with Live Badge & Total */}
            <li className={`nav-item px-2 ${isActive('/cart') ? 'active' : ''}`}>
              <Link
                className="nav-link d-inline-flex align-items-center"
                to="/cart"
                style={{ color: cartCount > 0 ? '#ff7011' : 'inherit', fontWeight: cartCount > 0 ? '700' : 'normal' }}
              >
                <ShoppingCart size={16} className="mr-1" color={cartCount > 0 ? "#ff7011" : "currentColor"} />
                Cart
                {cartCount > 0 && (
                  <span className="badge badge-pill badge-warning ml-1 text-white" style={{ backgroundColor: '#ff7011', fontSize: '0.75rem', padding: '3px 7px' }}>
                    {cartCount} {cartTotalPrice > 0 ? `(₹${cartTotalPrice.toLocaleString('en-IN')})` : ''}
                  </span>
                )}
              </Link>
            </li>

            <li className={`nav-item px-2 ${isActive('/safetytips') ? 'active' : ''}`}>
              <Link className="nav-link" to="/safetytips">Safety Tips</Link>
            </li>
            <li className={`nav-item px-2 ${isActive('/contact') ? 'active' : ''}`}>
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
            <li className="nav-item px-2 text-center">
              <a className="pricelist_pdf blink" href={pricelistUrl || "/products"} onClick={handleDownloadPricelist} target="_blank" rel="noopener noreferrer">
                Download Pricelist
              </a>
            </li>
          </ul>
        </div> 	
      </div>	
    </nav>
  );
}
