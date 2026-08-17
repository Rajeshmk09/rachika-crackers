import React from 'react';

export default function ProductCard({ product }) {
  const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);

  const handleOrder = () => {
    // Redirect to products page
    window.location.hash = '/products';
  };

  return (
    <div className="card product-card-premium h-100 shadow-sm border-0">
      <div className="position-relative">
        <span className="badge badge-danger position-absolute m-2" style={{ top: 0, left: 0, zIndex: 10, fontSize: '0.85rem' }}>
          -{discount}% OFF
        </span>
        <div className="product-img-wrap-premium text-center p-4 bg-light" style={{ minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '3.5rem' }}>🎆</span>
        </div>
      </div>
      <div className="card-body d-flex flex-column p-3">
        <span className="text-muted small mb-1 josefin font-weight-bold" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {product.category}
        </span>
        <h5 className="card-title acme mb-2" style={{ fontSize: '1.1rem', color: '#1a1a1a' }}>
          {product.name}
        </h5>
        <div className="mt-auto">
          <div className="d-flex align-items-baseline mb-2">
            <span className="h5 mb-0 font-weight-bold text-danger josefin">
              ₹{product.price}
            </span>
            <span className="text-muted small ml-2 josefin" style={{ textDecoration: 'line-through' }}>
              ₹{product.original_price}
            </span>
            <span className="text-muted small ml-auto josefin">
              {product.unit}
            </span>
          </div>
          <button
            onClick={handleOrder}
            className="btn btn-danger btn-block font-weight-bold acme rounded-pill py-2 btn-effect1"
            style={{ fontSize: '0.95rem' }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
