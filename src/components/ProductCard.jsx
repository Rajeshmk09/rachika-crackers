import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart! 🎆`);
  };

  return (
    <div className="product-card">
      {discount && <span className="discount-badge">-{discount}%</span>}
      <div className="product-img-wrap">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="product-img-placeholder">🎆</div>
        )}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-pricing">
          <span className="product-price">₹{product.price}</span>
          {product.original_price && (
            <span className="product-original">₹{product.original_price}</span>
          )}
        </div>
        <button
          className="add-cart-btn"
          onClick={handleAdd}
          disabled={product.stock === 0}
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
