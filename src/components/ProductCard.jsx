import React, { useState } from 'react';

export default function ProductCard({ product }) {
  const [qty, setQty] = useState(0);
  const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);

  const increment = () => {
    setQty(prev => prev + 1);
  };

  const decrement = () => {
    setQty(prev => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <div className="card product-card-premium h-100 shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
      {product.image && (
        <div className="p-3 text-center" style={{ backgroundColor: '#f5f5f7', borderRadius: '16px', margin: '8px 8px 0 8px' }}>
          <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={product.image} alt={product.name} className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain' }} />
          </div>
        </div>
      )}
      <div className="card-body d-flex flex-column p-3">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="text-muted small josefin font-weight-bold" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {product.category}
          </span>
          <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>
            -{discount}% OFF
          </span>
        </div>
        <h5 className="card-title acme mb-3" style={{ fontSize: '1.1rem', color: '#1a1a1a', fontWeight: 'bold' }}>
          {product.name}
        </h5>
        
        <div className="mt-auto">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="d-flex align-items-baseline">
                <span className="font-weight-bold text-dark josefin" style={{ fontSize: '1.35rem' }}>
                  ₹{product.price}
                </span>
                <span className="text-muted small ml-2 josefin" style={{ textDecoration: 'line-through', fontSize: '0.85rem' }}>
                  ₹{product.original_price}
                </span>
              </div>
              <div className="text-muted small josefin" style={{ marginTop: '-4px' }}>
                {product.unit}
              </div>
            </div>

            <div style={{ width: '130px' }}>
              {qty === 0 ? (
                <button
                  onClick={increment}
                  className="btn btn-block font-weight-bold acme rounded-pill text-white py-2 btn-effect1"
                  style={{ backgroundColor: '#ff7011', border: 'none', fontSize: '0.9rem', boxShadow: 'none' }}
                >
                  Add to Cart
                </button>
              ) : (
                <div className="d-flex align-items-center justify-content-between rounded-pill p-1" style={{ backgroundColor: '#ff7011', height: '38px' }}>
                  <button
                    onClick={decrement}
                    className="btn btn-link text-white p-0 d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none', boxShadow: 'none' }}
                  >
                    -
                  </button>
                  <span className="font-weight-bold josefin text-white px-2" style={{ fontSize: '1.1rem' }}>{qty}</span>
                  <button
                    onClick={increment}
                    className="btn btn-link text-white p-0 d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none', boxShadow: 'none' }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
