import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, removeFromCart, updateCartQty } = useCart();
  
  // Find if this product is in the cart and get its current quantity
  const cartItem = cartItems.find((item) => item.product === product._id);
  const qtyInCart = cartItem ? cartItem.qty : 0;

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Product Image Link (Clickable for details) */}
      <Link to={`/product/${product._id}`} style={{ display: 'block', overflow: 'hidden', aspectRatio: '1/1' }}>
        <img 
          src={product.image || 'https://via.placeholder.com/400'} 
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </Link>

      <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '5px' }}>
          {product.category?.name || 'Category'}
        </p>
        <Link to={`/product/${product._id}`}>
          <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--primary)', lineHeight: '1.3', height: '2.6em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.name}</h3>
        </Link>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '15px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.8em' }}>
          {product.description}
        </p>
        <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent)' }}>
            ₹{product.price?.toFixed(2)}
          </span>

          {/* Interactive Cart Controllers */}
          {product.countInStock === 0 ? (
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--error)' }}>
              Out of Stock
            </span>
          ) : qtyInCart === 0 ? (
            <button 
              onClick={() => addToCart(product, 1)}
              className="btn btn-primary" 
              style={{ 
                padding: '6px 12px', 
                fontSize: '0.8rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                borderRadius: '20px'
              }}
            >
              <ShoppingCart size={14} />
              Add
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => {
                  if (qtyInCart === 1) {
                    removeFromCart(product._id);
                  } else {
                    updateCartQty(product._id, qtyInCart - 1);
                  }
                }}
                className="btn btn-outline" 
                style={{ 
                  padding: 0, 
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)',
                  fontWeight: '700',
                  backgroundColor: 'transparent'
                }}
              >
                -
              </button>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', minWidth: '16px', textAlign: 'center' }}>
                {qtyInCart}
              </span>
              <button 
                onClick={() => {
                  updateCartQty(product._id, Math.min(qtyInCart + 1, product.countInStock));
                }}
                className="btn btn-primary" 
                style={{ 
                  padding: 0, 
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700'
                }}
                disabled={qtyInCart >= product.countInStock}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
