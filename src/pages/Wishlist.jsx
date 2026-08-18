import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import HeaderNav from '../components/HeaderNav';

import HomeImg1 from '../assets/home_img_11.png';
import HomeImg2 from '../assets/home_img_12.webp';

export default function Wishlist() {
  const { wishlist, wishlistCount, moveAllWishlistToCart, removeFromWishlist } = useShop();
  const navigate = useNavigate();

  const handleMoveAllToCart = () => {
    moveAllWishlistToCart();
    navigate('/cart');
  };

  return (
    <div className="wishlist-page bg-light min-vh-100">


      {/* Main Container */}
      <div className="container py-4 py-md-5">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-3 border-bottom">
          <div>
            <h2 className="acme font-weight-bold text-dark mb-1 d-flex align-items-center">
              <Heart className="mr-2 text-danger" fill="#ff4d4f" size={28} />
              My Saved Wishlist
            </h2>
            <p className="text-muted josefin mb-0">
              {wishlistCount > 0
                ? `You have ${wishlistCount} item${wishlistCount > 1 ? 's' : ''} saved in your favorite wishlist`
                : 'Your wishlist is currently empty'}
            </p>
          </div>

          <div className="mt-3 mt-md-0 d-flex gap-2">
            {wishlistCount > 0 && (
              <button
                onClick={handleMoveAllToCart}
                className="btn text-white font-weight-bold acme rounded-pill"
                style={{
                  backgroundColor: '#ff7011',
                  border: 'none',
                  padding: '10px 20px',
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ShoppingBag size={18} /> Move All to Cart
              </button>
            )}
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
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                whiteSpace: 'nowrap',
              }}
            >
              <ArrowLeft size={16} color="#1e293b" /> Continue Shopping
            </Link>
          </div>
        </div>

        {wishlistCount === 0 ? (
          <div className="text-center py-5 my-4 bg-white rounded-lg shadow-sm border p-5">
            <div className="rounded-circle bg-light d-inline-flex p-4 mb-3">
              <Heart size={48} color="#94a3b8" />
            </div>
            <h4 className="acme font-weight-bold text-dark mb-2">Your Wishlist is Empty</h4>
            <p className="text-muted josefin mb-4 max-w-md mx-auto" style={{ maxWidth: '400px' }}>
              Explore our Diwali crackers collection and click the heart icon on any product to save it to your wishlist!
            </p>
            <Link
              to="/products"
              className="btn btn-lg font-weight-bold acme rounded-pill text-white px-5 py-3 shadow-sm"
              style={{ backgroundColor: '#ff7011', border: 'none' }}
            >
              Browse Products Catalog
            </Link>
          </div>
        ) : (
          <div className="row">
            {wishlist.map((product) => (
              <div key={product.id} className="col-12 col-sm-6 col-lg-3 mb-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
